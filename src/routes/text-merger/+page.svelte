<script>
	import { t } from 'svelte-i18n';
	let text1 = '';
	let text2 = '';
	let mergedText = '';

	function mergeTexts() {
		mergedText = text1 + text2;
	}
</script>

<head>
	<title>{$t('text-merger')} | TxtWizard</title>
	<meta name="description" content={$t('text-merger-description')} />
</head>

<h2>{$t('text-merger')}</h2>

<label for="text1">{$t('text1')}</label>
<textarea id="text1" bind:value={text1} rows="4" placeholder={$t('enter-text')} />

<label for="text2">{$t('text2')}</label>
<textarea id="text2" bind:value={text2} rows="4" placeholder={$t('enter-text')} />

<button on:click={mergeTexts}>{$t('merge-button')}</button>

<label for="mergedText">{$t('merged-text')}</label>
<textarea id="mergedText" bind:value={mergedText} rows="4" readonly />

<style>
	textarea {
		width: 100%;
		margin-bottom: 1rem;
	}

	button {
		margin-bottom: 1rem;
	}
</style>
