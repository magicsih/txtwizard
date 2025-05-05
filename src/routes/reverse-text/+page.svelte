<script lang="ts">
	import { t } from 'svelte-i18n';

	let inputText = '';
	let reversedText = '';

	function reverseText() {
		reversedText = inputText.split('').reverse().join('');
	}
</script>

<head>
	<title>TxtWizard | Reverse Text</title>
	<meta name="keywords" content="reverse text, online tool, text manipulation" />
	<meta
		name="description"
		content="Reverse text tool, a free online tool to reverse any text."
	/>
</head>

<h2>Reverse Text Tool</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea id="inputText" bind:value={inputText} rows="4" placeholder="Enter your text here"></textarea>
	</div>
	<button class="btn" on:click={reverseText}>Reverse</button>
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
		font-weight: bold;
		margin-bottom: 5px;
	}

	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 16px;
	}

	button {
		background-color: #4CAF50;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	button:hover {
		background-color: #3e8e41;
	}
</style>
