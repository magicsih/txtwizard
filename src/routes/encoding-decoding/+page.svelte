<script lang="ts">
	import { t } from 'svelte-i18n'
	import { onMount } from 'svelte';
	import { Buffer } from 'buffer'; // Import Buffer for encoding/decoding

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
		const rows = Math.min(Math.max(Math.ceil(textLength / 50), minRows), maxRows);
		return rows;
	}

	// Detect encoding type and perform conversions
	function handleInputChange() {
		// If the input is empty, reset all fields and return
		if (!userInput) {
			plainText = base64 = hex = urlEncode = htmlEncode = '';
			detectedEncoding = '';
			plainTextLength =
				plainTextBytes =
				base64Length =
				base64Bytes =
				hexLength =
				hexBytes =
				urlEncodeLength =
				urlEncodeBytes =
				htmlEncodeLength =
				htmlEncodeBytes =
					0;
			return;
		}

		try {
			// Reset the decoded buffer
			decodedBuffer = Buffer.from('');

			// Detect encoding type and decode to buffer
			if (isHex(userInput)) {
				decodedBuffer = Buffer.from(userInput, 'hex');
				plainText = decodedBuffer.toString('utf-8');
				detectedEncoding = 'Hex';
			} else if (isUrlEncoded(userInput)) {
				plainText = decodeURIComponent(userInput);
				decodedBuffer = Buffer.from(plainText, 'utf-8'); // Convert URL-decoded text back to buffer
				detectedEncoding = 'URL-Encoded';
			} else if (isHtmlEncoded(userInput)) {
				plainText = decodeHtmlEntities(userInput);
				decodedBuffer = Buffer.from(plainText, 'utf-8'); // Convert HTML-decoded text back to buffer
				detectedEncoding = 'HTML-Encoded';
			} else if (isBase64(userInput)) {
				decodedBuffer = Buffer.from(userInput, 'base64');
				plainText = decodedBuffer.toString('utf-8');
				detectedEncoding = 'Base64';
			} else {
				plainText = userInput;
				decodedBuffer = Buffer.from(plainText, 'utf-8');
				detectedEncoding = 'Plain Text';
			}

			// Convert decoded buffer to all encodings
			base64 = decodedBuffer.toString('base64');
			hex = decodedBuffer.toString('hex');
			urlEncode = encodeURIComponent(decodedBuffer.toString('utf-8'));
			htmlEncode = encodeHtmlEntities(decodedBuffer.toString('utf-8'));

			// Update lengths and byte sizes
			plainTextLength = plainText.length;
			plainTextBytes = Buffer.byteLength(plainText, 'utf-8');
			base64Length = base64.length;
			base64Bytes = Buffer.byteLength(base64, 'utf-8');
			hexLength = hex.length;
			hexBytes = Buffer.byteLength(hex, 'utf-8');
			urlEncodeLength = urlEncode.length;
			urlEncodeBytes = Buffer.byteLength(urlEncode, 'utf-8');
			htmlEncodeLength = htmlEncode.length;
			htmlEncodeBytes = Buffer.byteLength(htmlEncode, 'utf-8');
		} catch (error) {
			console.error('Error processing input', error);
		}
	}

	// Updated isBase64 function with stricter validation
	function isBase64(str: string) {
		// Check if the length is divisible by 4
		if (str.length % 4 !== 0) {
			return false;
		}
		// Check if the string contains only valid Base64 characters
		const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
		if (!base64Regex.test(str)) {
			return false;
		}
		// Try decoding the string using Buffer to verify it's valid Base64
		try {
			const decoded = Buffer.from(str, 'base64').toString('base64');
			return decoded === str;
		} catch (e) {
			return false;
		}
	}

	// Hex detection remains the same
	function isHex(str: string) {
		return /^[0-9a-fA-F]+$/g.test(str) && str.length % 2 === 0;
	}

	// URL encoding
	function isUrlEncoded(str: string) {
		try {
			return str !== decodeURIComponent(str);
		} catch (e) {
			return false;
		}
	}

	// HTML encoding
	function encodeHtmlEntities(str: string) {
		return str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
			return '&#' + i.charCodeAt(0) + ';';
		});
	}
	function decodeHtmlEntities(str: string) {
		let textarea = document.createElement('textarea');
		textarea.innerHTML = str;
		return textarea.value;
	}
	function isHtmlEncoded(str: string) {
		return /&[a-z]+;/i.test(str) || /&#\d+;/.test(str);
	}

	onMount(() => {
		handleInputChange(); // Initialize with empty state
	});
</script>

<head>
	<title>TxtWizard | Free Online Text Encoding and Decoding Tool</title>
</head>

<h2>{ $t('encoding') } & { $t('decoding') } { $t('tool') }</h2>

<!-- UI Structure -->
<div class="container">
	<!-- User Input Box -->
	<div class="form-group">
		<label for="userInput">Enter Text</label>
		<textarea
			id="userInput"
			bind:value={userInput}
			on:input={handleInputChange}
			rows="4"
			placeholder="Enter your text or encoded data here"
		></textarea>
		<small>Detected Encoding: {detectedEncoding}</small>
	</div>

	<!-- Auto-Converted Fields -->
	<div class="form-group">
		<label for="plainText">Plain Text</label>
		<textarea id="plainText" bind:value={plainText} rows={calculateRows(plainTextLength)} readonly
		></textarea>
		<small>{plainTextLength} letters ({plainTextBytes} bytes in size)</small>
	</div>

	<div class="form-group">
		<label for="base64">Base64</label>
		<textarea id="base64" bind:value={base64} rows={calculateRows(base64Length)} readonly
		></textarea>
		<small>{base64Length} letters ({base64Bytes} bytes in size)</small>
	</div>

	<div class="form-group">
		<label for="hex">Hex</label>
		<textarea id="hex" bind:value={hex} rows={calculateRows(hexLength)} readonly></textarea>
		<small>{hexLength} letters ({hexBytes} bytes in size)</small>
	</div>

	<div class="form-group">
		<label for="urlEncode">URL Encode</label>
		<textarea id="urlEncode" bind:value={urlEncode} rows={calculateRows(urlEncodeLength)} readonly
		></textarea>
		<small>{urlEncodeLength} letters ({urlEncodeBytes} bytes in size)</small>
	</div>

	<div class="form-group">
		<label for="htmlEncode">HTML Encode</label>
		<textarea
			id="htmlEncode"
			bind:value={htmlEncode}
			rows={calculateRows(htmlEncodeLength)}
			readonly
		></textarea>
		<small>{htmlEncodeLength} letters ({htmlEncodeBytes} bytes in size)</small>
	</div>
</div>

<div class="description">
	<h3>About the Text Encoding and Decoding Tool</h3>
	<p>
		Welcome to our comprehensive online tool for encoding and decoding text into various formats,
		including Base64, Hexadecimal, URL Encoding, and HTML Encoding. Whether you're a developer, a
		cybersecurity enthusiast, or just someone looking to convert text formats, our tool provides an
		easy-to-use interface for all your encoding and decoding needs. You can input your plain text
		and convert it into different formats, or reverse encoded text back into its original form—all
		in one convenient place.
	</p>

	<h3>What is Text Encoding?</h3>
	<p>
		Text encoding is the process of converting characters from their readable form into a
		specialized format that can be safely transmitted or stored in systems that only accept specific
		types of data. Encoding formats like Base64, Hexadecimal, URL Encoding, and HTML Encoding ensure
		that special characters are handled properly during transmission or when displayed in a web
		browser.
	</p>

	<h3>Supported Encoding Formats</h3>
	<ul>
		<li>
			<strong>Base64:</strong> Commonly used to encode binary data into ASCII format for safe transmission
			over text-based protocols.
		</li>
		<li>
			<strong>Hexadecimal:</strong> A base-16 encoding system frequently used in programming, cryptography,
			and data encoding.
		</li>
		<li>
			<strong>URL Encoding:</strong> Ensures that URLs are safely transmitted over the internet by replacing
			unsafe characters with percent-encoded characters.
		</li>
		<li>
			<strong>HTML Encoding:</strong> Converts special characters to HTML entities, ensuring they are
			safely rendered in browsers.
		</li>
	</ul>

	<h3>How to Use the Encoding and Decoding Tool</h3>
	<p>
		This tool allows you to enter your text and instantly see the converted output in different
		encoding formats. If you have encoded text, the tool will automatically detect the format and
		convert it back to plain text for you. Here’s how to use it:
	</p>
	<ol>
		<li>
			Enter your text into the input field. The tool will detect if your text is already encoded
			(Base64, Hex, URL, or HTML) and convert it to plain text if necessary.
		</li>
		<li>
			View the encoded results in the provided fields (Base64, Hex, URL-Encoded, HTML-Encoded). The
			output will adjust dynamically as you type.
		</li>
		<li>
			The tool will automatically resize the output boxes based on the length of the content,
			providing an easy-to-read experience for large or small data sets.
		</li>
	</ol>

	<h3>Why Use Our Online Encoding and Decoding Tool?</h3>
	<p>
		Our tool is perfect for web developers, cybersecurity professionals, and students who need a
		fast, reliable, and easy-to-use platform for converting text to and from various encoding
		formats. Whether you are handling secure data, working with web development, or simply trying to
		understand how encoding works, our tool provides a user-friendly experience with rich content to
		support your learning and development.
	</p>

	<h3>Key Benefits of Using Our Encoding Tool</h3>
	<ul>
		<li><strong>Fast and Instant Conversion:</strong> Get results in real-time as you type.</li>
		<li>
			<strong>Multi-Format Support:</strong> Convert text to and from Base64, Hex, URL-encoded, and HTML-encoded
			formats.
		</li>
		<li>
			<strong>Easy-to-Use Interface:</strong> Intuitive and clean design for a smooth user experience.
		</li>
		<li>
			<strong>Automatic Detection:</strong> Automatically detects the format of your input and decodes
			it back to plain text.
		</li>
		<li>
			<strong>Responsive Layout:</strong> Text areas adjust based on the size of the content, ensuring
			that both small and large amounts of text are displayed optimally.
		</li>
	</ul>

	<h3>When to Use Text Encoding and Decoding?</h3>
	<p>
		Encoding and decoding are essential techniques in web development, cryptography, data storage,
		and networking. Here are some scenarios where encoding and decoding are commonly used:
	</p>
	<ul>
		<li>
			<strong>Web Development:</strong> Encoding ensures that URLs, HTML content, and cookies are transmitted
			safely over the web.
		</li>
		<li>
			<strong>Data Security:</strong> Base64 encoding is often used to encode binary data for secure
			transmission over text-based protocols such as email.
		</li>
		<li>
			<strong>Programming:</strong> Hexadecimal encoding is frequently used in programming and cryptography
			for representing binary data in a readable format.
		</li>
		<li>
			<strong>HTML and XML Processing:</strong> HTML encoding prevents cross-site scripting (XSS) attacks
			by converting special characters to HTML entities.
		</li>
	</ul>
</div>

<style>
	.container {
		/* max-width: 800px; */
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 5px;
	}

	textarea {
		width: 100%;
		padding: 8px;
		margin-top: 5px;
		border-radius: 4px;
		border: 1px solid #ccc;
		font-size: 1em;
	}

	textarea[readonly] {
		background-color: #f9f9f9;
	}

	small {
		display: block;
		color: #666;
		margin-top: 5px;
	}
</style>
