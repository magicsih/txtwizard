import { describe, expect, it } from 'vitest';

import { compressText, getCompressionLabel } from './compression';

describe('getCompressionLabel', () => {
	it('describes zip-max honestly', () => {
		expect(getCompressionLabel('zip-max')).toBe('ZIP (Max Compression)');
	});
});

describe('compressText', () => {
	it('returns zero ratio for empty input', () => {
		expect(compressText('', 'gzip').metrics.compressionRatio).toBe(0);
	});
});
