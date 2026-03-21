import { Buffer } from 'buffer';

export type BinaryEncoding = 'base64' | 'hex';
export type TextEncoding = BinaryEncoding | 'utf-8';
export type AesAlgorithm = 'AES-GCM' | 'AES-CBC';

export const AES_ALGORITHM_CONFIG: Record<AesAlgorithm, { keySizes: number[]; ivSize: number }> = {
	'AES-CBC': { keySizes: [16, 32], ivSize: 16 },
	'AES-GCM': { keySizes: [16, 32], ivSize: 12 }
};

export function convertEncoding(
	value: string,
	from: BinaryEncoding,
	to: BinaryEncoding
): string {
	return Buffer.from(value, from).toString(to);
}

export function getByteLength(value: string, encoding: TextEncoding): number {
	return Buffer.from(value, encoding).length;
}

export function getBitLength(value: string, encoding: BinaryEncoding): number {
	return getByteLength(value, encoding) * 8;
}

export function generateRandomBytes(size: number): Buffer {
	const array = new Uint8Array(size);
	crypto.getRandomValues(array);
	return Buffer.from(array);
}

export async function importAesKey(
	key: string,
	algorithm: AesAlgorithm,
	encoding: BinaryEncoding
): Promise<CryptoKey> {
	const rawKey = Buffer.from(key, encoding);
	return crypto.subtle.importKey('raw', rawKey, { name: algorithm }, false, ['encrypt', 'decrypt']);
}

export async function encryptText(params: {
	algorithm: AesAlgorithm;
	encoding: BinaryEncoding;
	key: CryptoKey;
	iv: string;
	plainText: string;
}): Promise<string> {
	const ivBuffer = Buffer.from(params.iv, params.encoding);
	const plainTextBuffer = Buffer.from(params.plainText, 'utf-8');

	const encrypted = await crypto.subtle.encrypt(
		{ name: params.algorithm, iv: ivBuffer },
		params.key,
		plainTextBuffer
	);

	return Buffer.from(new Uint8Array(encrypted)).toString(params.encoding);
}

export async function decryptText(params: {
	algorithm: AesAlgorithm;
	encoding: BinaryEncoding;
	key: CryptoKey;
	iv: string;
	encryptedText: string;
}): Promise<string> {
	const ivBuffer = Buffer.from(params.iv, params.encoding);
	const encryptedBuffer = Buffer.from(params.encryptedText, params.encoding);

	const decrypted = await crypto.subtle.decrypt(
		{ name: params.algorithm, iv: ivBuffer },
		params.key,
		encryptedBuffer
	);

	return Buffer.from(new Uint8Array(decrypted)).toString('utf-8');
}
