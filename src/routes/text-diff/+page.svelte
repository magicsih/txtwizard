<script lang="ts">
	import { t } from 'svelte-i18n';
	import { diffChars } from 'diff';

	let text1 = '';
	let text2 = '';
	let diffOutput = '';

	function generateDiff() {
		const diff = diffChars(text1, text2);
		let output = '';
		diff.forEach((part) => {
			const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
			output += `<span style="color: ${color};">${part.value}</span>`;
		});
		diffOutput = output;
	}
</script>

<head>
	<title>Text Diff Tool</title>
	<meta name="description" content="Compare two texts and see the differences." />
</head>

<h2>Text Diff Tool</h2>

<div class="container">
	<div class="form-group">
		<label for="text1">Text 1:</label>
		<textarea id="text1" bind:value={text1} rows="10" cols="80"></textarea>
	</div>

	<div class="form-group">
		<label for="text2">Text 2:</label>
		<textarea id="text2" bind:value={text2} rows="10" cols="80"></textarea>
	</div>

	<button on:click={generateDiff}>Generate Diff</button>

	{#if diffOutput}
		<h3>Diff Output:</h3>
		<div class="diff-output" innerHTML={diffOutput}></div>
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
		font-family: monospace;
		resize: vertical;
	}

	button {
		padding: 10px 20px;
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #3e8e41;
	}

	.diff-output {
		margin-top: 15px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: monospace;
		overflow-x: auto;
	}
</style>