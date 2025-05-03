<script lang="ts">
	let inputText = '';
	let outputText = '';
	let selectedCase = 'uppercase';

	const cases = [
		{ value: 'uppercase', label: 'Uppercase' },
		{ value: 'lowercase', label: 'Lowercase' },
		{ value: 'titlecase', label: 'Title Case' },
		{ value: 'sentencecase', label: 'Sentence Case' },
		{ value: 'alternatingcase', label: 'Alternating Case' },
	];

	function convertText() {
		switch (selectedCase) {
			case 'uppercase':
				outputText = inputText.toUpperCase();
				break;
			case 'lowercase':
				outputText = inputText.toLowerCase();
				break;
			case 'titlecase':
				outputText = toTitleCase(inputText);
				break;
			case 'sentencecase':
				outputText = toSentenceCase(inputText);
				break;
			case 'alternatingcase':
				outputText = toAlternatingCase(inputText);
				break;
			default:
				outputText = inputText;
		}
	}

	function toTitleCase(str: string): string {
		return str.replace(/\w\S*/g, (txt) => {
			return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
		});
	}

	function toSentenceCase(str: string): string {
		return str.replace(/(\.|\?)\s*(\w)/g, (match, p1, p2) => {
			return p1 + ' ' + p2.toUpperCase();
		}).replace(/^\w/, (match) => {
			return match.toUpperCase();
		});
	}

	function toAlternatingCase(str: string): string {
		let result = '';
		for (let i = 0; i < str.length; i++) {
			if (i % 2 === 0) {
				result += str[i].toUpperCase();
			} else {
				result += str[i].toLowerCase();
			}
		}
		return result;
	}
</script>

<head>
	<title>TxtWizard | Text Case Converter</title>
	<meta name="description" content="Convert text to uppercase, lowercase, title case, sentence case, and alternating case." />
</head>

<h2>Text Case Converter</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea
			id="inputText"
			bind:value={inputText}
			rows="4"
			placeholder="Enter your text here..."
		></textarea>
	</div>

	<div class="form-group">
		<label for="caseSelect">Select Case:</label>
		<select id="caseSelect" bind:value={selectedCase}>
			{#each cases as c}
				<option value={c.value}>{c.label}</option>
			{/each}
		</select>
	</div>

	<button on:click={convertText}>Convert</button>

	<div class="form-group">
		<label for="outputText">Output Text:</label>
		<textarea
			id="outputText"
			bind:value={outputText}
			rows="4"
			readonly
			placeholder="Your converted text will appear here..."
		></textarea>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}

	label {
		font-weight: bold;
		margin-bottom: 5px;
	}

	textarea,
	select {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 16px;
	}

	button {
		padding: 10px 15px;
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	button:hover {
		background-color: #3e8e41;
	}
</style>