import { describe, expect, it } from 'vitest';

import { addOrSubtractDays, calculateDateDifference } from './date-calculator';

describe('calculateDateDifference', () => {
	it('calculates day difference between two dates', () => {
		expect(calculateDateDifference('2025-01-01', '2025-01-10')).toBe(9);
	});

	it('returns null for invalid dates', () => {
		expect(calculateDateDifference('bad', '2025-01-10')).toBeNull();
	});
});

describe('addOrSubtractDays', () => {
	it('adds days to a date', () => {
		expect(addOrSubtractDays('2025-01-01', 10)).toBe('2025-01-11');
	});
});
