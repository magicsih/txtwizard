<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Buffer } from 'buffer';
	import { sha256, sha384, sha512, sha224, sha512_256 } from '@noble/hashes/sha2';
	// prettier-ignore
	import {
		sha3_224, sha3_256, sha3_384, sha3_512,
		keccak_224, keccak_256, keccak_384, keccak_512,
	} from '@noble/hashes/sha3';

	import { ripemd160 } from '@noble/hashes/ripemd160';
	import { blake3 } from '@noble/hashes/blake3';
	import { blake2b } from '@noble/hashes/blake2b';
	import { blake2s } from '@noble/hashes/blake2s';
	import { sha1 } from '@noble/hashes/sha1'; // legacy

	const algorithms = [
		'SHA-1',
		'SHA-224',
		'SHA-256',
		'SHA-384',
		'SHA-512',
		'SHA-512/256',
		'SHA3-224',
		'SHA3-256',
		'SHA3-384',
		'SHA3-512',
		'Keccak-224',
		'Keccak-256',
		'Keccak-384',
		'Keccak-512',
		'RIPEMD160',
		'BLAKE2s',
		'BLAKE2b',
		'BLAKE3'
	] as const;

	type Algorithm = (typeof algorithms)[number]; // Create a union type from the array

	let targetPlainText = '';
	let outHashText = '';
	let outHexText = '';
	let algorithm: Algorithm = 'SHA-256'; // Restrict `algorithm` to valid keys

	// Variables to store length and size of hash outputs and plain text
	let plainTextLength = 0;
	let plainTextBytes = 0;
	let base64Bytes = 0;
	let hexBytes = 0;

	// Mapping algorithm names to their hash functions
	const hashFunctions = {
		'SHA-1': sha1,
		'SHA-224': sha224,
		'SHA-256': sha256,
		'SHA-384': sha384,
		'SHA-512': sha512,
		'SHA-512/256': sha512_256,
		'SHA3-224': sha3_224,
		'SHA3-256': sha3_256,
		'SHA3-384': sha3_384,
		'SHA3-512': sha3_512,
		'Keccak-224': keccak_224,
		'Keccak-256': keccak_256,
		'Keccak-384': keccak_384,
		'Keccak-512': keccak_512,
		RIPEMD160: ripemd160,
		BLAKE2s: blake2s,
		BLAKE2b: blake2b,
		BLAKE3: blake3
	};

	async function doHash() {
		try {
			// Select the hashing function based on the selected algorithm
			const hashFunction = hashFunctions[algorithm];

			// Get the buffer from the plain text
			const msg = Buffer.from(targetPlainText, 'utf-8');

			// Hash the message using the selected algorithm
			const digest = hashFunction(msg);

			// Set Base64 and Hex values
			outHashText = Buffer.from(digest).toString('base64');
			outHexText = Buffer.from(digest).toString('hex');

			// Calculate byte size for Base64 and Hex results
			base64Bytes = Buffer.byteLength(outHashText, 'utf-8');
			hexBytes = Buffer.byteLength(outHexText, 'utf-8');
		} catch (error) {
			console.error('Error hashing text:', error);
		}
	}

	// Update plain text length and size dynamically
	$: {
		plainTextLength = targetPlainText.length;
		plainTextBytes = Buffer.byteLength(targetPlainText, 'utf-8');
	}
</script>

<head>
	<title
		>TxtWizard | Free Online Hash Converter - SHA-1, SHA-256, SHA-516, SHA3, KEKCAK 256/512, BLAKE2b</title
	>
	<meta
		name="keywords"
		content="online,sha1,sha256,sha-384,sha-512,sha3-224,sha3-256,sha3-384,sha3-512,keccak,ripemd160,blake3,blake2b,hash,converter"
	/>
	<meta
		name="description"
		content="Hash Converter, free online tool to create a hash from a string"
	/>
</head>

<h2>{$t('hashing')} {$t('tool')}</h2>

<!-- Hashing Tool UI -->
<div class="container">
	<!-- Algorithm Selection -->
	<div class="form-group">
		<label for="algorithm">Select Hashing Algorithm</label>
		<select id="algorithm" bind:value={algorithm}>
			{#each algorithms as algo}
				<option value={algo}>{algo}</option>
			{/each}
		</select>
	</div>

	<!-- Plain Text Input -->
	<div class="form-group">
		<label for="plainText">Enter Plain Text (UTF-8)</label>
		<textarea id="plainText" bind:value={targetPlainText} rows="4" placeholder="Enter text here"
		></textarea>
		<small>{plainTextLength} letters ({plainTextBytes} bytes in size)</small>
	</div>

	<!-- Hash Button -->
	<div class="form-group">
		<button on:click={doHash}>{$t('hash-button')}</button>
	</div>

	<!-- Base64 Output -->
	<div class="form-group">
		<label for="hashBase64">Hash (Base64)</label>
		<textarea id="hashBase64" bind:value={outHashText} rows="4" readonly></textarea>
		<small>{base64Bytes} bytes</small>
	</div>

	<!-- Hex Output -->
	<div class="form-group">
		<label for="hashHex">Hash (Hex)</label>
		<textarea id="hashHex" bind:value={outHexText} rows="4" readonly></textarea>
		<small>{hexBytes} bytes</small>
	</div>
</div>
<div class="description">
	<h2>What is Hashing?</h2>
	<p>
		Hashing is a one-way function that converts a string of arbitrary length into a fixed-length
		value. It is commonly used for verifying data integrity, generating unique fingerprints for
		files, and in applications such as digital signatures, certificates, and blockchain.
	</p>
	<h3>Common Hashing Algorithms</h3>
	<ul>
		<li><strong>SHA-1:</strong> Commonly used in legacy applications, but less secure today.</li>
		<li>
			<strong>SHA-256:</strong> A standard used in blockchain technology and security applications.
		</li>
		<li><strong>SHA-512:</strong> Provides longer hash outputs for greater security.</li>
		<li><strong>SHA-3:</strong> The latest member of the Secure Hash Algorithm family.</li>
		<li><strong>Keccak:</strong> The algorithm used in Ethereum addresses and transactions.</li>
		<li><strong>RIPEMD-160:</strong> Used in Bitcoin addresses.</li>
		<li><strong>BLAKE3:</strong> A modern, high-performance hash function.</li>
	</ul>
</div>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 8px;
	}

	textarea,
	select,
	button {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		cursor: pointer;
	}

	textarea[readonly] {
		background-color: #f0f0f0;
	}

	small {
		display: block;
		color: #666;
		margin-top: 5px;
	}

	ul {
		padding-left: 20px;
	}

	h2,
	h3 {
		margin-bottom: 15px;
	}

	p {
		margin-bottom: 10px;
	}
</style>
