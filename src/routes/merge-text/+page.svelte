<script lang="ts">
	import { t } from 'svelte-i18n';

	let text1: string = '';
	let text2: string = '';
	let separator: string = '\n';
	let mergedText: string = '';

	function mergeTexts() {
		mergedText = [text1, text2].join(separator);
	}
</script>

<head>
	<title>TxtWizard | Merge Text</title>
	<meta name="description" content="Merge two texts with a custom separator" />
</head>

<h2>{$t('merge-text')}</h2>

<div class="container">
	<label for="text1">{$t('text1')}</label>
	<textarea id="text1" bind:value={text1} rows="4" placeholder="Enter first text"></textarea>

	<label for="text2">{$t('text2')}</label>
	<textarea id="text2" bind:value={text2} rows="4" placeholder="Enter second text"></textarea>

	<label for="separator">{$t('separator')}</label>
	<input type="text" id="separator" bind:value={separator} placeholder="Enter separator" />

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
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 5px;
	}

	input[type='text'],
	textarea {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	textarea[readonly] {
		background-color: #f0f0f0;
	}

	button {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 10px;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #3e8e41;
	}
</style>
