<script>
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
				result = inputText.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
				break;
			case 'sentence':
				result = inputText.toLowerCase().split('. ').map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('. ');
				break;
			default:
				result = inputText;
		}
		outputText = result;
	};

	const handleKeyDown = (event) => {
		applyCase();
	};
</script>

<head>
	<title>TxtWizard | Letter Case Converter</title>
	<meta name="keywords" content="letter case, upper case, lower case, title case, sentence case, text converter" />
	<meta name="description" cont
