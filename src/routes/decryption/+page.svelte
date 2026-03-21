<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import {
		convertEncoding,
		decryptText,
		getByteLength,
		importAesKey,
		type AesAlgorithm,
		type BinaryEncoding
	} from '$lib/utils/crypto';

	let values = {
		algorithm: 'AES-GCM' as AesAlgorithm,
		key: '',
		iv: '',
		targetEncryptedText: '',
		outDecryptedText: ''
	};

	let encodingFormat: BinaryEncoding = 'base64';
	let previousEncodingFormat: BinaryEncoding = 'base64';
	let cryptoKey: CryptoKey | null = null;

	function handleEncodingChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newEncoding = target.value as BinaryEncoding;

		try {
			if (values.key) values.key = convertEncoding(values.key, previousEncodingFormat, newEncoding);
			if (values.iv) values.iv = convertEncoding(values.iv, previousEncodingFormat, newEncoding);
			if (values.targetEncryptedText) {
				values.targetEncryptedText = convertEncoding(
					values.targetEncryptedText,
					previousEncodingFormat,
					newEncoding
				);
			}

			previousEncodingFormat = newEncoding;
			encodingFormat = newEncoding;
		} catch (error) {
			encodingFormat = previousEncodingFormat;
			console.error('Error during encoding conversion:', error);
		}
	}

	function handleChangeAlgorithm(event: Event) {
		const target = event.target as HTMLSelectElement;
		values.algorithm = target.value as AesAlgorithm;
	}

	async function handleOnChangeKey(event: Event) {
		const target = event.target as HTMLInputElement | null;
		if (!target) return;
		values.key = target.value;
		cryptoKey = await importAesKey(values.key, values.algorithm, encodingFormat);
	}

	function handleOnChangeIV(event: Event) {
		const target = event.target as HTMLInputElement | null;
		if (!target) return;
		values.iv = target.value;
	}

	function handleOnChangeTargetEncryptedText(event: Event) {
		const target = event.target as HTMLTextAreaElement | null;
		if (!target) return;
		values.targetEncryptedText = target.value;
	}

	async function decrypt() {
		try {
			if (!cryptoKey) {
				alert('Invalid key');
				return;
			}

			values.outDecryptedText = await decryptText({
				algorithm: values.algorithm,
				encoding: encodingFormat,
				key: cryptoKey,
				iv: values.iv,
				encryptedText: values.targetEncryptedText
			});
		} catch (error) {
			console.error('Error during decryption:', error);
		} finally {
			trackToolsUsageEvent('decryption', 'decrypt', {
				algorithm: values.algorithm,
				encoding: encodingFormat,
				key_length: values.key.length,
				iv_length: values.iv.length,
				encrypted_text_length: values.targetEncryptedText.length,
				decrypted_text_length: values.outDecryptedText.length,
				non_empty: values.targetEncryptedText.length > 0 ? 1 : 0
			});
		}
	}

	const pageTitle = 'TxtWizard | Free Online Text Decryption Tool - AES/GCM, AES/CBC';
	const pageDescription =
		'Decrypt AES-GCM and AES-CBC ciphertext in your browser using Base64 or Hex encoded keys, IVs, and encrypted text.';
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
				name: 'Do I need the same encoding used during encryption?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. The key, IV, and ciphertext encoding must match the original Base64 or Hex format.'
				}
			},
			{
				'@type': 'Question',
				name: 'Is the decrypted text sent anywhere?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'No. Decryption runs locally in the browser.'
				}
			}
		]
	};
</script>

<SeoHead
	title={pageTitle}
	description={pageDescription}
	path="/decryption"
	structuredData={faqStructuredData}
/>

<h1>{$t('decryption')} {$t('tool')} - AES/GCM, AES/CBC</h1>

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
		<small>{values.key ? `${getByteLength(values.key, encodingFormat)} bytes` : '0 bytes'}</small>
	</div>

	<div class="form-group">
		<label for="iv">IV ({encodingFormat})</label>
		<input type="text" id="iv" bind:value={values.iv} on:input={handleOnChangeIV} />
		<small>{values.iv ? `${getByteLength(values.iv, encodingFormat)} bytes` : '0 bytes'}</small>
	</div>

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

	<div class="form-group">
		<button on:click={decrypt}>{$t('decrypt-button')}</button>
	</div>

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

	<h3>Frequently Asked Questions</h3>
	<dl>
		<dt>Which AES modes are supported?</dt>
		<dd>This page supports AES-GCM and AES-CBC.</dd>
		<dt>Do I need the same encoding used during encryption?</dt>
		<dd>Yes. The key, IV, and ciphertext encoding must match the original Base64 or Hex format.</dd>
		<dt>Is the decrypted text sent anywhere?</dt>
		<dd>No. Decryption runs locally in the browser.</dd>
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
