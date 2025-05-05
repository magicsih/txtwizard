<script lang="ts">
	import { t } from 'svelte-i18n'

	// Define state variables
	let inputText = '';
	let outputText = '';
	let selectedCase: 'uppercase' | 'lowercase' | 'titlecase' = 'uppercase';

	// Function to perform text transformation
	function transformText() {
		switch (selectedCase) {
			case 'uppercase':
				outputText = inputText.toUpperCase();
				break;
			case 'lowercase':
				outputText = inputText.toLowerCase();
				break;
			case 'titlecase':
				outputText = inputText.replace(/\b\w/g, (match) => match.toUpperCase());
				break;
			default:
				outputText = inputText;
		}
	}
</script>

<head>
	<title>TxtWizard | Text Transformer</title>
	<meta name="keywords" content="text,transform,uppercase,lowercase,titlecase">
	<meta name="description" content="Online text transformer tool to convert text to uppercase, lowercase, or title case.">
</head>

<h2>Text Transformer Tool</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea id="inputText" bind:value={inputText} rows="4" class="form-control"></textarea>
	</div>

	<div class="form-group">
		<label for="caseSelect">Select Case:</label>
		<select id="caseSelect" bind:value={selectedCase} class="form-control">
			<option value="uppercase">Uppercase</option>
			<option value="lowercase">Lowercase</option>
			<option value="titlecase">Title Case</option>
		</select>
	</div>

	<button class="btn btn-primary" on:click={transformText}>Transform</button>

	<div class="form-group">
		<label for="outputText">Transformed Text:</label>
		<textarea id="outputText" bind:value={outputText} rows="4" class="form-control" readonly></textarea>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	textarea, select {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	button {
		background-color: #007bff;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 10px;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>