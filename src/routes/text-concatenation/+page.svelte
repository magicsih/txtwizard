<script>
	let text1 = '';
	let text2 = '';
	let concatenatedText = '';

	function concatenateTexts() {
		concatenatedText = text1 + text2;
	}
</script>

<head>
	<title>TxtWizard | Text Concatenation</title>
	<meta name="keywords" content="text concatenation, join text, combine text" />
	<meta name="description" content="Concatenate or join text online. Combine two or more text strings into one." />
</head>

<h2>Text Concatenation Tool</h2>

<div class="container">
	<div class="form-group">
		<label for="text1">Text 1:</label>
		<textarea id="text1" bind:value={text1} rows="4" placeholder="Enter the first text"></textarea>
	</div>

	<div class="form-group">
		<label for="text2">Text 2:</label>
		<textarea id="text2" bind:value={text2} rows="4" placeholder="Enter the second text"></textarea>
	</div>

	<button class="primary" on:click={concatenateTexts}>Concatenate</button>

	{#if concatenatedText}
		<div class="form-group">
			<label for="concatenatedText">Concatenated Text:</label>
			<textarea id="concatenatedText" value={concatenatedText} rows="4" readonly></textarea>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
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
		font-size: 16px;
		resize: vertical;
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
