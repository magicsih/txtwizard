<script lang="ts">
	import { t } from 'svelte-i18n';

	let inputText = '';
	let charCountWithSpace = 0;
	let charCountWithoutSpace = 0;
	let lineCount = 0;
	let wordCount = 0;
	let sentenceCount = 0;
	let uniqueWordCount = 0;
	let byteSize = 0;

	$: {
		charCountWithSpace = inputText.length;
		charCountWithoutSpace = inputText.replace(/\s/g, '').length;
		lineCount = inputText.split('\n').length;
		wordCount = inputText.split(/\s+/).filter(Boolean).length;
		// Basic sentence detection using punctuation.
		// This regex splits the text by periods, question marks, and exclamation points, 
		// followed by a space or the end of the string.
		// It's a simple approach and might not be accurate for all types of text.
		// consider using more sophisticated NLP techniques for better accuracy.
		// const sentences = inputText.split(/[.?!]\s+|[.?!]$/);
		// sentenceCount = sentences.length - 1;  // Subtract 1 to exclude empty strings
		// Improved sentence detection (still basic, but handles more cases)
		const sentenceEndings = /[.?!](?=\s|$)/g;
		const sentences = inputText.split(sentenceEndings);
		// Filter out any empty strings from the split
		const validSentences = sentences.filter(sentence => sentence.trim() !== '');
		// The number of valid sentences is the length of the array
		sentenceCount = validSentences.length;
		const words = inputText.toLowerCase().split(/\s+/).filter(Boolean);
		const uniqueWords = new Set(words);
		uniqueWordCount = uniqueWords.size;
		byteSize = new TextEncoder().encode(inputText).length;
	}
</script>

<head>
	<title>TxtWizard | Text Analyzer</title>
	<meta name="description" content="Text Analyzer tool" />
</head>

<h2>{$t('analyzer')} {$t('tool')}</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">{$t('input-text')}</label>
		<textarea id="inputText" bind:value={inputText} rows="10" placeholder="{$t('enter-text')}"></textarea>
	</div>

	<div class="results">
		<p>{$t('char-count-with-space')}: {charCountWithSpace}</p>
		<p>{$t('char-count-without-space')}: {charCountWithoutSpace}</p>
		<p>{$t('line-count')}: {lineCount}</p>
		<p>{$t('word-count')}: {wordCount}</p>
		<p>{$t('sentence-count')}: {sentenceCount}</p>
		<p>{$t('unique-word-count')}: {uniqueWordCount}</p>
		<p>{$t('byte-size')}: {byteSize} bytes</p>
	</div>
</div>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 8px;
	}

	textarea {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.results {
		margin-top: 20px;
		border: 1px solid #ccc;
		padding: 10px;
		border-radius: 4px;
		background-color: #fff;
	}

	.results p {
		margin-bottom: 5px;
	}
</style>
