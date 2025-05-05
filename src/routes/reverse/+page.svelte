<script lang="ts">
	import { t } from 'svelte-i18n';

	let inputText = '';
	let reversedText = '';

	function reverseText() {
		reversedText = inputText.split('').reverse().join('');
	}
</script>

<head>
	<title>TxtWizard | Text Reverse Tool</title>
	<meta name="keywords" content="text, reverse, tool, online, free" />
	<meta name="description" content="Reverse text online with this free and easy-to-use tool." />
</head>

<h2>Text Reverse Tool</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea id="inputText" bind:value={inputText} rows="4" placeholder="Enter your text here"></textarea>
	</div>
	<button class="btn" on:click={reverseText}>Reverse Text</button>

	{#if reversedText}
		<div class="form-group">
			<label for="reversedText">Reversed Text:</label>
			<textarea id="reversedText" value={reversedText} rows="4" readonly></textarea>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
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
		resize: vertical;
	}

	.btn {
		background-color: #4CAF50;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	.btn:hover {
		background-color: #3e8e41;
	}
</style>
