import { describe, expect, it } from 'vitest';

import { generateJwt, inspectRegisteredClaims, parseJwt, verifyJwtSignature } from './jwt';

const encoder = new TextEncoder();

function toBase64Url(value: Uint8Array): string {
	return Buffer.from(value)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/g, '');
}

function createSigningInput(header: Record<string, unknown>, payload: Record<string, unknown>): string {
	return `${toBase64Url(encoder.encode(JSON.stringify(header)))}.${toBase64Url(encoder.encode(JSON.stringify(payload)))}`;
}

async function signHs256(signingInput: string, secret: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
	return toBase64Url(new Uint8Array(signature));
}

async function exportPublicKeyPem(key: CryptoKey): Promise<string> {
	const exported = await crypto.subtle.exportKey('spki', key);
	const base64 = Buffer.from(new Uint8Array(exported)).toString('base64');
	const lines = base64.match(/.{1,64}/g) ?? [];
	return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
}

async function exportPrivateKeyPem(key: CryptoKey): Promise<string> {
	const exported = await crypto.subtle.exportKey('pkcs8', key);
	const base64 = Buffer.from(new Uint8Array(exported)).toString('base64');
	const lines = base64.match(/.{1,64}/g) ?? [];
	return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
}

describe('parseJwt', () => {
	it('decodes header and payload JSON', () => {
		const signingInput = createSigningInput(
			{ alg: 'HS256', typ: 'JWT' },
			{ sub: '123', role: 'admin' }
		);
		const parsed = parseJwt(`${signingInput}.c2ln`);

		expect(parsed.header.alg).toBe('HS256');
		expect(parsed.payload.sub).toBe('123');
		expect(parsed.signature.length).toBeGreaterThan(0);
	});

	it('rejects malformed tokens', () => {
		expect(() => parseJwt('not-a-jwt')).toThrow(/3 dot-separated segments/);
	});
});

describe('verifyJwtSignature', () => {
	it('verifies a valid HS256 token', async () => {
		const signingInput = createSigningInput({ alg: 'HS256', typ: 'JWT' }, { sub: 'user-1' });
		const token = `${signingInput}.${await signHs256(signingInput, 'topsecret')}`;

		await expect(verifyJwtSignature({ token, key: 'topsecret' })).resolves.toMatchObject({
			status: 'valid'
		});
	});

	it('rejects an HS256 token signed with another secret', async () => {
		const signingInput = createSigningInput({ alg: 'HS256', typ: 'JWT' }, { sub: 'user-1' });
		const token = `${signingInput}.${await signHs256(signingInput, 'topsecret')}`;

		await expect(verifyJwtSignature({ token, key: 'wrong-secret' })).resolves.toMatchObject({
			status: 'invalid'
		});
	});

	it('verifies a valid RS256 token with a PEM public key', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{
				name: 'RSASSA-PKCS1-v1_5',
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: 'SHA-256'
			},
			true,
			['sign', 'verify']
		);
		const signingInput = createSigningInput({ alg: 'RS256', typ: 'JWT' }, { sub: 'rsa-user' });
		const signature = await crypto.subtle.sign(
			'RSASSA-PKCS1-v1_5',
			keyPair.privateKey,
			encoder.encode(signingInput)
		);
		const token = `${signingInput}.${toBase64Url(new Uint8Array(signature))}`;
		const publicKeyPem = await exportPublicKeyPem(keyPair.publicKey);

		await expect(verifyJwtSignature({ token, key: publicKeyPem })).resolves.toMatchObject({
			status: 'valid'
		});
	});
});

describe('generateJwt', () => {
	it('generates an unsigned alg=none token', async () => {
		const result = await generateJwt({
			header: { alg: 'none', typ: 'JWT' },
			payload: { sub: 'guest' }
		});

		expect(result.token.endsWith('.')).toBe(true);
		expect(parseJwt(result.token).payload.sub).toBe('guest');
	});

	it('generates and verifies an HS256 token', async () => {
		const result = await generateJwt({
			header: { alg: 'HS256', typ: 'JWT' },
			payload: { sub: 'generated-user' },
			key: 'topsecret'
		});

		await expect(verifyJwtSignature({ token: result.token, key: 'topsecret' })).resolves.toMatchObject({
			status: 'valid'
		});
	});

	it('generates and verifies an RS256 token', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{
				name: 'RSASSA-PKCS1-v1_5',
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: 'SHA-256'
			},
			true,
			['sign', 'verify']
		);
		const privateKeyPem = await exportPrivateKeyPem(keyPair.privateKey);
		const publicKeyPem = await exportPublicKeyPem(keyPair.publicKey);
		const result = await generateJwt({
			header: { alg: 'RS256', typ: 'JWT' },
			payload: { sub: 'generated-rsa-user' },
			key: privateKeyPem
		});

		await expect(verifyJwtSignature({ token: result.token, key: publicKeyPem })).resolves.toMatchObject({
			status: 'valid'
		});
	});
});

describe('inspectRegisteredClaims', () => {
	it('reports exp, nbf, and iat statuses relative to now', () => {
		const now = new Date('2026-03-22T00:00:00.000Z');
		const claims = inspectRegisteredClaims(
			{
				exp: 1774137600,
				nbf: 1774300000,
				iat: 1774300000
			},
			now
		);

		expect(claims).toEqual([
			expect.objectContaining({ name: 'exp', status: 'expired' }),
			expect.objectContaining({ name: 'nbf', status: 'not-yet-valid' }),
			expect.objectContaining({ name: 'iat', status: 'future-issued' })
		]);
	});
});
