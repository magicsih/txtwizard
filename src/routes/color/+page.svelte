<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import {
		contrastRatio,
		generatePalette,
		parseColor,
		toHex,
		toHslString,
		toRgbString,
		wcagRating,
		type Rgb
	} from '$lib/utils/color';

	let baseInput = '#0e4d8b';
	let foregroundInput = '#ffffff';
	let backgroundInput = '#0e4d8b';

	$: baseColor = parseColor(baseInput);
	$: foreground = parseColor(foregroundInput);
	$: background = parseColor(backgroundInput);

	$: palette = baseColor ? generatePalette(baseColor) : null;

	$: contrast = foreground && background ? contrastRatio(foreground, background) : null;
	$: rating = contrast !== null ? wcagRating(contrast) : null;

	function copyToClipboard(text: string) {
		if (!text) return;
		navigator.clipboard.writeText(text);
		trackToolsUsageEvent('color', 'copy', { value_length: text.length });
	}

	function applySwatch(rgb: Rgb, target: 'base' | 'foreground' | 'background') {
		const hex = toHex(rgb);
		if (target === 'base') baseInput = hex;
		else if (target === 'foreground') foregroundInput = hex;
		else backgroundInput = hex;
		trackToolsUsageEvent('color', 'apply-swatch', { target });
	}

	function syncFromPicker(event: Event, target: 'base' | 'foreground' | 'background') {
		const value = (event.currentTarget as HTMLInputElement).value;
		if (target === 'base') baseInput = value;
		else if (target === 'foreground') foregroundInput = value;
		else backgroundInput = value;
	}

	const pageTitle = 'TxtWizard | Color Converter and WCAG Contrast Checker';
	const pageDescription =
		'Convert colors between HEX, RGB, and HSL, generate tints / shades / complementary palettes, and check WCAG contrast ratios - all offline.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/color" />

<header>
	<h1>{$t('color-tool')} {$t('tool')}</h1>
	<p>{$t('color-intro')}</p>
</header>

<main>
	<section class="container" aria-label="Color Converter">
		<h2>{$t('color-converter')}</h2>
		<div class="picker-row">
			<input
				type="color"
				value={baseColor ? toHex({ ...baseColor, a: 1 }) : '#000000'}
				on:input={(e) => syncFromPicker(e, 'base')}
				aria-label="Color picker"
			/>
			<input
				type="text"
				bind:value={baseInput}
				placeholder="#ff8800, rgb(255 136 0), hsl(32 100% 50%)"
				spellcheck="false"
			/>
		</div>

		{#if baseColor}
			<div
				class="preview"
				style="background-color: {toHex(baseColor)}; color: {toHex({
					r: 255 - baseColor.r,
					g: 255 - baseColor.g,
					b: 255 - baseColor.b,
					a: 1
				})};"
			>
				<span>{toHex(baseColor)}</span>
			</div>

			<div class="format-grid">
				<div class="format-cell">
					<span class="label">HEX</span>
					<button class="copy" on:click={() => copyToClipboard(toHex(baseColor))}>
						<code>{toHex(baseColor)}</code>
					</button>
				</div>
				<div class="format-cell">
					<span class="label">RGB</span>
					<button class="copy" on:click={() => copyToClipboard(toRgbString(baseColor))}>
						<code>{toRgbString(baseColor)}</code>
					</button>
				</div>
				<div class="format-cell">
					<span class="label">HSL</span>
					<button class="copy" on:click={() => copyToClipboard(toHslString(baseColor))}>
						<code>{toHslString(baseColor)}</code>
					</button>
				</div>
			</div>
		{:else}
			<div class="error" role="alert">{$t('color-invalid')}</div>
		{/if}
	</section>

	{#if palette}
		<section class="container" aria-label="Color Palette">
			<h2>{$t('color-palette')}</h2>

			<div class="swatch-row">
				<span class="swatch-label">{$t('color-tints')}</span>
				{#each palette.tints as tint}
					<button
						class="swatch"
						style="background-color: {toHex(tint)}"
						title={toHex(tint)}
						on:click={() => applySwatch(tint, 'base')}
					></button>
				{/each}
			</div>

			<div class="swatch-row">
				<span class="swatch-label">{$t('color-shades')}</span>
				{#each palette.shades as shade}
					<button
						class="swatch"
						style="background-color: {toHex(shade)}"
						title={toHex(shade)}
						on:click={() => applySwatch(shade, 'base')}
					></button>
				{/each}
			</div>

			<div class="swatch-row">
				<span class="swatch-label">{$t('color-complementary')}</span>
				<button
					class="swatch"
					style="background-color: {toHex(palette.complementary)}"
					title={toHex(palette.complementary)}
					on:click={() => applySwatch(palette.complementary, 'base')}
				></button>
			</div>

			<div class="swatch-row">
				<span class="swatch-label">{$t('color-triadic')}</span>
				{#each palette.triadic as triad}
					<button
						class="swatch"
						style="background-color: {toHex(triad)}"
						title={toHex(triad)}
						on:click={() => applySwatch(triad, 'base')}
					></button>
				{/each}
			</div>

			<div class="swatch-row">
				<span class="swatch-label">{$t('color-analogous')}</span>
				{#each palette.analogous as analog}
					<button
						class="swatch"
						style="background-color: {toHex(analog)}"
						title={toHex(analog)}
						on:click={() => applySwatch(analog, 'base')}
					></button>
				{/each}
			</div>
		</section>
	{/if}

	<section class="container" aria-label="WCAG Contrast Checker">
		<h2>{$t('color-contrast')}</h2>

		<div class="contrast-inputs">
			<div class="contrast-input">
				<label for="fg">{$t('color-foreground')}</label>
				<div class="picker-row">
					<input
						type="color"
						value={foreground ? toHex({ ...foreground, a: 1 }) : '#ffffff'}
						on:input={(e) => syncFromPicker(e, 'foreground')}
						aria-label="Foreground picker"
					/>
					<input id="fg" type="text" bind:value={foregroundInput} spellcheck="false" />
				</div>
			</div>
			<div class="contrast-input">
				<label for="bg">{$t('color-background')}</label>
				<div class="picker-row">
					<input
						type="color"
						value={background ? toHex({ ...background, a: 1 }) : '#000000'}
						on:input={(e) => syncFromPicker(e, 'background')}
						aria-label="Background picker"
					/>
					<input id="bg" type="text" bind:value={backgroundInput} spellcheck="false" />
				</div>
			</div>
		</div>

		{#if foreground && background && contrast !== null && rating}
			<div
				class="contrast-preview"
				style="background-color: {toHex(background)}; color: {toHex(foreground)};"
			>
				<p class="large">Large sample text 24px</p>
				<p class="normal">The quick brown fox jumps over the lazy dog. 16px body text.</p>
			</div>

			<div class="ratio-row">
				<span class="ratio">{contrast.toFixed(2)}:1</span>
				<button class="copy" on:click={() => copyToClipboard(`${contrast.toFixed(2)}:1`)}
					>{$t('copy-to-clipboard')}</button
				>
			</div>

			<div class="rating-grid">
				<div class="rating-cell" class:pass={rating.aaLarge} class:fail={!rating.aaLarge}>
					<strong>AA Large</strong>
					<span>{rating.aaLarge ? $t('color-pass') : $t('color-fail')}</span>
					<small>≥ 3.0</small>
				</div>
				<div class="rating-cell" class:pass={rating.aaNormal} class:fail={!rating.aaNormal}>
					<strong>AA Normal</strong>
					<span>{rating.aaNormal ? $t('color-pass') : $t('color-fail')}</span>
					<small>≥ 4.5</small>
				</div>
				<div class="rating-cell" class:pass={rating.aaaLarge} class:fail={!rating.aaaLarge}>
					<strong>AAA Large</strong>
					<span>{rating.aaaLarge ? $t('color-pass') : $t('color-fail')}</span>
					<small>≥ 4.5</small>
				</div>
				<div class="rating-cell" class:pass={rating.aaaNormal} class:fail={!rating.aaaNormal}>
					<strong>AAA Normal</strong>
					<span>{rating.aaaNormal ? $t('color-pass') : $t('color-fail')}</span>
					<small>≥ 7.0</small>
				</div>
			</div>
		{:else}
			<div class="error" role="alert">{$t('color-invalid')}</div>
		{/if}
	</section>

	<section class="description">
		<h2>About the Color Tool</h2>
		<p>
			TxtWizard's color tool runs entirely in your browser. Paste a color in any common format (<code
				>#hex</code
			>, <code>rgb()</code>, <code>hsl()</code> with optional alpha) to get the others, generate tints,
			shades, complementary, triadic, and analogous harmonies, and check whether two colors clear WCAG
			2.1 AA / AAA contrast thresholds for body or large text.
		</p>

		<h3>Accepted input formats</h3>
		<ul>
			<li><code>#f80</code>, <code>#ff8800</code>, <code>#ff880080</code></li>
			<li><code>rgb(255, 136, 0)</code>, <code>rgba(255 136 0 / 0.4)</code></li>
			<li><code>hsl(32, 100%, 50%)</code>, <code>hsla(120deg 100% 50% / 50%)</code></li>
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
	h2 {
		margin-top: 0;
		margin-bottom: 15px;
	}
	.picker-row {
		display: flex;
		gap: 8px;
		align-items: stretch;
	}
	.picker-row input[type='color'] {
		width: 48px;
		height: 40px;
		padding: 0;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
	}
	.picker-row input[type='text'] {
		flex: 1;
		padding: 10px;
		font-size: 1em;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.preview {
		margin-top: 15px;
		padding: 30px;
		border-radius: 8px;
		text-align: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 1.1em;
		font-weight: bold;
	}
	.format-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 10px;
		margin-top: 15px;
	}
	.format-cell {
		padding: 10px;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.label {
		display: block;
		font-size: 0.85rem;
		color: #666;
		font-weight: bold;
		margin-bottom: 4px;
	}
	.copy {
		background: transparent;
		border: 1px solid transparent;
		padding: 4px 8px;
		border-radius: 4px;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		font-size: 1em;
		width: 100%;
	}
	.copy:hover {
		background-color: #f0f0f0;
		border-color: #ccc;
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.swatch-row {
		display: flex;
		gap: 8px;
		align-items: center;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}
	.swatch-label {
		min-width: 130px;
		font-weight: bold;
		font-size: 0.9rem;
		color: #444;
	}
	.swatch {
		width: 48px;
		height: 48px;
		border: 1px solid #ccc;
		border-radius: 6px;
		cursor: pointer;
		padding: 0;
	}
	.swatch:hover {
		transform: scale(1.05);
		border-color: #333;
	}
	.contrast-inputs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 15px;
	}
	.contrast-input label {
		display: block;
		font-weight: bold;
		margin-bottom: 6px;
	}
	.contrast-preview {
		margin-top: 15px;
		padding: 24px;
		border-radius: 8px;
		border: 1px solid #ddd;
	}
	.contrast-preview .large {
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0 0 10px;
	}
	.contrast-preview .normal {
		margin: 0;
	}
	.ratio-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 15px;
	}
	.ratio {
		font-size: 1.5rem;
		font-weight: bold;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.rating-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 10px;
		margin-top: 15px;
	}
	.rating-cell {
		padding: 12px;
		border-radius: 6px;
		text-align: center;
		border: 2px solid transparent;
	}
	.rating-cell.pass {
		background-color: #e6f6e7;
		border-color: #4caf50;
		color: #1b5e20;
	}
	.rating-cell.fail {
		background-color: #fdecea;
		border-color: #d99;
		color: #a33;
	}
	.rating-cell strong {
		display: block;
		margin-bottom: 4px;
	}
	.rating-cell small {
		display: block;
		color: inherit;
		opacity: 0.75;
		margin-top: 4px;
	}
	.error {
		padding: 10px;
		border: 1px solid #d99;
		background-color: #fdecea;
		color: #a33;
		border-radius: 4px;
		margin-top: 15px;
	}
	.description {
		padding: 0 20px;
	}
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
