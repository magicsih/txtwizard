<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import {
		AES_ALGORITHM_CONFIG,
		convertEncoding,
		encryptText,
		generateRandomBytes,
		getBitLength,
		getByteLength,
		importAesKey,
		type AesAlgorithm,
		type BinaryEncoding
	} from '$lib/utils/crypto';

	let values = {
		algorithm: 'AES-GCM' as AesAlgorithm,
		key: '',
		iv: '',
		keyFieldSize: 0,
		ivFieldSize: 0,
		targetPlainText: '',
		outEncryptedText: ''
	};

	let encodingFormat: BinaryEncoding = 'base64';
	let previousEncodingFormat: BinaryEncoding = 'base64';
	let cryptoKey: CryptoKey | null = null;

	function handleChangeAlgorithm(event: Event) {
		const target = event.target as HTMLSelectElement;
		values.algorithm = target.value as AesAlgorithm;
	}

	async function handleOnChangeKey(event: Event) {
		const target = event.target as HTMLInputElement | null;
		if (!target) return;
		values.key = target.value;
		values.keyFieldSize = values.key ? getBitLength(values.key, encodingFormat) : 0;
		if (!values.key) {
			cryptoKey = null;
			return;
		}
		try {
			cryptoKey = await importAesKey(values.key, values.algorithm, encodingFormat);
		} catch {
			cryptoKey = null;
		}
	}

	function handleOnChangeIV(event: Event) {
		const target = event.target as HTMLInputElement | null;
		if (!target) return;
		values.iv = target.value;
		values.ivFieldSize = values.iv ? getBitLength(values.iv, encodingFormat) : 0;
	}

	function handleOnChangeTargetPlainText(event: Event) {
		const target = event.target as HTMLTextAreaElement | null;
		if (!target) return;
		values.targetPlainText = target.value;
	}

	async function handleOnClickRandomKey(bitSize: number) {
		const config = AES_ALGORITHM_CONFIG[values.algorithm];
		const randomBuffer = generateRandomBytes(config.keySizes[bitSize === 128 ? 0 : 1]);
		values.key = randomBuffer.toString(encodingFormat);
		values.keyFieldSize = randomBuffer.length * 8;
		cryptoKey = await importAesKey(values.key, values.algorithm, encodingFormat);
	}

	function handleOnClickRandomIV() {
		const randomBuffer = generateRandomBytes(AES_ALGORITHM_CONFIG[values.algorithm].ivSize);
		values.iv = randomBuffer.toString(encodingFormat);
		values.ivFieldSize = randomBuffer.length * 8;
	}

	async function encrypt() {
		try {
			if (!cryptoKey) {
				alert('Invalid key');
				return;
			}

			values.outEncryptedText = await encryptText({
				algorithm: values.algorithm,
				encoding: encodingFormat,
				key: cryptoKey,
				iv: values.iv,
				plainText: values.targetPlainText
			});
		} catch (error) {
			console.error('Error during encryption:', error);
		} finally {
			trackToolsUsageEvent('encryption', 'encrypt', {
				algorithm: values.algorithm,
				encoding: encodingFormat,
				key_length: values.key.length,
				iv_length: values.iv.length,
				plain_text_length: values.targetPlainText.length,
				encrypted_text_length: values.outEncryptedText.length,
				non_empty: values.targetPlainText.length > 0 ? 1 : 0
			});
		}
	}

	function handleEncodingChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newEncoding = target.value as BinaryEncoding;

		try {
			if (values.key) values.key = convertEncoding(values.key, previousEncodingFormat, newEncoding);
			if (values.iv) values.iv = convertEncoding(values.iv, previousEncodingFormat, newEncoding);
			if (values.outEncryptedText) {
				values.outEncryptedText = convertEncoding(
					values.outEncryptedText,
					previousEncodingFormat,
					newEncoding
				);
			}

			values.keyFieldSize = values.key ? getBitLength(values.key, newEncoding) : 0;
			values.ivFieldSize = values.iv ? getBitLength(values.iv, newEncoding) : 0;
			previousEncodingFormat = newEncoding;
			encodingFormat = newEncoding;
		} catch (error) {
			encodingFormat = previousEncodingFormat;
			console.error('Error during encoding conversion:', error);
		}
	}

	const pageTitle = 'TxtWizard | Free Online Text Encryption Tool - AES/GCM, AES/CBC';
	const pageDescription =
		'Encrypt text with AES-GCM or AES-CBC in the browser and work with Base64 or Hex encoded keys, IVs, and ciphertext.';
	const faqStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Which AES modes are supported?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'This page supports AES-GCM and AES-CBC.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I generate a random key and IV here?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. You can generate random AES keys and IVs directly in the browser.'
				}
			},
			{
				'@type': 'Question',
				name: 'Is the plaintext uploaded anywhere?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'No. Encryption runs locally in the browser.'
				}
			}
		]
	};
</script>

<SeoHead
	title={pageTitle}
	description={pageDescription}
	path="/encryption"
	structuredData={faqStructuredData}
/>

<h1>{$t('encryption')} {$t('tool')} - AES/GCM, AES/CBC</h1>
<div class="container">
	<div class="form-group">
		<label for="encoding">Encoding Format</label>
		<select id="encoding" bind:value={encodingFormat} on:change={handleEncodingChange}>
			<option value="base64">Base64</option>
			<option value="hex">Hex</option>
		</select>
	</div>

	<div class="form-group">
		<label for="algorithm">Algorithm</label>
		<select id="algorithm" bind:value={values.algorithm} on:change={handleChangeAlgorithm}>
			<option value="AES-GCM">AES/GCM</option>
			<option value="AES-CBC">AES/CBC</option>
		</select>
	</div>

	<div class="form-group">
		<label for="key">Key ({encodingFormat})</label>
		<input type="text" id="key" bind:value={values.key} on:input={handleOnChangeKey} />
		<button on:click={() => handleOnClickRandomKey(128)}>{$t('generate')} (128-bit Key)</button>
		<button on:click={() => handleOnClickRandomKey(256)}>{$t('generate')} (256-bit Key)</button>
		<small
			>{values.keyFieldSize} bit, {values.key
				? `${getByteLength(values.key, encodingFormat)} bytes`
				: '0 bytes'}</small
		>
	</div>

	<div class="form-group">
		<label for="iv">IV ({encodingFormat})</label>
		<input type="text" id="iv" bind:value={values.iv} on:input={handleOnChangeIV} />
		<button on:click={handleOnClickRandomIV}>{$t('generate')} (IV)</button>
		<small
			>{values.ivFieldSize} bit, {values.iv
				? `${getByteLength(values.iv, encodingFormat)} bytes`
				: '0 bytes'}</small
		>
	</div>

	<div class="form-group">
		<label for="plaintext">Plain Text (UTF-8)</label>
		<textarea
			id="plaintext"
			bind:value={values.targetPlainText}
			on:input={handleOnChangeTargetPlainText}
			rows="4"
		></textarea>
		<small
			>{values.targetPlainText
				? `${values.targetPlainText.length} letters (${getByteLength(values.targetPlainText, 'utf-8')} bytes in size)`
				: '0 bytes'}</small
		>
	</div>

	<div class="form-group">
		<button on:click={encrypt}>{$t('encrypt-button')}</button>
	</div>

	<div class="form-group">
		<label for="encryptedtext">Encrypted Text ({encodingFormat})</label>
		<textarea id="encryptedtext" bind:value={values.outEncryptedText} rows="4" readonly></textarea>
		<small
			>{values.outEncryptedText
				? `${values.outEncryptedText.length} letters (${getByteLength(values.outEncryptedText, encodingFormat)} bytes in size)`
				: '0 bytes'}</small
		>
	</div>
</div>

<div class="description">
	<h3>What is Encryption?</h3>
	<p>
		Encryption is a process of converting plain text into a coded format that can only be deciphered
		by authorized parties. It ensures the confidentiality and security of your data by using
		cryptographic algorithms such as AES-GCM and AES-CBC. This tool allows you to easily encrypt
		sensitive information using various encryption methods, ensuring that your data remains secure.
	</p>

	<h3>How to Use the Encryption Tool</h3>
	<ol>
		<li>Select an encryption algorithm (AES-GCM or AES-CBC) from the dropdown menu.</li>
		<li>Enter or generate a random key and initialization vector (IV) in the provided fields.</li>
		<li>Input the plain text (message) you want to encrypt in the "Plain Text" box.</li>
		<li>
			Click the "ENCRYPT" button to get the encrypted output, which will be displayed in the
			"Encrypted Text" field.
		</li>
		<li>Copy the encrypted text and use it in your secure applications or communications.</li>
	</ol>

	<h3>Why Use AES Encryption?</h3>
	<p>
		AES (Advanced Encryption Standard) is one of the most secure encryption standards available
		today. It is widely used across industries, including banking and government, to protect
		sensitive data. With options like AES-GCM and AES-CBC, this tool provides flexibility in
		choosing the best encryption mode for your needs.
	</p>

	<h3>Frequently Asked Questions</h3>
	<dl>
		<dt>Which AES modes are supported?</dt>
		<dd>This page supports AES-GCM and AES-CBC.</dd>
		<dt>Can I generate a random key and IV here?</dt>
		<dd>Yes. You can generate random AES keys and IVs directly in the browser.</dd>
		<dt>Is the plaintext uploaded anywhere?</dt>
		<dd>No. Encryption runs locally in the browser.</dd>
	</dl>
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
