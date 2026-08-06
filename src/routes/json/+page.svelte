<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import RelatedTools from '$lib/components/RelatedTools.svelte';
	import { t } from 'svelte-i18n';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import {
		escapeJsonString,
		formatJson,
		sortJsonKeys,
		unescapeJsonString,
		type JsonIndent
	} from '$lib/utils/json-tools';

	type Mode = 'format' | 'sort' | 'escape' | 'unescape';

	let inputText = '';
	let outputText = '';
	let errorMessage = '';
	let errorLocation = '';
	let indent: JsonIndent = '2';
	let mode: Mode = 'format';

	function run() {
		errorMessage = '';
		errorLocation = '';

		if (mode === 'format') {
			const result = formatJson(inputText, indent);
			if (result.ok) {
				outputText = result.output;
			} else {
				outputText = '';
				errorMessage = result.error;
				if (result.line != null && result.column != null) {
					errorLocation = `Line ${result.line}, column ${result.column}`;
				}
			}
		} else if (mode === 'sort') {
			const result = sortJsonKeys(inputText, indent);
			if (result.ok) {
				outputText = result.output;
			} else {
				outputText = '';
				errorMessage = result.error;
				if (result.line != null && result.column != null) {
					errorLocation = `Line ${result.line}, column ${result.column}`;
				}
			}
		} else if (mode === 'escape') {
			outputText = escapeJsonString(inputText);
		} else {
			const result = unescapeJsonString(inputText);
			if (result.ok) {
				outputText = result.output;
			} else {
				outputText = '';
				errorMessage = result.error;
				if (result.line != null && result.column != null) {
					errorLocation = `Line ${result.line}, column ${result.column}`;
				}
			}
		}

		trackToolsUsageEvent('json', mode, { input_length: inputText.length });
	}

	function copyToClipboard(text: string) {
		if (!text) return;
		navigator.clipboard.writeText(text).catch(() => {});
		trackToolsUsageEvent('json', 'copy', { output_length: text.length });
	}

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		inputText = await file.text();
	}

	const pageTitle = 'TxtWizard | JSON Formatter, Validator and Minifier';
	const pageDescription =
		'Format, validate, minify, and sort JSON in your browser. Escape and unescape JSON string literals offline with TxtWizard.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/json" />

<header>
	<h1>{$t('json-tool')} {$t('tool')}</h1>
	<p>{$t('json-intro')}</p>
</header>

<main>
	<section class="container" aria-label="JSON Tools">
		<div class="tabs">
			<button class:active={mode === 'format'} on:click={() => (mode = 'format')}
				>{$t('json-format')}</button
			>
			<button class:active={mode === 'sort'} on:click={() => (mode = 'sort')}
				>{$t('json-sort-keys')}</button
			>
			<button class:active={mode === 'escape'} on:click={() => (mode = 'escape')}
				>{$t('json-escape')}</button
			>
			<button class:active={mode === 'unescape'} on:click={() => (mode = 'unescape')}
				>{$t('json-unescape')}</button
			>
		</div>

		{#if mode === 'format' || mode === 'sort'}
			<div class="form-group inline">
				<label for="indent">{$t('json-indent')}</label>
				<select id="indent" bind:value={indent}>
					<option value="2">2 spaces</option>
					<option value="4">4 spaces</option>
					<option value="tab">Tab</option>
					<option value="minify">{$t('json-minify')}</option>
				</select>
			</div>
		{/if}

		<div class="form-group">
			<label for="inputJson">{$t('input-text')}</label>
			<textarea
				id="inputJson"
				bind:value={inputText}
				rows="12"
				placeholder={mode === 'unescape' ? '"hello\\nworld"' : '{ "hello": "world" }'}
			></textarea>
			<div class="file-and-size">
				<input type="file" accept=".json,.txt" on:change={handleFileUpload} />
				<small>{inputText.length} chars</small>
			</div>
		</div>

		<div class="form-group">
			<button class="primary" on:click={run}>
				{#if mode === 'format'}{$t('json-format')}{/if}
				{#if mode === 'sort'}{$t('json-sort-keys')}{/if}
				{#if mode === 'escape'}{$t('json-escape')}{/if}
				{#if mode === 'unescape'}{$t('json-unescape')}{/if}
			</button>
		</div>

		{#if errorMessage}
			<div class="error" role="alert">
				<strong>{$t('json-invalid')}:</strong>
				{errorMessage}
				{#if errorLocation}<br /><small>{errorLocation}</small>{/if}
			</div>
		{/if}

		<div class="form-group">
			<label for="outputJson">{$t('json-output')}</label>
			<div class="output-container">
				<textarea id="outputJson" bind:value={outputText} rows="12" readonly></textarea>
				<button class="copy-btn" on:click={() => copyToClipboard(outputText)}
					>{$t('copy-to-clipboard')}</button
				>
			</div>
			<small>{outputText.length} chars</small>
		</div>
	</section>

	<section class="description">
		<h2>About the JSON Tool</h2>
		<p>
			TxtWizard's JSON tool runs entirely in your browser. Paste raw JSON to format and validate it
			with a configurable indent, minify it back to a single line, sort object keys alphabetically
			for deterministic diffs, or convert any text to and from an escaped JSON string literal. Your
			input never leaves the page.
		</p>

		<h3>What you can do</h3>
		<ul>
			<li>
				<strong>Format / Validate:</strong> Reports the exact line and column on parse failures.
			</li>
			<li>
				<strong>Sort keys:</strong> Recursively orders object keys to make diffs review-friendly.
			</li>
			<li><strong>Escape:</strong> Wraps any text into a valid JSON string literal.</li>
			<li>
				<strong>Unescape:</strong> Decodes
				<code>\n</code>, <code>\t</code>, <code>\uXXXX</code> and other JSON escapes back into the original
				string.
			</li>
		</ul>
	</section>
	<RelatedTools tool="json" />
</main>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background-color: var(--bg-2);
		color: var(--fg-1);
	}
	.form-group {
		margin-bottom: 20px;
	}
	.form-group.inline {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.form-group.inline label {
		margin-bottom: 0;
	}
	label {
		font-weight: bold;
		display: block;
		margin-bottom: 8px;
	}
	textarea,
	select,
	button {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	textarea {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	textarea[readonly] {
		background-color: #f0f0f0;
	}
	select {
		width: auto;
		margin-top: 0;
	}
	button {
		cursor: pointer;
		background-color: #f0f0f0;
		color: #333;
	}
	button.primary {
		background-color: #4caf50;
		color: white;
		border-color: #4caf50;
	}
	button.primary:hover {
		background-color: #3e8e41;
	}
	.tabs {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	.tabs button {
		flex: 1;
		padding: 10px;
		border: 1px solid #ccc;
		background-color: #f0f0f0;
		cursor: pointer;
		border-radius: 0;
		margin-top: 0;
		min-width: 120px;
	}
	.tabs button.active {
		background-color: #e0e0e0;
		font-weight: bold;
		color: #000;
	}
	.output-container {
		position: relative;
	}
	.copy-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		width: auto;
		margin-top: 0;
	}
	.error {
		padding: 10px;
		border: 1px solid #d99;
		background-color: #fdecea;
		color: #a33;
		border-radius: 4px;
		margin-bottom: 20px;
	}
	.file-and-size {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 5px;
	}
	input[type='file'] {
		border: none;
		padding: 0;
	}
	small {
		display: block;
		color: #666;
		margin-top: 5px;
	}
	h2,
	h3 {
		margin-bottom: 15px;
	}
	p,
	ul {
		margin-bottom: 10px;
	}
	ul {
		padding-left: 20px;
	}
</style>
