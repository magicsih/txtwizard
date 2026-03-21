import { describe, expect, it } from 'vitest';

import { convertEncoding, importAesKey, encryptText, decryptText } from './crypto';

describe('convertEncoding', () => {
	it('converts base64 to hex', () => {
		const base64 = Buffer.from('hello').toString('base64');
		const hex = convertEncoding(base64, 'base64', 'hex');
		expect(hex).toBe(Buffer.from('hello').toString('hex'));
	});

	it('converts hex to base64', () => {
		const hex = Buffer.from('hello').toString('hex');
		const base64 = convertEncoding(hex, 'hex', 'base64');
		expect(base64).toBe(Buffer.from('hello').toString('base64'));
	});

	it('round-trips base64 -> hex -> base64', () => {
		const original = Buffer.from('test data 123').toString('base64');
		const hex = convertEncoding(original, 'base64', 'hex');
		const back = convertEncoding(hex, 'hex', 'base64');
		expect(back).toBe(original);
	});
});

describe('importAesKey', () => {
	it('imports a valid 128-bit AES-GCM key (base64)', async () => {
		const key = Buffer.alloc(16, 0xab).toString('base64');
		const cryptoKey = await importAesKey(key, 'AES-GCM', 'base64');
		expect(cryptoKey).toBeTruthy();
		expect(cryptoKey.algorithm.name).toBe('AES-GCM');
	});

	it('imports a valid 256-bit AES-CBC key (hex)', async () => {
		const key = Buffer.alloc(32, 0xcd).toString('hex');
		const cryptoKey = await importAesKey(key, 'AES-CBC', 'hex');
		expect(cryptoKey).toBeTruthy();
		expect(cryptoKey.algorithm.name).toBe('AES-CBC');
	});

	it('rejects an invalid key size', async () => {
		const key = Buffer.alloc(7, 0x01).toString('base64');
		await expect(importAesKey(key, 'AES-GCM', 'base64')).rejects.toThrow();
	});
});

describe('encryptText + decryptText', () => {
	it('round-trips plaintext via AES-GCM (base64)', async () => {
		const keyBuf = Buffer.alloc(16, 0x11);
		const ivBuf = Buffer.alloc(12, 0x22);
		const key = keyBuf.toString('base64');
		const iv = ivBuf.toString('base64');
		const encoding = 'base64' as const;
		const algorithm = 'AES-GCM' as const;

		const cryptoKey = await importAesKey(key, algorithm, encoding);
		const encrypted = await encryptText({ algorithm, encoding, key: cryptoKey, iv, plainText: 'hello world' });
		const decrypted = await decryptText({ algorithm, encoding, key: cryptoKey, iv, encryptedText: encrypted });

		expect(decrypted).toBe('hello world');
	});

	it('round-trips plaintext via AES-CBC (hex)', async () => {
		const keyBuf = Buffer.alloc(16, 0x33);
		const ivBuf = Buffer.alloc(16, 0x44);
		const key = keyBuf.toString('hex');
		const iv = ivBuf.toString('hex');
		const encoding = 'hex' as const;
		const algorithm = 'AES-CBC' as const;

		const cryptoKey = await importAesKey(key, algorithm, encoding);
		const encrypted = await encryptText({ algorithm, encoding, key: cryptoKey, iv, plainText: 'test message' });
		const decrypted = await decryptText({ algorithm, encoding, key: cryptoKey, iv, encryptedText: encrypted });

		expect(decrypted).toBe('test message');
	});
});
