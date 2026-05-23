import { describe, expect, it } from 'vitest';

import { highlightMatches, replaceRegex, testRegex } from './regex-tester';

describe('testRegex', () => {
	it('returns all matches with their groups', () => {
		const result = testRegex('(\\w+)@(\\w+)', '', 'a@b and c@d');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.matches).toHaveLength(2);
			expect(result.matches[0]).toMatchObject({ match: 'a@b', index: 0, groups: ['a', 'b'] });
			expect(result.matches[1]).toMatchObject({ match: 'c@d', index: 8, groups: ['c', 'd'] });
		}
	});

	it('captures named groups', () => {
		const result = testRegex('(?<user>\\w+)@(?<domain>\\w+)', '', 'foo@bar');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.matches[0].namedGroups).toEqual({ user: 'foo', domain: 'bar' });
		}
	});

	it('returns an error for invalid pattern', () => {
		const result = testRegex('(', '', 'abc');
		expect(result.ok).toBe(false);
	});

	it('treats case-insensitive flag correctly', () => {
		const result = testRegex('abc', 'i', 'AbC def ABC');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.matches).toHaveLength(2);
		}
	});

	it('returns empty matches for empty pattern', () => {
		const result = testRegex('', '', 'anything');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.matches).toEqual([]);
		}
	});
});

describe('replaceRegex', () => {
	it('replaces matches and counts replacements with g flag', () => {
		const result = replaceRegex('a', 'g', 'banana', 'X');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('bXnXnX');
			expect(result.replacementCount).toBe(3);
		}
	});

	it('replaces only first match without g flag', () => {
		const result = replaceRegex('a', '', 'banana', 'X');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('bXnana');
		}
	});

	it('reports a single replacement count when g flag is not set (regression)', () => {
		const result = replaceRegex('a', '', 'banana', 'X');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.replacementCount).toBe(1);
		}
	});

	it('reports zero replacements when pattern does not match', () => {
		const result = replaceRegex('z', '', 'banana', 'X');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.replacementCount).toBe(0);
			expect(result.output).toBe('banana');
		}
	});
});

describe('highlightMatches', () => {
	it('splits input into matched and unmatched segments', () => {
		const matches = [
			{ match: 'ab', index: 0, groups: [], namedGroups: {} },
			{ match: 'ab', index: 4, groups: [], namedGroups: {} }
		];
		expect(highlightMatches('abxxab', matches)).toEqual([
			{ text: 'ab', matched: true },
			{ text: 'xx', matched: false },
			{ text: 'ab', matched: true }
		]);
	});

	it('returns a single unmatched segment when there are no matches', () => {
		expect(highlightMatches('hello', [])).toEqual([{ text: 'hello', matched: false }]);
	});

	it('ignores zero-length matches without duplicating segments (regression)', () => {
		const matches = [
			{ match: '', index: 0, groups: [], namedGroups: {} },
			{ match: '', index: 3, groups: [], namedGroups: {} }
		];
		expect(highlightMatches('abc', matches)).toEqual([{ text: 'abc', matched: false }]);
	});
});
