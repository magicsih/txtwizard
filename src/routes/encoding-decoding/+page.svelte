<script lang="ts">
	import { t } from 'svelte-i18n'
	import { Buffer } from 'buffer';
	import { onMount } from 'svelte';

	// Define the reactive values for user input and the auto-converted formats
	let userInput = '';
	let plainText = '';
	let base64 = '';
	let hex = '';
	let urlEncode = '';
	let htmlEncode = '';
	let detectedEncoding = 'Plain Text'; // Default detected encoding type
	let decodedBuffer: Buffer; // Buffer to hold the decoded content

	// Byte lengths and letter counts
	let plainTextLength = 0;
	let plainTextBytes = 0;
	let base64Length = 0;
	let base64Bytes = 0;
	let hexLength = 0;
	let hexBytes = 0;
	let urlEncodeLength = 0;
	let urlEncodeBytes = 0;
	let htmlEncodeLength = 0;
	let htmlEncodeBytes = 0;

	// Function to calculate rows dynamically based on length
	function calculateRows(textLength: number): number {
		const minRows = 2;
		const maxRows = 10;
		// 50 characters per row approximation, adjust as needed
		const rows = Math.max(minRows, Math.min(maxRows, Math.ceil(textLength / 50)));
		return rows;
	}

	// Function to detect the encoding type of the input
	function detectEncoding(input: string): string {
		try {
			// Attempt to decode as Base64
			const bufferFromBase64 = Buffer.from(input, 'base64');
			if (bufferFromBase64.toString('base64') === input) {
				return 'Base64';
			}
		} catch (error) {
			// Ignore errors, not Base64
		}

		try {
			// Attempt to decode as Hex
			const bufferFromHex = Buffer.from(input, 'hex');
			if (bufferFromHex.toString('hex') === input) {
				return 'Hex';
			}
		} catch (error) {
			// Ignore errors, not Hex
		}

		// URL Encoding detection (basic)
		if (input.includes('%')) {
			return 'URL Encoded';
		}

		// HTML Encoding detection (basic)
		if (input.includes('&lt;') || input.includes('&gt;') || input.includes('&amp;') || input.includes('&quot;')) {
			return 'HTML Encoded';
		}

		return 'Plain Text';
	}

	// Function to update all the output formats based on the user input
	function updateOutputs() {
		plainText = userInput;
		plainTextLength = userInput.length;
		plainTextBytes = Buffer.from(userInput).length;

		base64 = Buffer.from(userInput).toString('base64');
		base64Length = base64.length;
		base64Bytes = Buffer.from(base64).length;

		hex = Buffer.from(userInput).toString('hex');
		hexLength = hex.length;
		hexBytes = Buffer.from(hex).length;

		urlEncode = encodeURIComponent(userInput);
		urlEncodeLength = urlEncode.length;
		urlEncodeBytes = Buffer.from(urlEncode).length;

		htmlEncode = userInput.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		htmlEncodeLength = htmlEncode.length;
		htmlEncodeBytes = Buffer.from(htmlEncode).length;

		detectedEncoding = detectEncoding(userInput);
	}

	// Use onMount to ensure that the page is fully rendered before setting the focus
	onMount(() => {
		const inputElement = document.getElementById('userInput') as HTMLTextAreaElement | null;
		if (inputElement) {
			inputElement.focus();
		}
	});

</script>

<head>
	<title>TxtWizard | Free Online Encoding & Decoding Tool</title>
	<meta
		name="keywords"
		content="online,encode,decode,text,converter,tool,base64,hex,url,html"
	/>
	<meta
		name="description"
		content="Free online tool to encode and decode text in various formats like Base64, Hex, URL, and HTML."
	/>
</head>

<h2>Encoding and Decoding</h2>

<div class="container">
	<!-- Input Section -->
	<div class="form-group">
		<label for="userInput">Enter Text</label>
		<textarea
			id="userInput"
			bind:value={userInput}
			on:input={updateOutputs}
			rows={calculateRows(userInput.length)}
			placeholder="Enter your text here"
		/>
		<p>Detected Encoding: {detectedEncoding}</p>
	</div>

	<!-- Output Section -->
	<div class="output-section">
		<h3>Plain Text</h3>
		<textarea rows={calculateRows(plainTextLength)} readonly bind:value={plainText} />
		<p>Length: {plainTextLength} characters, {plainTextBytes} bytes</p>

		<h3>Base64</h3>
		<textarea rows={calculateRows(base64Length)} readonly bind:value={base64} />
		<p>Length: {base64Length} characters, {base64Bytes} bytes</p>

		<h3>Hex</h3>
		<textarea rows={calculateRows(hexLength)} readonly bind:value={hex} />
		<p>Length: {hexLength} characters, {hexBytes} bytes</p>

		<h3>URL Encoded</h3>
		<textarea rows={calculateRows(urlEncodeLength)} readonly bind:value={urlEncode} />
		<p>Length: {urlEncodeLength} characters, {urlEncodeBytes} bytes</p>

		<h3>HTML Encoded</h3>
		<textarea rows={calculateRows(htmlEncodeLength)} readonly bind:value={htmlEncode} />
		<p>Length: {htmlEncodeLength} characters, {htmlEncodeBytes} bytes</p>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
		max-width: 800px;
		margin: 0 auto;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	textarea {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: monospace;
		resize: vertical;
	}

	.output-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	h3 {
		margin-top: 15px;
		margin-bottom: 5px;
	}

	@media (min-width: 768px) {
		.container {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
		}

		.form-group, .output-section {
			width: 48%;
		}
	}
</style>
