<script lang="ts">
	import { t } from 'svelte-i18n';
	let inputText = '';
	let reversedText = '';

	function reverseText() {
		reversedText = inputText.split('').reverse().join('');
	}
</script>

<head>
	<title>TxtWizard | Text Reverse</title>
	<meta name="keywords" content="text, reverse, tool">
	<meta name="description" content="Reverse text online. Simply type or paste text to reverse it.">
</head>

<h2>Text Reverse Tool</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea id="inputText" bind:value={inputText} rows="4" placeholder="Type or paste your text here"></textarea>
	</div>
	<button class="button" on:click={reverseText}>Reverse Text</button>

	<div class="form-group">
		<label for="reversedText">Reversed Text:</label>
		<textarea id="reversedText" bind:value={reversedText} rows="4" readonly></textarea>
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

	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: Arial, sans-serif;
	}

	button {
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>
