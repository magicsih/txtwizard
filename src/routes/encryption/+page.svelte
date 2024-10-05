<script lang="ts">
	import { Buffer } from 'buffer';

	let values = {
	  algorithm: 'AES-GCM',
	  key: '',
	  iv: '',
	  keyFieldSize: 0,
	  ivFieldSize: 0,
	  targetPlainText: '',
	  outEncryptedText: ''
	};
  
	let encodingFormat: 'base64' | 'hex' = 'base64'; // Default encoding format
	let previousEncodingFormat: 'base64' | 'hex' = 'base64'; // Track previous encoding format for conversion
  
	const algorithmSet: Record<string, { keySize: number[]; ivSize: number }> = {
	  'AES-CBC': { keySize: [16, 32], ivSize: 16 },
	  'AES-GCM': { keySize: [16, 32], ivSize: 12 }
	};
  
	let cryptoKey: CryptoKey | null = null;
  
	function handleChangeAlgorithm(event: Event) {
	  const target = event.target as HTMLSelectElement;
	  values.algorithm = target.value;
	}
  
	async function handleOnChangeKey(event: Event) {
	  values.key = event.target.value;
	  values.keyFieldSize = Buffer.from(event.target.value, encodingFormat).length * 8;
  
	  const rawKey = Buffer.from(values.key, encodingFormat);
	  cryptoKey = await window.crypto.subtle.importKey(
		'raw',
		rawKey,
		{ name: values.algorithm },
		false,
		['encrypt', 'decrypt']
	  );
	}
  
	function handleOnChangeIV(event: Event) {
	  values.iv = event.target.value;
	  values.ivFieldSize = Buffer.from(event.target.value, encodingFormat).length * 8;
	}
  
	function handleOnChangeTargetPlainText(event: Event) {
	  values.targetPlainText = event.target.value;
	}
  
	async function generateRandomBytes(size: number) {
	  const array = new Uint8Array(size);
	  window.crypto.getRandomValues(array);
	  return Buffer.from(array);
	}
  
	async function handleOnClickRandomKey(bitSize: number) {
	  const randomBuffer = await generateRandomBytes(algorithmSet[values.algorithm].keySize[bitSize === 128 ? 0 : 1]);
	  values.key = randomBuffer.toString(encodingFormat);
	  values.keyFieldSize = randomBuffer.length * 8;
  
	  cryptoKey = await window.crypto.subtle.importKey(
		'raw',
		randomBuffer,
		{ name: values.algorithm },
		false,
		['encrypt', 'decrypt']
	  );
	}
  
	async function handleOnClickRandomIV() {
	  const randomBuffer = await generateRandomBytes(algorithmSet[values.algorithm].ivSize);
	  values.iv = randomBuffer.toString(encodingFormat);
	  values.ivFieldSize = randomBuffer.length * 8;
	}
  
	async function encrypt() {
	  try {
		if (!cryptoKey) {
		  alert('Invalid key');
		  return;
		}
  
		const ivBuffer = Buffer.from(values.iv, encodingFormat);
		const plainTextBuffer = Buffer.from(values.targetPlainText, 'utf-8');
  
		const encrypted = await window.crypto.subtle.encrypt(
		  { name: values.algorithm, iv: ivBuffer },
		  cryptoKey,
		  plainTextBuffer
		);
  
		values.outEncryptedText = Buffer.from(new Uint8Array(encrypted)).toString(encodingFormat);
	  } catch (error) {
		console.error('Error during encryption:', error);
	  }
	}
  
	// Function to convert values between Base64 and Hex formats
	function convertEncoding(value: string, from: 'base64' | 'hex', to: 'base64' | 'hex'): string {
	  try {
		return Buffer.from(value, from).toString(to);
	  } catch (error) {
		alert('Error converting value: Invalid format for ' + from + ' encoding');
		throw error;
	  }
	}
  
	// Function triggered when encoding format is changed
	function handleEncodingChange(event: Event) {
	  const target = event.target as HTMLSelectElement;
	  const newEncoding = target.value as 'base64' | 'hex';
  
	  try {
		// Convert all values when encoding changes
		if (values.key) values.key = convertEncoding(values.key, previousEncodingFormat, newEncoding);
		if (values.iv) values.iv = convertEncoding(values.iv, previousEncodingFormat, newEncoding);
		if (values.outEncryptedText)
		  values.outEncryptedText = convertEncoding(values.outEncryptedText, previousEncodingFormat, newEncoding);
  
		// Update field sizes
		values.keyFieldSize = Buffer.from(values.key, newEncoding).length * 8;
		values.ivFieldSize = Buffer.from(values.iv, newEncoding).length * 8;
  
		previousEncodingFormat = newEncoding; // Set new format as the current format
		encodingFormat = newEncoding; // Update the current encoding format
	  } catch (error) {
		// In case of an error during conversion, we reset to previous format
		encodingFormat = previousEncodingFormat;
		return;
	  }
	}
  
	// Function to get byte length of a string in the current encoding
	function getByteLength(value: string, encoding: 'base64' | 'hex' | 'utf-8') {
	  return Buffer.from(value, encoding).length;
	}
  </script>
  
  <head>
	<title>TxtWizard | Free Online Text Encrypting Tool - AES/GCM, AES/CBC</title>
  </head>
  
  <h2>Encrypt Text - AES/GCM, AES/CBC</h2>
  
  <div class="description">
	<h3>What is Encryption?</h3>
	<p>
	  Encryption is a process of converting plain text into a coded format that can only be deciphered by authorized parties. It ensures the confidentiality and security of your data by using cryptographic algorithms such as AES-GCM and AES-CBC. This tool allows you to easily encrypt sensitive information using various encryption methods, ensuring that your data remains secure.
	</p>
  
	<h3>How to Use the Encryption Tool</h3>
	<ol>
	  <li>Select an encryption algorithm (AES-GCM or AES-CBC) from the dropdown menu.</li>
	  <li>Enter or generate a random key and initialization vector (IV) in the provided fields.</li>
	  <li>Input the plain text (message) you want to encrypt in the "Plain Text" box.</li>
	  <li>Click the "ENCRYPT" button to get the encrypted output, which will be displayed in the "Encrypted Text" field.</li>
	  <li>Copy the encrypted text and use it in your secure applications or communications.</li>
	</ol>
  
	<h3>Why Use AES Encryption?</h3>
	<p>
	  AES (Advanced Encryption Standard) is one of the most secure encryption standards available today. It is widely used across industries, including banking and government, to protect sensitive data. With options like AES-GCM and AES-CBC, this tool provides flexibility in choosing the best encryption mode for your needs.
	</p>
  </div>
  
  <!-- UI Structure -->
  <div class="container">
	<!-- Encoding Format Selection -->
	<div class="form-group">
	  <label for="encoding">Encoding Format</label>
	  <select id="encoding" bind:value={encodingFormat} on:change={handleEncodingChange}>
		<option value="base64">Base64</option>
		<option value="hex">Hex</option>
	  </select>
	</div>
  
	<!-- Algorithm Selection -->
	<div class="form-group">
	  <label for="algorithm">Algorithm</label>
	  <select id="algorithm" bind:value={values.algorithm} on:change={handleChangeAlgorithm}>
		<option value="AES-GCM">AES/GCM</option>
		<option value="AES-CBC">AES/CBC</option>
	  </select>
	</div>
  
	<!-- Key Input -->
	<div class="form-group">
	  <label for="key">Key ({encodingFormat})</label>
	  <input type="text" id="key" bind:value={values.key} on:input={handleOnChangeKey} />
	  <button on:click={() => handleOnClickRandomKey(128)}>Generate 128-bit Key</button>
	  <button on:click={() => handleOnClickRandomKey(256)}>Generate 256-bit Key</button>
	  <small>{values.keyFieldSize} bit, {values.key ? `${getByteLength(values.key, encodingFormat)} bytes` : '0 bytes'}</small>
	</div>
  
	<!-- IV Input -->
	<div class="form-group">
	  <label for="iv">IV ({encodingFormat})</label>
	  <input type="text" id="iv" bind:value={values.iv} on:input={handleOnChangeIV} />
	  <button on:click={handleOnClickRandomIV}>Generate IV</button>
	  <small>{values.ivFieldSize} bit, {values.iv ? `${getByteLength(values.iv, encodingFormat)} bytes` : '0 bytes'}</small>
	</div>
  
	<!-- Plain Text Input -->
	<div class="form-group">
	  <label for="plaintext">Plain Text (UTF-8)</label>
	  <textarea id="plaintext" bind:value={values.targetPlainText} on:input={handleOnChangeTargetPlainText} rows="4"></textarea>
	  <small>{values.targetPlainText ? `${values.targetPlainText.length} letters (${getByteLength(values.targetPlainText, 'utf-8')} bytes in size)` : '0 bytes'}</small>
	</div>
  
	<!-- Encrypt Button -->
	<div class="form-group">
	  <button on:click={encrypt}>ENCRYPT</button>
	</div>
  
	<!-- Encrypted Text Output -->
	<div class="form-group">
	  <label for="encryptedtext">Encrypted Text ({encodingFormat})</label>
	  <textarea id="encryptedtext" bind:value={values.outEncryptedText} rows="4" readonly></textarea>
	  <small>{values.outEncryptedText ? `${values.outEncryptedText.length} letters (${getByteLength(values.outEncryptedText, encodingFormat)} bytes in size)` : '0 bytes'}</small>
	</div>
  </div>
  
  <style>
	.container {
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
  
	input, textarea, select, button {
	  width: 100%;
	  padding: 8px;
	  margin-top: 5px;
	  border-radius: 4px;
	  border: 1px solid #ccc;
	}
  
	button {
	  width: auto;
	  padding: 8px 12px;
	  cursor: pointer;
	}
  
	small {
	  display: block;
	  margin-top: 5px;
	  color: #666;
	}
  </style>
  