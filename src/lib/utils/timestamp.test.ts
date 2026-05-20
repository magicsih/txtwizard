import { describe, expect, it } from 'vitest';

import { formatRelative, formatTimestamp, parseTimestampInput } from './timestamp';

describe('parseTimestampInput', () => {
	it('parses seconds when value is small', () => {
		const result = parseTimestampInput('1700000000');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.sourceUnit).toBe('seconds');
			expect(result.date.toISOString()).toBe('2023-11-14T22:13:20.000Z');
		}
	});

	it('parses milliseconds when value is large', () => {
		const result = parseTimestampInput('1700000000000');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.sourceUnit).toBe('milliseconds');
			expect(result.date.toISOString()).toBe('2023-11-14T22:13:20.000Z');
		}
	});

	it('parses ISO date strings', () => {
		const result = parseTimestampInput('2023-11-14T22:13:20Z');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.sourceUnit).toBe('iso');
			expect(result.date.toISOString()).toBe('2023-11-14T22:13:20.000Z');
		}
	});

	it('detects 12-digit millisecond epoch before 2001 (regression)', () => {
		// 946684800000 ms == 2000-01-01 UTC. As seconds it would overflow
		// the supported range, so the parser must fall back to milliseconds.
		const result = parseTimestampInput('946684800000');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.sourceUnit).toBe('milliseconds');
			expect(result.date.toISOString()).toBe('2000-01-01T00:00:00.000Z');
		}
	});

	it('accepts a year-1 timestamp (regression for Date.UTC year offset)', () => {
		const yearOneDate = new Date(Date.UTC(2000, 0, 1));
		yearOneDate.setUTCFullYear(1);
		const result = parseTimestampInput(String(yearOneDate.getTime()));
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.date.getUTCFullYear()).toBe(1);
		}
	});

	it('rejects empty input', () => {
		expect(parseTimestampInput('   ').ok).toBe(false);
	});

	it('rejects garbage input', () => {
		expect(parseTimestampInput('not a date').ok).toBe(false);
	});
});

describe('formatTimestamp', () => {
	it('produces the expected unix values', () => {
		const date = new Date('2023-11-14T22:13:20Z');
		const formatted = formatTimestamp(date, date);
		expect(formatted.unixSeconds).toBe(1700000000);
		expect(formatted.unixMilliseconds).toBe(1700000000000);
		expect(formatted.iso).toBe('2023-11-14T22:13:20.000Z');
	});
});

describe('formatRelative', () => {
	it('describes past times', () => {
		const now = new Date('2025-01-01T12:00:00Z');
		const earlier = new Date('2025-01-01T11:00:00Z');
		expect(formatRelative(earlier, now)).toBe('1 hour ago');
	});

	it('describes future times', () => {
		const now = new Date('2025-01-01T12:00:00Z');
		const later = new Date('2025-01-02T12:00:00Z');
		expect(formatRelative(later, now)).toBe('in 1 day');
	});

	it('uses "just now" for tiny deltas in the past', () => {
		const now = new Date('2025-01-01T12:00:00Z');
		const close = new Date('2025-01-01T11:59:59.500Z');
		expect(formatRelative(close, now)).toBe('just now');
	});
});
