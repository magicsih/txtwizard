<script lang="ts">
	import { t } from 'svelte-i18n';

	let text1 = '';
	let text2 = '';
	let delimiter = '\n';
	let mergedText = '';

	function mergeTexts() {
		mergedText = text1 + delimiter + text2;
	}
</script>

<head>
	<title>TxtWizard | Merge Text</title>
	<meta name="keywords" content="merge, text, combine" />
	<meta name="description" content="Merge two texts with a delimiter." />
</head>

<h2>{$t('merge-text')} {$t('tool')}</h2>

<div class="container">
	<div class="form-group">
		<label for="text1">Text 1:</label>
		<textarea id="text1" bind:value={text1} rows="4" placeholder="Enter text 1 here"></textarea>
	</div>

	<div class="form-group">
		<label for="text2">Text 2:</label>
		<textarea id="text2" bind:value={text2} rows="4" placeholder="Enter text 2 here"></textarea>
	</div>

	<div class="form-group">
		<label for="delimiter">Delimiter:</label>
		<input type="text" id="delimiter" bind:value={delimiter} placeholder="Enter delimiter" />
	</div>

	<div class="form-group">
		<button on:click={mergeTexts}>{$t('merge')}</button>
	</div>

	<div class="form-group">
		<label for="mergedText">Merged Text:</label>
		<textarea id="mergedText" bind:value={mergedText} rows="4" readonly></textarea>
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

	textarea,
	input,
	button {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		cursor: pointer;
	}

	textarea[readonly] {
		background-color: #f0f0f0;
	}
</style>
