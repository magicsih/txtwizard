<script lang="ts">
	import { ref } from 'vue';

	let htmlInput = ref('');
	let cssInput = ref('');
	let jsInput = ref('');

	let htmlOutput = ref('');
	let cssOutput = ref('');
	let jsOutput = ref('');

	let htmlOriginalSize = ref(0);
	let cssOriginalSize = ref(0);
	let jsOriginalSize = ref(0);

	let htmlMinifiedSize = ref(0);
	let cssMinifiedSize = ref(0);
	let jsMinifiedSize = ref(0);

	function minifyHTML() {
		const input = htmlInput.value;
		// Basic HTML minification: remove comments and whitespace between tags
		const minified = input
			.replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
			.replace(/>\s+</g, '><') // Remove whitespace between tags
			.trim();

		htmlOutput.value = minified;
		htmlOriginalSize.value = new Blob([input]).size;
		htmlMinifiedSize.value = new Blob([minified]).size;
	}

	function minifyCSS() {
		const input = cssInput.value;
		// Basic CSS minification: remove comments, whitespace, and optimize some values
		const minified = input
			.replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS comments
			.replace(/\s+/g, ' ') // Remove extra whitespace
			.replace(/\s*{\s*/g, '{') // Remove whitespace after opening curly brace
			.replace(/\s*}\s*/g, '}') // Remove whitespace before closing curly brace
			.replace(/\s*:\s*/g, ':') // Remove whitespace around colon
			.replace(/\s*;\s*/g, ';') // Remove whitespace around semicolon
			.replace(/0px/g, '0') // Optimize 0px to 0
			.replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, '#$1$2$3') // Optimize hex colors
			.trim();

		cssOutput.value = minified;
		cssOriginalSize.value = new Blob([input]).size;
		cssMinifiedSize.value = new Blob([minified]).size;
	}

	function minifyJS() {
		const input = jsInput.value;
		// Basic JavaScript minification: remove comments and whitespace
		const minified = input
			.replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
			.replace(/([\s;])\/\/.*$/gm, '$1') // Remove single-line comments
			.replace(/\s+/g, ' ') // Remove extra whitespace
			.replace(/^\s+/gm, '') // Remove leading whitespace per line
			.replace(/;\s*([};])/g, '$1') // Remove unnecessary semicolon
			.trim();

		jsOutput.value = minified;
		jsOriginalSize.value = new Blob([input]).size;
		jsMinifiedSize.value = new Blob([minified]).size;
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<head>
	<title>TxtWizard | Code Minifier</title>
	<meta name="description" content="Free online code minifier tool for HTML, CSS, and JavaScript." />
</head>

<header>
	<h1>{$t('minifier')} {$t('tool')}</h1>
</header>

<main>
	<section class="container">
		<div class="tab-container">
			<div class="tabs">
				<button class="tab-button active" data-tab="html">HTML</button>
				<button class="tab-button" data-tab="css">CSS</button>
				<button class="tab-button" data-tab="js">JavaScript</button>
			</div>

			<div class="tab-content" id="html">
				<div class="input-output-group">
					<label for="htmlInput">{$t('input')}</label>
					<textarea id="htmlInput" bind:value={$htmlInput} rows="10"></textarea>
					<div class="size-info">
						{$t('original-size')}: {$htmlOriginalSize} bytes
					</div>
				</div>
				<div class="input-output-group">
					<label for="htmlOutput">{$t('minified-output')}</label>
					<textarea id="htmlOutput" bind:value={$htmlOutput} rows="10" readonly></textarea>
					<div class="size-info">
						{$t('minified-size')}: {$htmlMinifiedSize} bytes
					</div>
				</div>
				<button on:click={minifyHTML}>{$t('minify')}</button>
				<button on:click={() => copyToClipboard($htmlOutput)}>{$t('copy')}</button>
			</div>

			<div class="tab-content" id="css" style="display: none;">
				<div class="input-output-group">
					<label for="cssInput">{$t('input')}</label>
					<textarea id="cssInput" bind:value={$cssInput} rows="10"></textarea>
					<div class="size-info">
						{$t('original-size')}: {$cssOriginalSize} bytes
					</div>
				</div>
				<div class="input-output-group">
					<label for="cssOutput">{$t('minified-output')}</label>
					<textarea id="cssOutput" bind:value={$cssOutput} rows="10" readonly></textarea>
					<div class="size-info">
						{$t('minified-size')}: {$cssMinifiedSize} bytes
					</div>
				</div>
				<button on:click={minifyCSS}>{$t('minify')}</button>
				<button on:click={() => copyToClipboard($cssOutput)}>{$t('copy')}</button>
			</div>

			<div class="tab-content" id="js" style="display: none;">
				<div class="input-output-group">
					<label for="jsInput">{$t('input')}</label>
					<textarea id="jsInput" bind:value={$jsInput} rows="10"></textarea>
					<div class="size-info">
						{$t('original-size')}: {$jsOriginalSize} bytes
					</div>
				</div>
				<div class="input-output-group">
					<label for="jsOutput">{$t('minified-output')}</label>
					<textarea id="jsOutput" bind:value={$jsOutput} rows="10" readonly></textarea>
					<div class="size-info">
						{$t('minified-size')}: {$jsMinifiedSize} bytes
					</div>
				</div>
				<button on:click={minifyJS}>{$t('minify')}</button>
				<button on:click={() => copyToClipboard($jsOutput)}>{$t('copy')}</button>
			</div>
		</div>
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

	.tab-container {
		border: 1px solid #ccc;
		border-radius: 5px;
		overflow: hidden;
	}

	.tabs {
		display: flex;
	}

	.tab-button {
		flex: 1;
		padding: 10px 15px;
		border: none;
		background-color: #eee;
		cursor: pointer;
		font-size: 1em;
		transition: background-color 0.3s;
	}

	.tab-button:hover {
		background-color: #ddd;
	}

	.tab-button.active {
		background-color: #bbb;
		color: white;
	}

	.tab-content {
		padding: 20px;
	}

	.input-output-group {
		margin-bottom: 20px;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 5px;
	}

	textarea {
		width: 100%;
		padding: 10px;
		font-size: 0.9em;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}

	button {
		padding: 10px 15px;
		font-size: 1em;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: white;
		cursor: pointer;
		transition: background-color 0.3s;
		margin-right: 10px;
	}

	button:hover {
		background-color: #0056b3;
	}

	.size-info {
		font-size: 0.8em;
		color: #666;
		margin-top: 5px;
	}
</style>

<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const tabs = document.querySelector('.tabs');
		const tabContents = document.querySelectorAll('.tab-content');

		function activateTab(tabId) {
			console.log('Activating tab:', tabId);
			// Hide all tab contents
			tabContents.forEach((tabContent) => {
				console.log('Hiding:', tabContent.id);
				 tabContent.style.display = 'none';
			});

			// Deactivate all tab buttons
			const tabButtons = document.querySelectorAll('.tab-button');
			console.log('Deactivating all buttons');
			// console.log(tabButtons)
			 tabButtons.forEach((button) => {
				button.classList.remove('active');
			});

			// Activate the selected tab content
			const tabContent = document.getElementById(tabId);
			console.log('Showing:', tabContent.id);
			 tabContent.style.display = 'block';

			// Activate the corresponding tab button
			const tabButton = document.querySelector(".tab-button[data-tab='" + tabId + "']");
			console.log('Activating button for:', tabId);
			 tabButton.classList.add('active');
		}

		// Add click event listener to the tabs container
		 tabs.addEventListener('click', function (event) {
			if (event.target.classList.contains('tab-button')) {
				const tabId = event.target.dataset.tab;
				console.log('Tab clicked:', tabId);
				activateTab(tabId);
			}
		});

		// Initially activate the first tab
		activateTab('html');
	});
</script>
