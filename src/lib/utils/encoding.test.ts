import { describe, expect, it } from 'vitest';

import { detectAndConvertInput, encodeHtmlEntities } from './encoding';

describe('encodeHtmlEntities', () => {
	it.each([
		['&', '&#38;'],
		['<', '&#60;'],
		['>', '&#62;'],
		['"', '&#34;'],
		["'", '&#39;']
	])('encodes the HTML delimiter %s', (input, expected) => {
		expect(encodeHtmlEntities(input)).toBe(expected);
	});

	it.each([
		['&#65;', '&#38;#65;'],
		['&#x41;', '&#38;#x41;'],
		['&lt;', '&#38;lt;'],
		['&amp;lt;', '&#38;amp;lt;']
	])('preserves literal character-reference text %s', (input, expected) => {
		expect(encodeHtmlEntities(input)).toBe(expected);
	});

	it('encodes repeated delimiters without re-encoding generated references', () => {
		expect(encodeHtmlEntities('<a title="Tom & Jerry\'s">&</a>')).toBe(
			'&#60;a title=&#34;Tom &#38; Jerry&#39;s&#34;&#62;&#38;&#60;/a&#62;'
		);
	});

	it('preserves the existing Unicode encoding range and plain text', () => {
		expect(encodeHtmlEntities('hello\n\u00a0é香한글😀')).toBe('hello\n&#160;&#233;&#39321;한글😀');
		expect(encodeHtmlEntities('')).toBe('');
	});
});

describe('detectAndConvertInput HTML output', () => {
	it.each([
		['%26%2365%3B', 'URL-Encoded'],
		['JiM2NTs=', 'Base64'],
		['262336353b', 'Hex']
	])('preserves a literal entity decoded from %s', (input, detectedEncoding) => {
		expect(detectAndConvertInput(input)).toEqual({
			plainText: '&#65;',
			base64: 'JiM2NTs=',
			hex: '262336353b',
			urlEncode: '%26%2365%3B',
			htmlEncode: '&#38;#65;',
			detectedEncoding
		});
	});
});
