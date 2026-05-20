<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import {
		highlightMatches,
		replaceRegex,
		SUPPORTED_FLAGS,
		testRegex,
		type RegexFlag,
		type RegexMatch
	} from '$lib/utils/regex-tester';

	type Mode = 'match' | 'replace';

	let mode: Mode = 'match';
	let pattern = '';
	let flagsState: Record<RegexFlag, boolean> = {
		g: true,
		i: false,
		m: false,
		s: false,
		u: false,
		y: false
	};
	let testInput = '';
	let replacement = '';

	$: flags = SUPPORTED_FLAGS.filter((f) => flagsState[f]).join('');

	$: matchResult = pattern ? testRegex(pattern, flags, testInput) : null;
	$: replaceResult =
		mode === 'replace' && pattern ? replaceRegex(pattern, flags, testInput, replacement) : null;

	$: highlighted =
		matchResult && matchResult.ok ? highlightMatches(testInput, matchResult.matches) : null;

	$: matches = matchResult && matchResult.ok ? matchResult.matches : ([] as RegexMatch[]);

	function copyToClipboard(text: string) {
		if (!text) return;
		navigator.clipboard.writeText(text);
		trackToolsUsageEvent('regex', 'copy', { output_length: text.length });
	}

	function trackTest() {
		trackToolsUsageEvent('regex', mode, {
			pattern_length: pattern.length,
			input_length: testInput.length,
			flags
		});
	}

	const flagDescriptions: Record<RegexFlag, string> = {
		g: 'global',
		i: 'ignore case',
		m: 'multiline',
		s: 'dotall',
		u: 'unicode',
		y: 'sticky'
	};

	const pageTitle = 'TxtWizard | Regex Tester & Replacer';
	const pageDescription =
		'Test JavaScript regular expressions in your browser. Inspect matches, capture groups, named groups, and run regex replace - all offline.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/regex" />

<header>
	<h1>{$t('regex-tool')} {$t('tool')}</h1>
	<p>{$t('regex-intro')}</p>
</header>

<main>
	<section class="container" aria-label="Regex Tester">
		<div class="tabs">
			<button class:active={mode === 'match'} on:click={() => (mode = 'match')}
				>{$t('regex-match')}</button
			>
			<button class:active={mode === 'replace'} on:click={() => (mode = 'replace')}
				>{$t('regex-replace')}</button
			>
		</div>

		<div class="form-group">
			<label for="pattern">{$t('regex-pattern')}</label>
			<div class="pattern-row">
				<span class="slash">/</span>
				<input
					id="pattern"
					type="text"
					bind:value={pattern}
					placeholder="(\w+)@(\w+\.\w+)"
					spellcheck="false"
					on:blur={trackTest}
				/>
				<span class="slash">/</span>
				<span class="flags-display">{flags}</span>
			</div>
			<div class="flags">
				{#each SUPPORTED_FLAGS as flag}
					<label class="flag">
						<input type="checkbox" bind:checked={flagsState[flag]} />
						<code>{flag}</code>
						<small>{flagDescriptions[flag]}</small>
					</label>
				{/each}
			</div>
		</div>

		{#if mode === 'replace'}
			<div class="form-group">
				<label for="replacement">{$t('regex-replacement')}</label>
				<input
					id="replacement"
					type="text"
					bind:value={replacement}
					placeholder="$1 at $2"
					spellcheck="false"
				/>
				<small>Use $1, $2 ... or $&lt;name&gt; for capture groups.</small>
			</div>
		{/if}

		<div class="form-group">
			<label for="testInput">{$t('regex-test-string')}</label>
			<textarea
				id="testInput"
				bind:value={testInput}
				rows="10"
				placeholder={$t('regex-test-string-placeholder')}
				on:blur={trackTest}
			></textarea>
		</div>

		{#if matchResult && !matchResult.ok}
			<div class="error" role="alert">
				<strong>{$t('regex-invalid')}:</strong>
				{matchResult.error}
			</div>
		{/if}

		{#if highlighted}
			<div class="form-group">
				<div class="section-label">{$t('regex-highlight')}</div>
				<div class="highlight">
					{#each highlighted as segment}
						{#if segment.matched}<mark>{segment.text}</mark>{:else}{segment.text}{/if}
					{/each}
				</div>
				<small>{matches.length} {$t('regex-match-count')}</small>
			</div>
		{/if}

		{#if mode === 'match' && matches.length > 0}
			<div class="form-group">
				<div class="section-label">{$t('regex-matches')}</div>
				<div class="match-list">
					{#each matches as m, i}
						<div class="match-item">
							<div class="match-head">
								<strong>#{i + 1}</strong>
								<span class="muted">@ index {m.index}</span>
								<code>{m.match}</code>
							</div>
							{#if m.groups.length > 0}
								<ul>
									{#each m.groups as g, gi}
										<li><span class="muted">Group {gi + 1}:</span> <code>{g}</code></li>
									{/each}
								</ul>
							{/if}
							{#if Object.keys(m.namedGroups).length > 0}
								<ul>
									{#each Object.entries(m.namedGroups) as [name, value]}
										<li>
											<span class="muted">&lt;{name}&gt;:</span>
											<code>{value}</code>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if mode === 'replace' && replaceResult}
			{#if replaceResult.ok}
				<div class="form-group">
					<label for="replaceOutput">{$t('regex-replace-output')}</label>
					<div class="output-container">
						<textarea id="replaceOutput" rows="8" readonly value={replaceResult.output}></textarea>
						<button class="copy-btn" on:click={() => copyToClipboard(replaceResult.output)}
							>{$t('copy-to-clipboard')}</button
						>
					</div>
					<small>{replaceResult.replacementCount} {$t('regex-replacement-count')}</small>
				</div>
			{:else}
				<div class="error" role="alert">
					<strong>{$t('regex-invalid')}:</strong>
					{replaceResult.error}
				</div>
			{/if}
		{/if}
	</section>

	<section class="description">
		<h2>About the Regex Tool</h2>
		<p>
			Test JavaScript regular expressions on a text sample in real time. Matches are highlighted
			inline and listed with their position, capture groups, and named groups. Switch to Replace
			mode to preview the substituted output without leaving your browser.
		</p>

		<h3>Tips</h3>
		<ul>
			<li>The <code>g</code> flag is added automatically when listing matches.</li>
			<li>
				Use named groups with <code>(?&lt;name&gt;...)</code> and reference them in replacements
				with <code>$&lt;name&gt;</code>.
			</li>
			<li>Patterns are compiled with the JavaScript engine, so syntax follows ECMAScript regex.</li>
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
	label,
	.section-label {
		font-weight: bold;
		display: block;
		margin-bottom: 8px;
	}
	input[type='text'],
	textarea {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	textarea[readonly] {
		background-color: #f0f0f0;
	}
	button {
		padding: 10px;
		border: 1px solid #ccc;
		background-color: #f0f0f0;
		cursor: pointer;
		border-radius: 4px;
	}
	.tabs {
		display: flex;
		margin-bottom: 20px;
	}
	.tabs button {
		flex: 1;
		border-radius: 0;
	}
	.tabs button:first-child {
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
	.tabs button:last-child {
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.tabs button.active {
		background-color: #e0e0e0;
		font-weight: bold;
		color: #000;
	}
	.pattern-row {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0 0.5rem;
	}
	.pattern-row input {
		border: none;
		margin: 0;
		padding: 10px 0;
		flex: 1;
	}
	.slash {
		color: #888;
		font-family: ui-monospace, monospace;
	}
	.flags-display {
		color: #0e4d8b;
		font-family: ui-monospace, monospace;
		min-width: 1.5em;
	}
	.flags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		margin-top: 0.75rem;
	}
	.flag {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: normal;
		margin-bottom: 0;
	}
	.flag small {
		color: #666;
	}
	.highlight {
		padding: 10px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.highlight mark {
		background-color: #ffe066;
		padding: 0 2px;
		border-radius: 2px;
	}
	.match-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.match-item {
		padding: 10px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.match-head {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
		flex-wrap: wrap;
	}
	.match-item code {
		background: #f4f4f4;
		padding: 2px 4px;
		border-radius: 3px;
	}
	.match-item ul {
		margin: 8px 0 0;
		padding-left: 20px;
	}
	.muted {
		color: #666;
	}
	.error {
		padding: 10px;
		border: 1px solid #d99;
		background-color: #fdecea;
		color: #a33;
		border-radius: 4px;
		margin-bottom: 20px;
	}
	.output-container {
		position: relative;
	}
	.copy-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		width: auto;
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
