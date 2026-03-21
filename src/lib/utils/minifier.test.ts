import { describe, expect, it } from 'vitest';

import {
	detectLanguageFromFilename,
	getCodeSizeMetrics,
	minifyCode,
	minifyCSS,
	minifyHTML,
	minifyJS
} from './minifier';

describe('minifyHTML', () => {
	it('removes comments and collapses whitespace', () => {
		expect(minifyHTML('<!-- x --><div> a </div>')).toBe('<div> a </div>');
	});
});

describe('minifyCSS', () => {
	it('removes comments and extra spaces', () => {
		expect(minifyCSS('/*x*/ body { color: #ffffff; margin: 0px; }')).toBe('body{color:#fff;margin:0}');
	});
});

describe('minifyJS', () => {
	it('removes comments conservatively', () => {
		expect(minifyJS('const a = 1; // comment\nconst b = 2;')).toBe('const a=1;const b=2;');
	});
});

describe('minifyCode', () => {
	it('dispatches to language-specific minifiers', () => {
		expect(minifyCode('<div> x </div>', 'HTML')).toBe('<div> x </div>');
	});
});

describe('detectLanguageFromFilename', () => {
	it('detects file extension', () => {
		expect(detectLanguageFromFilename('test.css')).toBe('CSS');
	});
});

describe('getCodeSizeMetrics', () => {
	it('returns byte metrics', () => {
		expect(getCodeSizeMetrics('abcd', 'ab')).toEqual({
			inputSize: 4,
			outputSize: 2,
			savedBytes: 2
		});
	});
});
