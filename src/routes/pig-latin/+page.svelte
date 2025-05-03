<script lang="ts">
	import { t } from 'svelte-i18n';

	let inputText = '';
	let outputText = '';

	function translateToPigLatin() {
		const words = inputText.toLowerCase().split(/\s+/); // Split by spaces
		const pigLatinWords = words.map((word) => {
			if (!word) return ''; // Skip empty strings

			const vowels = 'aeiou';
			let firstVowelIndex = -1;

			for (let i = 0; i < word.length; i++) {
				if (vowels.includes(word[i])) {
					firstVowelIndex = i;
					break;
				}
			}

			if (firstVowelIndex === 0) {
				// Starts with a vowel
				return word + 'way';
			} else if (firstVowelIndex > 0) {
				// Consonant(s) at the beginning
				const consonantCluster = word.slice(0, firstVowelIndex);
				const restOfWord = word.slice(firstVowelIndex);
				return restOfWord + consonantCluster + 'ay';
			} else {
				// No vowels (e.g., "by") - treat as consonant
				return word + 'ay';
			}
		});

		outputText = pigLatinWords.join(' ');
	}
</script>

<head>
	<title>{$t('pig_latin.page_title')}</title>
	<meta name="description" content="{$t('pig_latin.page_description')}" />
</head>

<h2>{$t('pig_latin.title')}</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">{$t('pig_latin.input_label')}</label>
		<textarea
			id="inputText"
			bind:value={inputText}
			rows="4"
			placeholder="{$t('pig_latin.input_placeholder')}"
		/>
	</div>

	<button class="button" on:click={translateToPigLatin}>{$t('pig_latin.translate_button')}</button>

	{#if outputText}
		<div class="form-group">
			<label for="outputText">{$t('pig_latin.output_label')}</label>
			<textarea id="outputText" bind:value={outputText} rows="4" readonly />
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: var(--border-radius);
		background-color: var(--bg-2);
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: var(--border-radius);
		font-family: var(--font-mono);
		resize: vertical;
	}

	.button {
		background-color: var(--link);
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s ease;
	}

	.button:hover {
		background-color: var(--link-hover);
	}

	.button:active {
		background-color: var(--link-active);
	}
</style>