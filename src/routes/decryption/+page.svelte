<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Buffer } from 'buffer';

	let values = {
		algorithm: 'AES-GCM',
		key: '',
		iv: '',
		targetEncryptedText: '',
		outDecryptedText: ''
	};

	let encodingFormat: 'base64' | 'hex' = 'base64'; // Default encoding format
	let previousEncodingFormat: 'base64' | 'hex' = 'base64'; // Track previous encoding format for conversion

	let cryptoKey: CryptoKey | null = null;

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
			if (values.targetEncryptedText)
				values.targetEncryptedText = convertEncoding(
					values.targetEncryptedText,
					previousEncodingFormat,
					newEncoding
				);

			previousEncodingFormat = newEncoding; // Set new format as the current format
			encodingFormat = newEncoding; // Update the current encoding format
		} catch (error) {
			// In case of an error during conversion, we reset to previous format
			encodingFormat = previousEncodingFormat;
			console.error('Error during encoding conversion:', error);
			return;
		}
	}

	function handleChangeAlgorithm(event: Event) {
		const target = event.target as HTMLSelectElement;
		values.algorithm = target.value;
	}

	async function handleOnChangeKey(event: Event) {
		const target = event.target as HTMLInputElement | null;
		if (!target) return; // Handle null case
		values.key = target.value;

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
		const target = event.target as HTMLInputElement | null;
		if (!target) return; // Handle null case
		values.iv = target.value;
	}

	function handleOnChangeTargetEncryptedText(event: Event) {
		const target = event.target as HTMLTextAreaElement | null;
		if (!target) return; // Handle null case
		values.targetEncryptedText = target.value;
	}

	async function decrypt() {
		try {
			if (!cryptoKey) {
				alert('Invalid key');
				return;
			}

			const ivBuffer = Buffer.from(values.iv, encodingFormat);
			const encryptedBuffer = Buffer.from(values.targetEncryptedText, encodingFormat);

			const decrypted = await window.crypto.subtle.decrypt(
				{ name: values.algorithm, iv: ivBuffer },
				cryptoKey,
				encryptedBuffer
			);

			values.outDecryptedText = Buffer.from(new Uint8Array(decrypted)).toString('utf-8');
		} catch (error) {
			console.error('Error during decryption:', error);
		}
	}

	// Function to get byte length of a string in the current encoding
	function getByteLength(value: string, encoding: 'base64' | 'hex' | 'utf-8') {
		return Buffer.from(value, encoding).length;
	}
</script>

<head>
	<title>TxtWizard | Free Online Text Decrypting Tool - AES/GCM, AES/CBC</title>
</head>

<h2>{$t('decryption')} {$t('tool')} - AES/GCM, AES/CBC</h2>

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
		<small>{values.key ? `${getByteLength(values.key, encodingFormat)} bytes` : '0 bytes'}</small>
	</div>

	<!-- IV Input -->
	<div class="form-group">
		<label for="iv">IV ({encodingFormat})</label>
		<input type="text" id="iv" bind:value={values.iv} on:input={handleOnChangeIV} />
		<small>{values.iv ? `${getByteLength(values.iv, encodingFormat)} bytes` : '0 bytes'}</small>
	</div>

	<!-- Encrypted Text Input -->
	<div class="form-group">
		<label for="encryptedtext">Encrypted Text ({encodingFormat})</label>
		<textarea
			id="encryptedtext"
			bind:value={values.targetEncryptedText}
			on:input={handleOnChangeTargetEncryptedText}
			rows="4"
		></textarea>
		<small
			>{values.targetEncryptedText
				? `${values.targetEncryptedText.length} letters (${getByteLength(values.targetEncryptedText, encodingFormat)} bytes in size)`
				: '0 bytes'}</small
		>
	</div>

	<!-- Decrypt Button -->
	<div class="form-group">
		<button on:click={decrypt}>{$t('decrypt-button')}</button>
	</div>

	<!-- Decrypted Text Output -->
	<div class="form-group">
		<label for="decryptedtext">Decrypted Text (UTF-8)</label>
		<textarea id="decryptedtext" bind:value={values.outDecryptedText} rows="4" readonly></textarea>
		<small
			>{values.outDecryptedText
				? `${values.outDecryptedText.length} letters (${getByteLength(values.outDecryptedText, 'utf-8')} bytes in size)`
				: '0 bytes'}</small
		>
	</div>
</div>

<div class="description">
	<h3>What is Decryption?</h3>
	<p>
		Decryption is the process of converting encrypted or encoded data back into its original form so
		it can be understood. Using cryptographic keys, decryption tools ensure that only authorized
		users can access the original message. This decryption tool allows you to decrypt AES-encrypted
		data back into plain text using AES-GCM or AES-CBC algorithms.
	</p>

	<h3>How to Use the Decryption Tool</h3>
	<ol>
		<li>
			Select the appropriate decryption algorithm (AES-GCM or AES-CBC) that matches the encryption
			method used.
		</li>
		<li>
			Enter the key and initialization vector (IV) that were used during encryption in the
			respective fields.
		</li>
		<li>Paste the encrypted text into the "Encrypted Text" box.</li>
		<li>
			Click the "DECRYPT" button to reveal the original plain text in the "Decrypted Text" field.
		</li>
	</ol>

	<h3>Why Use AES Decryption?</h3>
	<p>
		Decryption ensures that encrypted data is accessible only to authorized individuals who possess
		the correct key and IV. AES decryption is widely trusted in industries like finance, healthcare,
		and government to securely decode sensitive information. This tool allows you to quickly decrypt
		AES-encrypted messages back to their original form.
	</p>
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

	input,
	textarea,
	select,
	button {
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
