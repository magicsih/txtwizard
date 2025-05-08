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
	<div class="form-group">
		<label for="text1">{$t('text1')}</label>
		<textarea id="text1" bind:value={text1} rows="4" placeholder="{$t('enter-text')}"></textarea>
	</div>

	<div class="form-group">
		<label for="text2">{$t('text2')}</label>
		<textarea id="text2" bind:value={text2} rows="4" placeholder="{$t('enter-text')}"></textarea>
	</div>

	<div class="form-group">
		<button on:click={mergeTexts}>{$t('merge-button')}</button>
		
	</div>

	<div class="form-group">
		<label for="mergedText">{$t('merged-text')}</label>
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

	textarea, select, button {
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
