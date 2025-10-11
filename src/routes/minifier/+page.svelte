<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Buffer } from 'buffer';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';

	type Language = 'HTML' | 'CSS' | 'JavaScript';
	let selectedLanguage: Language = 'HTML';

	let inputCode = '';
	let outputCode = '';

	let inputSize = 0;
	let outputSize = 0;
	let savedBytes = 0;

	function minifyHTML(html: string): string {
		return html
			.replace(/<!--[\s\S]*?-->/g, '') // remove comments
			.replace(/>\s+</g, '><') // remove whitespace between tags
			.replace(/\s+/g, ' ') // collapse whitespace
			.trim();
	}

	function minifyCSS(css: string): string {
		let minified = css
			.replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
			.replace(/\s+/g, ' ') // collapse whitespace
			.replace(/\s*([;:{},])\s*/g, '$1') // remove whitespace around delimiters
			.replace(/;}/g, '}'); // remove trailing semicolons in blocks

		// Optimize color values
		minified = minified.replace(
			/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/gi,
			'#$1$2$3'
		);

		// Optimize zero values
		minified = minified.replace(/:\s*0(px|em|%|pt|pc|in|cm|mm|ex|rem)/g, ':0');
		minified = minified.replace(/\s0(px|em|%|pt|pc|in|cm|mm|ex|rem)/g, ' 0');

		return minified.trim();
	}

	function minifyJS(js: string): string {
		// Improved, conservative inline JS minifier:
		// - remove block comments
		// - remove line comments (avoiding http://)
		// - trim lines, join into one line, collapse spaces
		// - tighten spaces around safe punctuation

		let noComments = js.replace(/\/\*[\s\S]*?\*\//g, '');
		// remove // comments but avoid URLs or protocol-like sequences
		noComments = noComments.replace(/(^|[^:])\/\/.*$/gm, '$1');

		const lines = noComments
			.split(/\r?\n/)
			.map((l: string) => l.trim())
			.filter((l: string) => l.length > 0);

		let joined = lines.join(' ');

		// collapse whitespace
		joined = joined.replace(/\s+/g, ' ');

		// tighten spaces around punctuation, but preserve spaces around keywords/identifiers
		// Only remove spaces around punctuation when not between word characters
		joined = joined.replace(/(\W)\s*([;,:{}()\[\]=+\-*/%<>?&|^~!])\s*/g, '$1$2');
		joined = joined.replace(/\s*([;,:{}()\[\]=+\-*/%<>?&|^~!])(\W)/g, '$1$2');

		return joined.trim();
	}

	function minify() {
		if (!inputCode) {
			outputCode = '';
			return;
		}

		switch (selectedLanguage) {
			case 'HTML':
				outputCode = minifyHTML(inputCode);
				break;
			case 'CSS':
				outputCode = minifyCSS(inputCode);
				break;
			case 'JavaScript':
				outputCode = minifyJS(inputCode);
				break;
		}
		trackToolsUsageEvent('minifier', 'minify', {
			language: selectedLanguage,
			input_length: inputCode.length
		});
	}

	function copyToClipboard(text: string) {
		if (!text) return;
		navigator.clipboard.writeText(text);
		trackToolsUsageEvent('minifier', 'copy', {
			language: selectedLanguage,
			output_length: text.length
		});
	}

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			inputCode = await file.text();
			const extension = file.name.split('.').pop()?.toLowerCase();
			if (extension === 'html' || extension === 'htm') {
				selectedLanguage = 'HTML';
			} else if (extension === 'css') {
				selectedLanguage = 'CSS';
			} else if (extension === 'js') {
				selectedLanguage = 'JavaScript';
			}
		}
	}

	$: {
		inputSize = Buffer.byteLength(inputCode, 'utf-8');
		if (outputCode) {
			outputSize = Buffer.byteLength(outputCode, 'utf-8');
			savedBytes = inputSize - outputSize;
		} else {
			outputSize = 0;
			savedBytes = 0;
		}
	}
</script>

<head>
	<title>Code Minifier - HTML, CSS, JS | TxtWizard</title>
	<meta
		name="description"
		content="Free online code minifier for HTML, CSS, and JavaScript. Reduce file size and improve website performance by removing unnecessary characters from your code."
	/>
	<meta
		name="keywords"
		content="minify, minifier, html, css, javascript, code, compress, optimizer, online tool"
	/>
</head>

<header>
	<h1>{$t('code-minifier')} {$t('tool')}</h1>
</header>

<main>
	<section class="container" aria-label="Code Minifier Tool">
		<div class="tabs">
			<button class:active={selectedLanguage === 'HTML'} on:click={() => (selectedLanguage = 'HTML')}
				>HTML</button
			>
			<button class:active={selectedLanguage === 'CSS'} on:click={() => (selectedLanguage = 'CSS')}
				>CSS</button
			>
			<button
				class:active={selectedLanguage === 'JavaScript'}
				on:click={() => (selectedLanguage = 'JavaScript')}>JavaScript</button
			>
		</div>

		<div class="form-group">
			<label for="inputCode">Input Code</label>
			<textarea
				id="inputCode"
				bind:value={inputCode}
				rows="10"
				placeholder="Paste your code here..."
			></textarea>
			<div class="file-and-size">
				<input type="file" accept=".html,.htm,.css,.js" on:change={handleFileUpload} />
				<small>{inputSize} bytes</small>
			</div>
		</div>

		<div class="form-group">
			<button on:click={minify}>{$t('minify-button')}</button>
		</div>

		<div class="form-group">
			<label for="outputCode">Minified Output</label>
			<div class="output-container">
				<textarea id="outputCode" bind:value={outputCode} rows="10" readonly></textarea>
				<button class="copy-btn" on:click={() => copyToClipboard(outputCode)}>Copy</button>
			</div>
			<small
				>{outputSize} bytes ({savedBytes > 0 ? `${savedBytes} bytes saved` : 'no change'})</small
			>
		</div>
	</section>

	<section class="description">
		<h2>About the Code Minifier Tool</h2>
		<p>
			This tool helps you reduce the size of your HTML, CSS, and JavaScript files by removing
			unnecessary characters like whitespace, comments, and newlines without affecting the code's
			functionality. Minified code loads faster, improving your website's performance.
		</p>

		<h3>How to Use</h3>
		<ol>
			<li>Select the code language (HTML, CSS, or JavaScript) using the tabs.</li>
			<li>Paste your code into the input box or upload a file.</li>
			<li>Click the "Minify" button.</li>
			<li>The minified code will appear in the output box. You can then copy it to your clipboard.</li>
		</ol>

		<h3>Benefits of Minification</h3>
		<ul>
			<li><strong>Reduced File Size:</strong> Smaller files are transferred faster over the network.</li>
			<li>
				<strong>Improved Load Times:</strong> Faster file downloads lead to quicker page rendering.
			</li>
			<li>
				<strong>Lower Bandwidth Consumption:</strong> Saves bandwidth for both the server and the
				user.
			</li>
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
	textarea,
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
		background-color: #f0f0f0;
		color: #333;
	}
	textarea[readonly] {
		background-color: #f0f0f0;
	}
	small {
		display: block;
		color: #666;
		margin-top: 5px;
	}
	.output-container {
		position: relative;
	}
	.copy-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 5px 10px;
		width: auto;
		margin-top: 0;
	}
	.tabs {
		display: flex;
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
	h2,
	h3 {
		margin-bottom: 15px;
	}
	p,
	ul,
	ol {
		margin-bottom: 10px;
	}
	ul,
	ol {
		padding-left: 20px;
	}
</style>

