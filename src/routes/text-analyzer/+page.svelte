<script>
	let inputText = '';
	let charCount = 0;
	let charCountNoSpace = 0;
	let lineCount = 0;
	let wordCount = 0;
	let sentenceCount = 0;
	let uniqueStringCount = 0;
	let byteSize = 0;

	function analyzeText() {
		charCount = inputText.length;
		charCountNoSpace = inputText.replace(/\s/g, '').length;
		lineCount = inputText.split(/\r\n|\r|\n/).length;
		wordCount = inputText.split(/\s+/).filter(word => word.length > 0).length;
		sentenceCount = inputText.split(/[.!\?]+/).filter(sentence => sentence.length > 0).length;

		// Case-insensitive unique strings
		const words = inputText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
		uniqueStringCount = new Set(words).size;

		byteSize = new TextEncoder().encode(inputText).length;
	}
</script>

<head>
	<title>TxtWizard | Text Analyzer</title>
	<meta name="keywords" content="text analyzer, character count, word count, line count, sentence count, byte size" />
	<meta name="description" content="Analyze your text with our text analyzer tool." />
</head>

<h2>Text Analyzer</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea id="inputText" bind:value={inputText} rows="8" placeholder="Enter your text here" on:input={analyzeText}></textarea>
	</div>

	<div class="result-section">
		<h3>Results:</h3>
		<p>Characters (with spaces): {charCount}</p>
		<p>Characters (without spaces): {charCountNoSpace}</p>
		<p>Lines: {lineCount}</p>
		<p>Words: {wordCount}</p>
		<p>Sentences: {sentenceCount}</p>
		<p>Unique Strings (case-insensitive): {uniqueStringCount}</p>
		<p>Byte Size (UTF-8): {byteSize} bytes</p>
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
		font-size: 16px;
		font-family: monospace;
	}

	.result-section {
		margin-top: 20px;
		padding: 15px;
		border: 1px solid #eee;
		border-radius: 4px;
		background-color: #f9f9f9;
	}
</style>
