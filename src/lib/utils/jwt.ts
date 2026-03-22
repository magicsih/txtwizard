import { Buffer } from 'buffer';

export type JwtValue = Record<string, unknown>;
export type JwtSecretEncoding = 'utf-8' | 'base64' | 'hex';

export type ParsedJwt = {
	token: string;
	headerSegment: string;
	payloadSegment: string;
	signatureSegment: string;
	signingInput: string;
	header: JwtValue;
	payload: JwtValue;
	signature: Uint8Array;
};

export type ClaimStatus = {
	name: 'exp' | 'nbf' | 'iat';
	value: number;
	iso: string;
	status: 'valid' | 'expired' | 'not-yet-valid' | 'future-issued';
	message: string;
};

export type JwtVerificationResult = {
	status: 'valid' | 'invalid' | 'unsupported' | 'missing-key' | 'not-applicable';
	message: string;
};

export type JwtGenerationResult = {
	token: string;
	header: JwtValue;
	payload: JwtValue;
};

export type JwtAlgorithm = keyof typeof HASH_BY_JWT_ALG | 'none';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const HASH_BY_JWT_ALG = {
	HS256: 'SHA-256',
	HS384: 'SHA-384',
	HS512: 'SHA-512',
	RS256: 'SHA-256',
	RS384: 'SHA-384',
	RS512: 'SHA-512',
	PS256: 'SHA-256',
	PS384: 'SHA-384',
	PS512: 'SHA-512',
	ES256: 'SHA-256',
	ES384: 'SHA-384',
	ES512: 'SHA-512'
} as const;

const ECDSA_CURVE_BY_ALG = {
	ES256: 'P-256',
	ES384: 'P-384',
	ES512: 'P-521'
} as const;

const RSA_PSS_SALT_LENGTH = {
	PS256: 32,
	PS384: 48,
	PS512: 64
} as const;

export function parseJwt(token: string): ParsedJwt {
	const trimmedToken = token.trim();
	const segments = trimmedToken.split('.');

	if (segments.length !== 3) {
		throw new Error('JWT must contain exactly 3 dot-separated segments.');
	}

	const [headerSegment, payloadSegment, signatureSegment] = segments;

	if (!headerSegment || !payloadSegment) {
		throw new Error('JWT header and payload segments are required.');
	}

	return {
		token: trimmedToken,
		headerSegment,
		payloadSegment,
		signatureSegment,
		signingInput: `${headerSegment}.${payloadSegment}`,
		header: parseJwtSegment(headerSegment, 'header'),
		payload: parseJwtSegment(payloadSegment, 'payload'),
		signature: decodeBase64Url(signatureSegment)
	};
}

export function inspectRegisteredClaims(
	payload: JwtValue,
	now = new Date()
): ClaimStatus[] {
	const nowSeconds = Math.floor(now.getTime() / 1000);
	const claims: ClaimStatus[] = [];

	for (const claimName of ['exp', 'nbf', 'iat'] as const) {
		const value = payload[claimName];
		if (typeof value !== 'number' || !Number.isFinite(value)) {
			continue;
		}

		const iso = new Date(value * 1000).toISOString();

		if (claimName === 'exp') {
			claims.push({
				name: claimName,
				value,
				iso,
				status: value > nowSeconds ? 'valid' : 'expired',
				message: value > nowSeconds ? 'Token is not expired.' : 'Token has expired.'
			});
			continue;
		}

		if (claimName === 'nbf') {
			claims.push({
				name: claimName,
				value,
				iso,
				status: value <= nowSeconds ? 'valid' : 'not-yet-valid',
				message:
					value <= nowSeconds ? 'Token is active for use.' : 'Token cannot be used yet.'
			});
			continue;
		}

		claims.push({
			name: claimName,
			value,
			iso,
			status: value <= nowSeconds ? 'valid' : 'future-issued',
			message:
				value <= nowSeconds ? 'Issued-at time is in the past.' : 'Issued-at time is in the future.'
		});
	}

	return claims;
}

export async function verifyJwtSignature(params: {
	token: string;
	key: string;
	secretEncoding?: JwtSecretEncoding;
}): Promise<JwtVerificationResult> {
	const parsed = parseJwt(params.token);
	const algorithm = typeof parsed.header.alg === 'string' ? parsed.header.alg : '';

	if (!algorithm) {
		return { status: 'unsupported', message: 'JWT header is missing an alg value.' };
	}

	if (algorithm === 'none') {
		return parsed.signature.length === 0
			? { status: 'not-applicable', message: 'Unsigned JWT (alg=none) has no signature to verify.' }
			: { status: 'invalid', message: 'alg=none tokens must not include a signature.' };
	}

	if (!params.key.trim()) {
		return { status: 'missing-key', message: 'Provide a secret or public key to verify the signature.' };
	}

	const data = textEncoder.encode(parsed.signingInput);
	const signature = toArrayBuffer(parsed.signature);
	const cryptoKey = await importVerificationKey(algorithm, params.key, params.secretEncoding ?? 'utf-8');
	const verificationParams = getVerificationParams(algorithm);
	const isValid = await crypto.subtle.verify(verificationParams, cryptoKey, signature, data);

	return isValid
		? { status: 'valid', message: 'Signature is valid for the supplied key.' }
		: { status: 'invalid', message: 'Signature does not match the supplied key.' };
}

export async function generateJwt(params: {
	header: JwtValue;
	payload: JwtValue;
	key?: string;
	secretEncoding?: JwtSecretEncoding;
}): Promise<JwtGenerationResult> {
	const header = { ...params.header };
	const payload = { ...params.payload };
	const algorithm = typeof header.alg === 'string' ? header.alg : '';

	if (!algorithm) {
		throw new Error('JWT header must include an alg value.');
	}

	const headerSegment = encodeBase64UrlJson(header);
	const payloadSegment = encodeBase64UrlJson(payload);
	const signingInput = `${headerSegment}.${payloadSegment}`;

	if (algorithm === 'none') {
		return {
			token: `${signingInput}.`,
			header,
			payload
		};
	}

	if (!params.key?.trim()) {
		throw new Error('Provide a secret or private key to generate a signed JWT.');
	}

	const cryptoKey = await importSigningKey(algorithm, params.key, params.secretEncoding ?? 'utf-8');
	const signature = await crypto.subtle.sign(
		getSigningParams(algorithm),
		cryptoKey,
		textEncoder.encode(signingInput)
	);
	const signatureBytes = new Uint8Array(signature);

	return {
		token: `${signingInput}.${encodeBase64Url(signatureBytes)}`,
		header,
		payload
	};
}

export function formatJson(value: JwtValue): string {
	return JSON.stringify(value, null, 2);
}

export function parseJsonObject(value: string, label: string): JwtValue {
	try {
		const parsed = JSON.parse(value);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			throw new Error(`${label} must be a JSON object.`);
		}

		return parsed as JwtValue;
	} catch (error) {
		const detail = error instanceof Error ? error.message : 'Unknown parsing error';
		throw new Error(`Failed to parse ${label}: ${detail}`);
	}
}

export function decodeBase64Url(value: string): Uint8Array {
	if (!value) {
		return new Uint8Array();
	}

	const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
	const paddingLength = (4 - (normalized.length % 4)) % 4;
	const padded = normalized.padEnd(normalized.length + paddingLength, '=');

	return Uint8Array.from(Buffer.from(padded, 'base64'));
}

export function encodeBase64Url(value: Uint8Array): string {
	return Buffer.from(value)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/g, '');
}

function parseJwtSegment(segment: string, label: 'header' | 'payload'): JwtValue {
	try {
		const decoded = textDecoder.decode(decodeBase64Url(segment));
		const value = JSON.parse(decoded);

		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			throw new Error(`JWT ${label} must decode to a JSON object.`);
		}

		return value as JwtValue;
	} catch (error) {
		const detail = error instanceof Error ? error.message : 'Unknown parsing error';
		throw new Error(`Failed to parse JWT ${label}: ${detail}`);
	}
}

async function importVerificationKey(
	algorithm: string,
	key: string,
	secretEncoding: JwtSecretEncoding
): Promise<CryptoKey> {
	if (algorithm.startsWith('HS')) {
		return crypto.subtle.importKey(
			'raw',
			toArrayBuffer(decodeSecret(key, secretEncoding)),
			{ name: 'HMAC', hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG] },
			false,
			['verify']
		);
	}

	if (algorithm.startsWith('RS')) {
		return crypto.subtle.importKey(
			'spki',
			toArrayBuffer(decodePemPublicKey(key)),
			{
				name: 'RSASSA-PKCS1-v1_5',
				hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG]
			},
			false,
			['verify']
		);
	}

	if (algorithm.startsWith('PS')) {
		return crypto.subtle.importKey(
			'spki',
			toArrayBuffer(decodePemPublicKey(key)),
			{ name: 'RSA-PSS', hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG] },
			false,
			['verify']
		);
	}

	if (algorithm.startsWith('ES')) {
		return crypto.subtle.importKey(
			'spki',
			toArrayBuffer(decodePemPublicKey(key)),
			{
				name: 'ECDSA',
				namedCurve: ECDSA_CURVE_BY_ALG[algorithm as keyof typeof ECDSA_CURVE_BY_ALG]
			},
			false,
			['verify']
		);
	}

	throw new Error(`Unsupported JWT algorithm: ${algorithm}`);
}

async function importSigningKey(
	algorithm: string,
	key: string,
	secretEncoding: JwtSecretEncoding
): Promise<CryptoKey> {
	if (algorithm.startsWith('HS')) {
		return crypto.subtle.importKey(
			'raw',
			toArrayBuffer(decodeSecret(key, secretEncoding)),
			{ name: 'HMAC', hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG] },
			false,
			['sign']
		);
	}

	if (algorithm.startsWith('RS')) {
		return crypto.subtle.importKey(
			'pkcs8',
			toArrayBuffer(decodePemPrivateKey(key)),
			{
				name: 'RSASSA-PKCS1-v1_5',
				hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG]
			},
			false,
			['sign']
		);
	}

	if (algorithm.startsWith('PS')) {
		return crypto.subtle.importKey(
			'pkcs8',
			toArrayBuffer(decodePemPrivateKey(key)),
			{ name: 'RSA-PSS', hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG] },
			false,
			['sign']
		);
	}

	if (algorithm.startsWith('ES')) {
		return crypto.subtle.importKey(
			'pkcs8',
			toArrayBuffer(decodePemPrivateKey(key)),
			{
				name: 'ECDSA',
				namedCurve: ECDSA_CURVE_BY_ALG[algorithm as keyof typeof ECDSA_CURVE_BY_ALG]
			},
			false,
			['sign']
		);
	}

	throw new Error(`Unsupported JWT algorithm: ${algorithm}`);
}

function getVerificationParams(algorithm: string): AlgorithmIdentifier | RsaPssParams | EcdsaParams {
	if (algorithm.startsWith('HS')) {
		return { name: 'HMAC' };
	}

	if (algorithm.startsWith('RS')) {
		return { name: 'RSASSA-PKCS1-v1_5' };
	}

	if (algorithm.startsWith('PS')) {
		return {
			name: 'RSA-PSS',
			saltLength: RSA_PSS_SALT_LENGTH[algorithm as keyof typeof RSA_PSS_SALT_LENGTH]
		};
	}

	if (algorithm.startsWith('ES')) {
		return {
			name: 'ECDSA',
			hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG]
		};
	}

	throw new Error(`Unsupported JWT algorithm: ${algorithm}`);
}

function getSigningParams(algorithm: string): AlgorithmIdentifier | RsaPssParams | EcdsaParams {
	if (algorithm.startsWith('HS')) {
		return { name: 'HMAC' };
	}

	if (algorithm.startsWith('RS')) {
		return { name: 'RSASSA-PKCS1-v1_5' };
	}

	if (algorithm.startsWith('PS')) {
		return {
			name: 'RSA-PSS',
			saltLength: RSA_PSS_SALT_LENGTH[algorithm as keyof typeof RSA_PSS_SALT_LENGTH]
		};
	}

	if (algorithm.startsWith('ES')) {
		return {
			name: 'ECDSA',
			hash: HASH_BY_JWT_ALG[algorithm as keyof typeof HASH_BY_JWT_ALG]
		};
	}

	throw new Error(`Unsupported JWT algorithm: ${algorithm}`);
}

function decodeSecret(secret: string, encoding: JwtSecretEncoding): Uint8Array {
	if (encoding === 'utf-8') {
		return textEncoder.encode(secret);
	}

	return Uint8Array.from(Buffer.from(secret, encoding));
}

function decodePemPublicKey(pem: string): Uint8Array {
	const body = pem
		.replace(/-----BEGIN PUBLIC KEY-----/g, '')
		.replace(/-----END PUBLIC KEY-----/g, '')
		.replace(/\s+/g, '');

	if (!body) {
		throw new Error('PEM public key is empty or invalid.');
	}

	return Uint8Array.from(Buffer.from(body, 'base64'));
}

function decodePemPrivateKey(pem: string): Uint8Array {
	const body = pem
		.replace(/-----BEGIN PRIVATE KEY-----/g, '')
		.replace(/-----END PRIVATE KEY-----/g, '')
		.replace(/\s+/g, '');

	if (!body) {
		throw new Error('PEM private key is empty or invalid.');
	}

	return Uint8Array.from(Buffer.from(body, 'base64'));
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
	return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

function encodeBase64UrlJson(value: JwtValue): string {
	return encodeBase64Url(textEncoder.encode(JSON.stringify(value)));
}
