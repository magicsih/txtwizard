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

function joseToDer(signature: Uint8Array, partLength: number): Uint8Array {
	const r = trimLeadingZeros(signature.slice(0, partLength));
	const s = trimLeadingZeros(signature.slice(partLength));
	const derR = needsDerPadding(r) ? Uint8Array.from([0, ...r]) : r;
	const derS = needsDerPadding(s) ? Uint8Array.from([0, ...s]) : s;
	const payloadLength = 2 + derR.length + 2 + derS.length;

	return Uint8Array.from([
		0x30,
		...encodeDerLength(payloadLength),
		0x02,
		...encodeDerLength(derR.length),
		...derR,
		0x02,
		...encodeDerLength(derS.length),
		...derS
	]);
}

function trimLeadingZeros(value: Uint8Array): Uint8Array {
	let index = 0;
	while (index < value.length - 1 && value[index] === 0) {
		index += 1;
	}

	return value.slice(index);
}

function needsDerPadding(value: Uint8Array): boolean {
	return value.length > 0 && (value[0] & 0x80) === 0x80;
}

function encodeDerLength(length: number): number[] {
	if (length < 0x80) {
		return [length];
	}

	const bytes: number[] = [];
	let remaining = length;

	while (remaining > 0) {
		bytes.unshift(remaining & 0xff);
		remaining >>= 8;
	}

	return [0x80 | bytes.length, ...bytes];
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

	it('verifies a valid ES256 token with a PEM public key', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{
				name: 'ECDSA',
				namedCurve: 'P-256'
			},
			true,
			['sign', 'verify']
		);
		const privateKeyPem = await exportPrivateKeyPem(keyPair.privateKey);
		const publicKeyPem = await exportPublicKeyPem(keyPair.publicKey);
		const result = await generateJwt({
			header: { alg: 'ES256', typ: 'JWT' },
			payload: { sub: 'ecdsa-user' },
			key: privateKeyPem
		});

		await expect(verifyJwtSignature({ token: result.token, key: publicKeyPem })).resolves.toMatchObject({
			status: 'valid'
		});
	});

	it('verifies an ES256 token whose signature segment is DER encoded', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{
				name: 'ECDSA',
				namedCurve: 'P-256'
			},
			true,
			['sign', 'verify']
		);
		const signingInput = createSigningInput({ alg: 'ES256', typ: 'JWT' }, { sub: 'der-user' });
		const signature = await crypto.subtle.sign(
			{ name: 'ECDSA', hash: 'SHA-256' },
			keyPair.privateKey,
			encoder.encode(signingInput)
		);
		const rawSignature = new Uint8Array(signature);
		const derSignature =
			rawSignature.length === 64 ? joseToDer(rawSignature, 32) : rawSignature;
		const publicKeyPem = await exportPublicKeyPem(keyPair.publicKey);
		const token = `${signingInput}.${toBase64Url(derSignature)}`;

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

	it('generates and verifies a PS256 token', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{
				name: 'RSA-PSS',
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
			header: { alg: 'PS256', typ: 'JWT' },
			payload: { sub: 'generated-ps-user' },
			key: privateKeyPem
		});

		await expect(verifyJwtSignature({ token: result.token, key: publicKeyPem })).resolves.toMatchObject({
			status: 'valid'
		});
	});

	it('generates and verifies an ES256 token', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{ name: 'ECDSA', namedCurve: 'P-256' },
			true,
			['sign', 'verify']
		);
		const privateKeyPem = await exportPrivateKeyPem(keyPair.privateKey);
		const publicKeyPem = await exportPublicKeyPem(keyPair.publicKey);
		const result = await generateJwt({
			header: { alg: 'ES256', typ: 'JWT' },
			payload: { sub: 'generated-ec-user' },
			key: privateKeyPem
		});

		await expect(verifyJwtSignature({ token: result.token, key: publicKeyPem })).resolves.toMatchObject({
			status: 'valid'
		});
	});

	it('generates and verifies an ES384 token', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{ name: 'ECDSA', namedCurve: 'P-384' },
			true,
			['sign', 'verify']
		);
		const privateKeyPem = await exportPrivateKeyPem(keyPair.privateKey);
		const publicKeyPem = await exportPublicKeyPem(keyPair.publicKey);
		const result = await generateJwt({
			header: { alg: 'ES384', typ: 'JWT' },
			payload: { sub: 'generated-ec384-user' },
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
