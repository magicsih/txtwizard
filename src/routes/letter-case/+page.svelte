<script>
	let inputText = '';
	let outputText = '';
	let selectedCase = 'uppercase'; // Default case

	function applyCase(event) {
		const text = inputText;
		switch (event.key) {
			case 'u':
				outputText = text.toUpperCase();
				break;
			case 'l':
				outputText = text.toLowerCase();
				break;
			case 't':
				outputText = text.replace(/\w\S*/g, (txt) => {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
				break;
			case 's':
				outputText = text.replace(/\w\S*/g, (txt, index) => {
					if (index === 0 || /[.!\?]\s$/.test(text.substring(0, index))) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					}
					return txt.toLowerCase();
				});
				break;
			default:
				outputText = text; // No change
		}
	}
</script>

<head>
	<title>TxtWizard | Letter Case Converter</title>
	<meta name="keywords" content="letter case, uppercase, lowercase, title case, sentence case, convert text" />
	<meta name="description" content="Convert text to uppercase, lowercase, title case, or sentence case." />
</head>

<h2>Letter Case Converter</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea
			id="inputText"
			bind:value={inputText}
			rows="4"
			placeholder="Enter your text here"
			on:keydown={applyCase}
		></textarea>
	</div>

	{#if outputText}
		<div class="form-group">
			<label for="outputText">Converted Text:</label>
			<textarea id="outputText" bind:value={outputText} rows="4" readonly></textarea>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		border: 1px solid #ccc;
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
		font-family: monospace;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
