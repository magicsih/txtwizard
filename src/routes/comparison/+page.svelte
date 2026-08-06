<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import RelatedTools from '$lib/components/RelatedTools.svelte';
	import { t } from 'svelte-i18n';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import {
		compareTexts as buildDiff,
		deduplicateText as deduplicateEntries,
		type DeduplicationType
	} from '$lib/utils/comparison';

	let text1 = '';
	let text2 = '';
	let textToDeduplicate = '';
	let diff = '';
	let deduplicatedText = '';
	let deduplicationType: DeduplicationType = 'line';

	function compareTexts() {
		diff = buildDiff(text1, text2);
		trackToolsUsageEvent('comparison', 'compare', {
			text1_length: text1.length,
			text2_length: text2.length,
			non_empty: text1.length > 0 && text2.length > 0 ? 1 : 0
		});
	}

	function deduplicateText() {
		deduplicatedText = deduplicateEntries(textToDeduplicate, deduplicationType);
		trackToolsUsageEvent('comparison', 'deduplicate', {
			deduplication_type: deduplicationType,
			input_text_length: textToDeduplicate.length,
			output_text_length: deduplicatedText.length,
			non_empty: textToDeduplicate.length > 0 ? 1 : 0
		});
	}

	const pageTitle = 'TxtWizard | Text Comparison and Duplicate Removal Tool';
	const pageDescription =
		'Compare two text blocks and remove duplicate lines or sentences directly in your browser.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/comparison" />

<h1>{$t('comparison')} {$t('tool')}</h1>

<div class="container">
	<h3>{$t('text-comparison')}</h3>
	<div class="text-input">
		<label for="text1">{$t('text1')}:</label>
		<textarea id="text1" bind:value={text1} rows="6" placeholder={$t('enter-text1')}></textarea>
	</div>
	<div class="text-input">
		<label for="text2">{$t('text2')}:</label>
		<textarea id="text2" bind:value={text2} rows="6" placeholder={$t('enter-text2')}></textarea>
	</div>
	<button on:click={compareTexts}>{$t('compare')}</button>
	<div class="diff-output">
		<h3>{$t('differences')}</h3>
		{@html diff}
	</div>
</div>

<div class="container">
	<h3>{$t('duplicate-removal')}</h3>
	<div class="text-input">
		<label for="textToDeduplicate">{$t('text-deduplicate')}:</label>
		<textarea
			id="textToDeduplicate"
			bind:value={textToDeduplicate}
			rows="6"
			placeholder={$t('enter-text-deduplicate')}
		></textarea>
	</div>
	<div class="deduplication-options">
		<label for="deduplicationType">{$t('deduplication-type')}:</label>
		<select id="deduplicationType" bind:value={deduplicationType}>
			<option value="line">{$t('line-based')}</option>
			<option value="sentence">{$t('sentence-based')}</option>
		</select>
	</div>
	<button on:click={deduplicateText}>{$t('remove-duplicates')}</button>
	<div class="deduplicated-output">
		<h3>{$t('deduplicated-text')}</h3>
		<textarea readonly rows="6">{deduplicatedText}</textarea>
	</div>
</div>

<RelatedTools tool="comparison" />

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background-color: var(--bg-2);
		color: var(--fg-1);
	}

	.text-input {
		margin-bottom: 15px;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 5px;
	}

	textarea {
		width: 100%;
		padding: 8px;
		border: 1px solid var(--bg-3);
		border-radius: 4px;
		background-color: var(--bg-1);
		color: var(--fg-1);
		resize: vertical;
	}

	button {
		background-color: #2e7d32;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1em;
	}

	button:hover {
		background-color: #1b5e20;
	}

	.diff-output,
	.deduplicated-output {
		margin-top: 20px;
		padding: 10px;
		border: 1px solid var(--bg-3);
		border-radius: 4px;
		background-color: var(--bg-1);
		color: var(--fg-1);
	}

	.deduplication-options {
		margin-bottom: 15px;
	}

	select {
		width: 100%;
		padding: 8px;
		border: 1px solid var(--bg-3);
		border-radius: 4px;
		background-color: var(--bg-1);
		color: var(--fg-1);
		font-size: 1em;
	}
</style>
