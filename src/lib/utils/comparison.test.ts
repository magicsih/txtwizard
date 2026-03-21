import { describe, expect, it } from 'vitest';

import { compareTexts, deduplicateText, escapeHtml } from './comparison';

describe('escapeHtml', () => {
	it('escapes unsafe html characters', () => {
		expect(escapeHtml('<script>"x"</script>')).toBe('&lt;script&gt;&quot;x&quot;&lt;/script&gt;');
	});
});

describe('compareTexts', () => {
	it('marks added lines', () => {
		expect(compareTexts('a', 'a\nb')).toContain("<span class='added'>+ b</span>");
	});
});

describe('deduplicateText', () => {
	it('deduplicates lines while preserving order', () => {
		expect(deduplicateText('a\na\nb', 'line')).toBe('a\nb');
	});
});
