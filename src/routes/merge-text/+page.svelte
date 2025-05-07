<script>
	import { t } from 'svelte-i18n';

	let text1 = '';
	let text2 = '';
	let separator = '\n';
	let result = '';

	function mergeTexts() {
		result = [text1, text2].filter(Boolean).join(separator);
	}
</script>

<head>
	<title>TxtWizard | {$t('merge-text')}</title>
	<meta name="description" content={$t('merge-text')} />
</head>

<h2>{$t('merge-text')}</h2>

<div class="container">
	<label for="text1">{$t('text1')}</label>
	<textarea id="text1" bind:value={text1} rows="4" placeholder={$t('enter-text')}></textarea>

	<label for="text2">{$t('text2')}</label>
	<textarea id="text2" bind:value={text2} rows="4" placeholder={$t('enter-text')}></textarea>

	<label for="separator">{$t('separator')}</label>
	<input type="text" id="separator" bind:value={separator} placeholder="\n" />

	<button on:click={mergeTexts}>{$t('merge')}</button>

	<label for="result">{$t('result')}</label>
	<textarea id="result" bind:value={result} rows="4" readonly></textarea>
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

	textarea,
	input {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1em;
		font-family: inherit;
	}

	button {
		background-color: #4caf50;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1em;
	}

	button:hover {
		background-color: #3e8e41;
	}

	textarea[readonly] {
		background-color: #f0f0f0;
	}
</style>
