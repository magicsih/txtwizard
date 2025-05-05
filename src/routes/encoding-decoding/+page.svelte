<script lang="ts">
	import { t } from 'svelte-i18n'

	// Define the reactive values for user input and the auto-converted formats
	let userInput = '';
	let plainText = '';
	let base64 = '';
	let hex = '';
	let urlEncode = '';
	let htmlEncode = '';
	let detectedEncoding = 'Plain Text'; // Default detected encoding type
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
		const calculatedRows = Math.ceil(textLength / 50);
		return Math.min(maxRows, Math.max(minRows, calculatedRows));
	}

	// Function to update the output values
	function updateOutputs() {
		plainText = userInput;
		base64 = btoa(unescape(encodeURIComponent(userInput))); // Encode
		hex = Array.from(userInput)
			.map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
			.join('');
		urlEncode = encodeURIComponent(userInput);
		htmlEncode = userInput.replace(/["&'<>]/g, (a) => {
			return {
				'"': '&quot;',
				'&': '&amp;',
				"'": '&#39;',
				'<': '&lt;',
				'>': '&gt;'
			}[a] || a;
		});

		// Update lengths and byte counts
		plainTextLength = userInput.length;
		plainTextBytes = new TextEncoder().encode(userInput).length;
		base64Length = base64.length;
		base64Bytes = Math.floor(base64.length * 0.75); // Approximate bytes for Base64
		hexLength = hex.length;
		hexBytes = hex.length / 2;
		urlEncodeLength = urlEncode.length;
		urlEncodeBytes = new TextEncoder().encode(urlEncode).length;
		htmlEncodeLength = htmlEncode.length;
		htmlEncodeBytes = new TextEncoder().encode(htmlEncode).length;

		// Detect Encoding Type
		detectEncodingType();
	}

	// Function to detect encoding type
	function detectEncodingType() {
		// If input is empty, default to plain text
		if (userInput === '') {
			detectedEncoding = 'Plain Text';
			return;
		}

		// Attempt to detect based on characters and patterns
		if (/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(userInput)) {
			detectedEncoding = 'Base64';
		} else if (/^([0-9A-Fa-f]{2})*$/.test(userInput)) {
			detectedEncoding = 'Hex';
		} else if (userInput.includes('%')) {
			detectedEncoding = 'URL Encoded';
		} else if (userInput.includes('&lt;') || userInput.includes('&gt;') || userInput.includes('&quot;') || userInput.includes('&#39;') || userInput.includes('&amp;')) {
			detectedEncoding = 'HTML Encoded';
		} else {
			detectedEncoding = 'Plain Text';
		}
	}

	// Update outputs whenever user input changes
	$: updateOutputs();
</script>

<head>
	<title>TxtWizard | Encoding / Decoding</title>
	<meta
		name="keywords"
		content="text,encoding,decoding,base64,hex,url,html"
	/>
	<meta
		name="description"
		content="Free online text encoding and decoding tool. Convert between Base64, Hex, URL encoding, and HTML encoding."
	/>
</head>

<h2>{ $t('encoding') } { $t('tool') }</h2>

<div class="container">
	<!-- Input Section -->
	<div class="form-group">
		<label for="userInput">Enter Text</label>
		<textarea
			id="userInput"
			bind:value={userInput}
			rows={calculateRows(userInput.length)}
			placeholder="Enter text to encode or decode"
		/>
		<p>Detected Encoding: {detectedEncoding}</p>
	</div>

	<!-- Output Sections -->
	<div class="output-section">
		<h3>Plain Text</h3>
		<div class="output-info">
			<p>Length: {plainTextLength} characters</p>
			<p>Bytes: {plainTextBytes} bytes</p>
		</div>
		<textarea
			rows={calculateRows(plainTextLength)}
			readonly
			bind:value={plainText}
		/>
	</div>

	<div class="output-section">
		<h3>Base64</h3>
		<div class="output-info">
			<p>Length: {base64Length} characters</p>
			<p>Bytes: {base64Bytes} bytes</p>
		</div>
		<textarea
			rows={calculateRows(base64Length)}
			readonly
			bind:value={base64}
		/>
	</div>

	<div class="output-section">
		<h3>Hex</h3>
		<div class="output-info">
			<p>Length: {hexLength} characters</p>
			<p>Bytes: {hexBytes} bytes</p>
		</div>
		<textarea
			rows={calculateRows(hexLength)}
			readonly
			bind:value={hex}
		/>
	</div>

	<div class="output-section">
		<h3>URL Encoded</h3>
		<div class="output-info">
			<p>Length: {urlEncodeLength} characters</p>
			<p>Bytes: {urlEncodeBytes} bytes</p>
		</div>
		<textarea
			rows={calculateRows(urlEncodeLength)}
			readonly
			bind:value={urlEncode}
		/>
	</div>

	<div class="output-section">
		<h3>HTML Encoded</h3>
		<div class="output-info">
			<p>Length: {htmlEncodeLength} characters</p>
			<p>Bytes: {htmlEncodeBytes} bytes</p>
		</div>
		<textarea
			rows={calculateRows(htmlEncodeLength)}
			readonly
			bind:value={htmlEncode}
		/>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 5px;
	}

	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 16px;
		margin-bottom: 10px;
		box-sizing: border-box;
	}

	.output-section {
		margin-bottom: 20px;
		padding: 15px;
		border: 1px solid #eee;
		border-radius: 4px;
		background-color: #fff;
	}

	h3 {
		margin-bottom: 10px;
		font-size: 1.2em;
	}

	.output-info {
		color: #555;
		margin-bottom: 10px;
	}
</style>
