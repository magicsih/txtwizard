export type TextAnalysisResult = {
	charCountWithSpace: number;
	charCountWithoutSpace: number;
	lineCount: number;
	wordCount: number;
	sentenceCount: number;
	uniqueWordCount: number;
	byteSize: number;
};

export function analyzeText(inputText: string): TextAnalysisResult {
	const sentenceEndings = /[.?!](?=\s|$)/g;
	const sentences = inputText.split(sentenceEndings);
	const validSentences = sentences.filter((sentence) => sentence.trim() !== '');
	const words = inputText.toLowerCase().split(/\s+/).filter(Boolean);

	return {
		charCountWithSpace: inputText.length,
		charCountWithoutSpace: inputText.replace(/\s/g, '').length,
		lineCount: inputText.length === 0 ? 0 : inputText.split('\n').length,
		wordCount: inputText.split(/\s+/).filter(Boolean).length,
		sentenceCount: validSentences.length,
		uniqueWordCount: new Set(words).size,
		byteSize: new TextEncoder().encode(inputText).length
	};
}
