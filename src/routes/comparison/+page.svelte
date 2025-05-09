<script lang="ts">
	import { t } from 'svelte-i18n';

	let text1 = '';
	let text2 = '';
	let diff = '';
	let deduplicatedText = '';
	let deduplicationType = 'line';

	function compareTexts() {
		const lines1 = text1.split('\n');
		const lines2 = text2.split('\n');
		let differences = [];

		let i = 0;
		let j = 0;

		while (i < lines1.length || j < lines2.length) {
			const line1 = lines1[i] || '';
			const line2 = lines2[j] || '';

			 if (line1 === line2) {
					// Lines are identical
					// differences.push(`<span class='identical'>${line1}</span>`); // Consider adding identical lines as well, if needed
					 i++;
					 j++;
				} else {
					 if (lines1[i] != lines2[j])
						 if ((j+1 < lines2.length && lines1[i] != lines2[j+1]) && (i+1 < lines1.length && lines2[j] != lines1[i+1]))
						 {
							 if (lines1[i])
								 differences.push(`<span class='removed'>- ${line1}</span>`);
							 if (lines2[j])
								 differences.push(`<span class='added'>+ ${line2}</span>`);
							 i++;
							 j++;
						 }
						 else if (lines1[i] == lines2[j+1])
						 {
							 if (lines1[i])
								 differences.push(`<span class='removed'>- ${line1}</span>`);
							 i++;
							 //j++;
						 }
						 else if (lines2[j] == lines1[i+1])
						 {
							 if (lines2[j])
								 differences.push(`<span class='added'>+ ${line2}</span>`);
							 //i++;
							 j++;
						 }
				}
		}

		

		 diff = differences.join('<br>');
	}

	function deduplicateText() {
		const text = text1;
		const lines = text.split('\n');
		const sentences = text.split(/[.!?]+/);

		let uniqueEntries = [];
		let seen = new Set();

		const entries = deduplicationType === 'line' ? lines : sentences;

		for (const entry of entries) {
			const trimmedEntry = entry.trim();
			if (trimmedEntry && !seen.has(trimmedEntry)) {
				uniqueEntries.push(trimmedEntry);
				seen.add(trimmedEntry);
			}
		}

		
		
		
		let result = uniqueEntries.join(deduplicationType === 'line' ? '\n' : '. ');
		
		
		
		
		
		
		
		
		
		 if (deduplicationType != 'line')
			 result = result + '.';

		
		
		

		deduplicatedText = result;
	}

	
</script>

<head>
	<title>TxtWizard | Text Comparison Tool</title>
	<meta name="keywords" content="text, compare, difference, duplicate, remove" />
	<meta name="description" content="Compare texts and remove duplicate lines or sentences." />
</head>

<h2>{$t('comparison')} {$t('tool')}</h2>

<div class="container">
	<h3>{$t('text-comparison')}</h3>
	<div class="text-input">
		<label for="text1">{$t('text1')}:</label>
		<textarea id="text1" bind:value={text1} rows="6" placeholder="{$t('enter-text1')}"></textarea>
	</div>
	<div class="text-input">
		<label for="text2">{$t('text2')}:</label>
		<textarea id="text2" bind:value={text2} rows="6" placeholder="{$t('enter-text2')}"></textarea>
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
		<textarea id="textToDeduplicate" bind:value={textToDeduplicate} rows="6" placeholder="{$t('enter-text-deduplicate')}"></textarea>
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

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
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
		border: 1px solid #ddd;
		border-radius: 4px;
		resize: vertical;
	}

	button {
		background-color: #4CAF50;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1em;
	}

	button:hover {
		background-color: #3e8e41;
	}

	.diff-output,
	.deduplicated-output {
		margin-top: 20px;
		padding: 10px;
		border: 1px solid #eee;
		border-radius: 4px;
		background-color: #f5f5f5;
	}

	.removed {
		color: red;
		background-color: #ffe6e6;
		
	}

	.added {
		color: green;
		background-color: #e6ffe6;
	}

	.identical {
		color: grey;
	}
	
	.deduplication-options {
		margin-bottom: 15px;
	}

	select {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1em;
	}
</style>

