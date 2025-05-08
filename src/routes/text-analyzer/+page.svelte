<script lang="ts">
	import { t } from 'svelte-i18n';

	let inputText = '';

	let charCountWithSpace = 0;
	let charCountWithoutSpace = 0;
	let lineCount = 0;
	let wordCount = 0;
	let sentenceCount = 0;
	let uniqueStringCount = 0;
	let byteSize = 0;

	$: {
		charCountWithSpace = inputText.length;
		charCountWithoutSpace = inputText.replace(/\s/g, '').length;
		lineCount = inputText.split('\n').length;
		wordCount = inputText.split(/\s+/).filter(Boolean).length;
		// Basic sentence detection (can be improved with more sophisticated NLP techniques)
		const sentences = inputText.split(/[.!?]+/);
		sentenceCount = sentences.length - 1;
		// Case-insensitive unique string count
		const uniqueStrings = new Set(inputText.toLowerCase().split(/\s+/));
		uniqueStringCount = uniqueStrings.size;
		byteSize = new TextEncoder().encode(inputText).length;
	}
</script>

<head>
	<title>TxtWizard | Text Analyzer</title>
	<meta name="description" content="Text Analyzer tool" />
</head>

<h2>{$t('text-analyzer')} {$t('tool')}</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">{$t('input-text')}</label>
		<textarea id="inputText" bind:value={inputText} rows="6" placeholder="{$t('enter-text-here')}"></textarea>
	</div>

	<div class="results">
		<p>{$t('characters-with-spaces')}: {charCountWithSpace}</p>
		<p>{$t('characters-without-spaces')}: {charCountWithoutSpace}</p>
		<p>{$t('lines')}: {lineCount}</p>
		<p>{$t('words')}: {wordCount}</p>
		<p>{$t('sentences')}: {sentenceCount}</p>
		<p>{$t('unique-strings')}: {uniqueStringCount}</p>
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
