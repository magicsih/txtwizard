<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import { onDestroy, onMount } from 'svelte';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import {
		formatTimestamp,
		nowMilliseconds,
		nowSeconds,
		parseTimestampInput
	} from '$lib/utils/timestamp';

	let inputValue = '';
	let liveSeconds = nowSeconds();
	let liveMs = nowMilliseconds();
	let liveIso = new Date().toISOString();

	let timer: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		timer = setInterval(() => {
			liveSeconds = nowSeconds();
			liveMs = nowMilliseconds();
			liveIso = new Date().toISOString();
		}, 1000);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	$: parsed = inputValue.trim() ? parseTimestampInput(inputValue) : null;
	$: formatted = parsed && parsed.ok ? formatTimestamp(parsed.date) : null;

	function useNow(unit: 'seconds' | 'milliseconds' | 'iso') {
		const now = new Date();
		if (unit === 'seconds') inputValue = String(Math.floor(now.getTime() / 1000));
		else if (unit === 'milliseconds') inputValue = String(now.getTime());
		else inputValue = now.toISOString();
		trackToolsUsageEvent('timestamp', 'use-now', { unit });
	}

	function copyToClipboard(text: string) {
		if (!text) return;
		navigator.clipboard.writeText(String(text));
		trackToolsUsageEvent('timestamp', 'copy', {});
	}

	const pageTitle = 'TxtWizard | Unix Timestamp Converter';
	const pageDescription =
		'Convert Unix epoch timestamps (seconds or milliseconds) to ISO 8601, UTC, and local time in your browser. View relative time and the current epoch live.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/timestamp" />

<header>
	<h1>{$t('timestamp-tool')} {$t('tool')}</h1>
	<p>{$t('timestamp-intro')}</p>
</header>

<main>
	<section class="container" aria-label="Timestamp Converter">
		<div class="live">
			<h2>{$t('timestamp-now')}</h2>
			<div class="live-grid">
				<div class="live-cell">
					<span class="label">Unix (s)</span>
					<button class="copy" on:click={() => copyToClipboard(String(liveSeconds))}>
						<code>{liveSeconds}</code>
					</button>
				</div>
				<div class="live-cell">
					<span class="label">Unix (ms)</span>
					<button class="copy" on:click={() => copyToClipboard(String(liveMs))}>
						<code>{liveMs}</code>
					</button>
				</div>
				<div class="live-cell">
					<span class="label">ISO 8601</span>
					<button class="copy" on:click={() => copyToClipboard(liveIso)}>
						<code>{liveIso}</code>
					</button>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label for="tsInput">{$t('timestamp-input')}</label>
			<input
				id="tsInput"
				type="text"
				bind:value={inputValue}
				placeholder="1700000000 or 2023-11-14T22:13:20Z"
				spellcheck="false"
			/>
			<div class="quick-actions">
				<button on:click={() => useNow('seconds')}>{$t('timestamp-use-now-s')}</button>
				<button on:click={() => useNow('milliseconds')}>{$t('timestamp-use-now-ms')}</button>
				<button on:click={() => useNow('iso')}>{$t('timestamp-use-now-iso')}</button>
			</div>
		</div>

		{#if parsed && !parsed.ok}
			<div class="error" role="alert">
				<strong>{$t('timestamp-invalid')}:</strong>
				{parsed.error}
			</div>
		{/if}

		{#if formatted && parsed && parsed.ok}
			<div class="result">
				<div class="result-row">
					<span class="label">{$t('timestamp-detected')}</span>
					<code>{parsed.sourceUnit}</code>
				</div>
				<div class="result-row">
					<span class="label">Unix (s)</span>
					<button class="copy" on:click={() => copyToClipboard(String(formatted.unixSeconds))}>
						<code>{formatted.unixSeconds}</code>
					</button>
				</div>
				<div class="result-row">
					<span class="label">Unix (ms)</span>
					<button class="copy" on:click={() => copyToClipboard(String(formatted.unixMilliseconds))}>
						<code>{formatted.unixMilliseconds}</code>
					</button>
				</div>
				<div class="result-row">
					<span class="label">ISO 8601</span>
					<button class="copy" on:click={() => copyToClipboard(formatted.iso)}>
						<code>{formatted.iso}</code>
					</button>
				</div>
				<div class="result-row">
					<span class="label">UTC</span>
					<button class="copy" on:click={() => copyToClipboard(formatted.utc)}>
						<code>{formatted.utc}</code>
					</button>
				</div>
				<div class="result-row">
					<span class="label">{$t('timestamp-local')}</span>
					<button class="copy" on:click={() => copyToClipboard(formatted.local)}>
						<code>{formatted.local}</code>
					</button>
				</div>
				<div class="result-row">
					<span class="label">{$t('timestamp-relative')}</span>
					<code>{formatted.relative}</code>
				</div>
			</div>
		{/if}
	</section>

	<section class="description">
		<h2>About the Timestamp Converter</h2>
		<p>
			Convert Unix epoch values (seconds or milliseconds) to ISO 8601, UTC, and your browser's local
			time, or paste an ISO date to get its epoch representation. The page detects whether your
			input is in seconds or milliseconds automatically based on its magnitude. Everything happens
			in your browser - no server roundtrip.
		</p>

		<h3>Examples</h3>
		<ul>
			<li><code>1700000000</code> &rarr; 2023-11-14T22:13:20Z (seconds)</li>
			<li><code>1700000000000</code> &rarr; 2023-11-14T22:13:20Z (milliseconds)</li>
			<li><code>2025-01-01T00:00:00Z</code> &rarr; 1735689600 / 1735689600000</li>
		</ul>
	</section>
</main>

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
	input[type='text'] {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.live {
		padding: 15px;
		margin-bottom: 20px;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.live h2 {
		margin: 0 0 10px;
		font-size: 1rem;
	}
	.live-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 8px;
	}
	.live-cell,
	.result-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.result-row {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 6px 0;
		border-bottom: 1px dashed #ddd;
	}
	.result-row:last-child {
		border-bottom: none;
	}
	.label {
		font-size: 0.85rem;
		color: #666;
		font-weight: bold;
	}
	.copy {
		background: transparent;
		border: 1px solid transparent;
		padding: 4px 8px;
		border-radius: 4px;
		cursor: pointer;
		text-align: left;
	}
	.copy:hover {
		background-color: #f0f0f0;
		border-color: #ccc;
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.95em;
	}
	.quick-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 8px;
	}
	.quick-actions button {
		padding: 6px 12px;
		font-size: 0.9em;
		border: 1px solid #ccc;
		background: white;
		border-radius: 4px;
		cursor: pointer;
	}
	.quick-actions button:hover {
		background: #f0f0f0;
	}
	.result {
		padding: 15px;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.error {
		padding: 10px;
		border: 1px solid #d99;
		background-color: #fdecea;
		color: #a33;
		border-radius: 4px;
		margin-bottom: 20px;
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
