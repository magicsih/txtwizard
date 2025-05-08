<script lang="ts">
	import { t } from 'svelte-i18n';

	let text1: string = '';
	let text2: string = '';
	let mergedText: string = '';

	function mergeTexts() {
		mergedText = text1 + text2;
	}
</script>

<head>
	<title>TxtWizard | {$t('merge-text')}</title>
	<meta name="description" content="{$t('merge-text-description')}" />
</head>

<h2>{$t('merge-text')} {$t('tool')}</h2>

<div class="container">
	<label for="text1">{$t('text1')}</label>
	<textarea id="text1" bind:value={text1} rows="4" placeholder="{$t('enter-text')}"></textarea>

	<label for="text2">{$t('text2')}</label>
	<textarea id="text2" bind:value={text2} rows="4" placeholder="{$t('enter-text')}"></textarea>

	<button on:click={mergeTexts}>{$t('merge-button')}</button>

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
		margin-bottom: 5px;
		font-weight: bold;
	}

	textarea {
		width: 100%;
		margin-bottom: 10px;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: monospace;
	}

	button {
		background-color: #4CAF50;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-bottom: 10px;
	}

	button:hover {
		background-color: #3e8e41;
	}

	textarea[readonly] {
		background-color: #f0f0f0;
	}
</style>

