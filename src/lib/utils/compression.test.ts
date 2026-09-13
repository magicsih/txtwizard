import { describe, expect, it, beforeAll } from 'vitest';

import { compressText, decompressText, ensureZstdReady, getCompressionLabel } from './compression';

describe('getCompressionLabel', () => {
	it('describes zip-max honestly', () => {
		expect(getCompressionLabel('zip-max')).toBe('ZIP (Max Compression)');
	});

	it('describes zstd', () => {
		expect(getCompressionLabel('zstd')).toBe('Zstandard (zstd)');
	});
});

describe('compressText', () => {
	it('returns zero ratio for empty input', () => {
		expect(compressText('', 'gzip').metrics.compressionRatio).toBe(0);
	});

	it('produces non-empty base64 + hex output for each algorithm', () => {
		const sample = 'Hello compression world. '.repeat(64);
		for (const algorithm of ['gzip', 'deflate', 'zip', 'zip-max'] as const) {
			const out = compressText(sample, algorithm);
			expect(out.base64.length).toBeGreaterThan(0);
			expect(out.hex.length).toBeGreaterThan(0);
			expect(out.metrics.outputSize).toBeGreaterThan(0);
		}
	});
});

describe('zstd round trip', () => {
	beforeAll(async () => {
		await ensureZstdReady();
	});

	it('round-trips UTF-8 text through zstd', () => {
		const sample = 'TxtWizard supports Zstandard compression now.\n'.repeat(32);
		const compressed = compressText(sample, 'zstd');
		expect(compressed.metrics.outputSize).toBeGreaterThan(0);
		const roundTripped = decompressText(
			new Uint8Array(Buffer.from(compressed.base64, 'base64')),
			'zstd'
		);
		expect(Buffer.from(roundTripped).toString('utf-8')).toBe(sample);
	});

	it('matches zstd header magic (0xFD2FB528) on compressed output', () => {
		const out = compressText('header check', 'zstd');
		const bytes = new Uint8Array(Buffer.from(out.base64, 'base64'));
		// Zstandard frame magic number, little-endian: 28 b5 2f fd
		expect(bytes[0]).toBe(0x28);
		expect(bytes[1]).toBe(0xb5);
		expect(bytes[2]).toBe(0x2f);
		expect(bytes[3]).toBe(0xfd);
	});
});
