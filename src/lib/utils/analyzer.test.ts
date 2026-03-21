import { describe, expect, it } from 'vitest';

import { analyzeText } from './analyzer';

describe('analyzeText', () => {
	it('computes text statistics', () => {
		expect(analyzeText('Hello world.\nHello again!')).toEqual({
			charCountWithSpace: 25,
			charCountWithoutSpace: 22,
			lineCount: 2,
			wordCount: 4,
			sentenceCount: 2,
			uniqueWordCount: 3,
			byteSize: 25
		});
	});
});
