<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import { analyzeText } from '$lib/utils/analyzer';

	let inputText = '';
	let charCountWithSpace = 0;
	let charCountWithoutSpace = 0;
	let lineCount = 0;
	let wordCount = 0;
	let sentenceCount = 0;
	let uniqueWordCount = 0;
	let byteSize = 0;

	$: {
		const result = analyzeText(inputText);
		charCountWithSpace = result.charCountWithSpace;
		charCountWithoutSpace = result.charCountWithoutSpace;
		lineCount = result.lineCount;
		wordCount = result.wordCount;
		sentenceCount = result.sentenceCount;
		uniqueWordCount = result.uniqueWordCount;
		byteSize = result.byteSize;
	}

	const pageTitle = 'TxtWizard | Text Analyzer Tool';
	const pageDescription =
		'Analyze text length, words, sentences, unique words, lines, and byte size in your browser.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/analyzer" />

<h1>{$t('analyzer')} {$t('tool')}</h1>

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
