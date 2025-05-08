<script lang="ts">
	import { t } from 'svelte-i18n';

	let text1 = '';
	let text2 = '';
	let separator = '\n'; // Default to newline
	let mergedText = '';

	function mergeTexts() {
		mergedText = [text1, text2].join(separator);
	}
</script>

<head>
	<title>TxtWizard | {$t('merge-text')}</title>
	<meta name="description" content="{$t('merge-text')}">
	<meta name="keywords" content="merge,text,tool">
</head>

<h2>{$t('merge-text')}</h2>

<div class="container">
	<label for="text1">{$t('text1')}</label>
	<textarea id="text1" bind:value={text1} rows="4" placeholder="{$t('enter-text')}"></textarea>

	<label for="text2">{$t('text2')}</label>
	<textarea id="text2" bind:value={text2} rows="4" placeholder="{$t('enter-text')}"></textarea>

	<label for="separator">{$t('separator')}</label>
	<input type="text" id="separator" bind:value={separator} placeholder="{$t('separator-placeholder')}" />

	<button on:click={mergeTexts}>{$t('merge')}</button>

	<label for="mergedText">{$t('merged-text')}</label>
	<textarea id="mergedText" bind:value={mergedText} rows="4" readonly></textarea>
</div>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 8px;
	}

	textarea, input, button {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1em;
	}

	textarea[readonly] {
		background-color: #f0f0f0;
	}

	button {
		cursor: pointer;
	}
</style>

