<script lang="ts">
	let inputText = '';
	let outputText = '';
	let textCase = 'none'; // none, upper, lower, title, sentence

	const applyCase = () => {
		let result = inputText;
		switch (textCase) {
			case 'upper':
				result = inputText.toUpperCase();
				break;
			case 'lower':
				result = inputText.toLowerCase();
				break;
			case 'title':
				result = inputText
					.toLowerCase()
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');
				break;
			case 'sentence':
				result = inputText
					.toLowerCase()
					.split('. ')
					.map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
					.join('. ');
				break;
			default:
				result = inputText;
		}
		outputText = result;
	};

	const handleKeyDown = (_event: KeyboardEvent) => {
		applyCase();
	};
</script>

<head>
	<title>TxtWizard | Letter Case Converter</title>
	<meta
		name="keywords"
		content="letter case, upper case, lower case, title case, sentence case, text converter"
	/>
	<meta
		name="description"
		content="Convert text to upper case, lower case, title case, or sentence case."
	/>
</head>

<h2>Letter Case Converter</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea
			id="inputText"
			bind:value={inputText}
			on:keydown={handleKeyDown}
			rows="4"
			placeholder="Enter your text here"
		></textarea>
	</div>

	<div class="form-group">
		<label for="outputText">Output Text:</label>
		<textarea id="outputText" bind:value={outputText} rows="4" readonly></textarea>
	</div>

	<div class="form-group">
		<label for="selectCase">Select Case:</label>
		<select id="selectCase" bind:value={textCase} on:change={applyCase}>
			<option value="none">None</option>
			<option value="upper">Upper Case</option>
			<option value="lower">Lower Case</option>
			<option value="title">Title Case</option>
			<option value="sentence">Sentence Case</option>
		</select>
	</div>
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
		font-family: monospace;
		resize: vertical;
	}

	select {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 16px;
	}
</style>
