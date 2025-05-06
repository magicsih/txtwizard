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
		sentenceCount = inputText.split(/[.!?]+/).filter(sentence => sentence.length > 0).length;

		// Case-insensitive unique strings
		const words = inputText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
		uniqueStringCount = new Set(words).size;

		byteSize = new TextEncoder().encode(inputText).length;
	}
</script>

<head>
	<title>TxtWizard | Text Analyzer</title>
	<meta name="keywords" content="text analyzer, character count, word count, line count, sentence count, byte size" />
	<meta name="description" content="Anal
