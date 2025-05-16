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
	import { trackToolsUsageEvent } from '$lib/utils/analytics';

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
		} finally {
			trackToolsUsageEvent('hashing', 'hash', {
				algorithm: algorithm,
				text_length: targetPlainText.length, // 원문 대신 길이만 전송
				non_empty: targetPlainText.length > 0 ? 1 : 0 // 빈 문자열 여부 추적
			});
		}
	}

	// 복사 버튼 추가 및 이벤트 추적
	function copyToClipboard(text: string, format: string) {
		navigator.clipboard.writeText(text);
		trackToolsUsageEvent('hashing', 'copy', {
			algorithm: algorithm,
			text_length: targetPlainText.length, // 원문 대신 길이만 전송
			non_empty: targetPlainText.length > 0 ? 1 : 0, // 빈 문자열 여부 추적
			format: format // 복사한 형식 (base64 또는 hex)
		});
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
		content="online hash converter, sha1, sha256, sha384, sha512, sha3, keccak, ripemd160, blake3, blake2b, hash generator, free hash tool, cryptographic hash, secure hash algorithm, hash calculator"
	/>
	<meta
		name="description"
		content="Free online hash generator tool. Convert text to SHA-1, SHA-256, SHA-384, SHA-512, SHA3, Keccak, RIPEMD160, BLAKE2, and BLAKE3 hash formats instantly for security verification, checksums, and data integrity."
	/>
</head>

<header>
	<h1>{$t('hashing')} {$t('tool')}</h1>
</header>

<main>
	<section class="container" aria-label="Hash Generator Tool">
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
			<div class="output-container">
				<textarea id="hashBase64" bind:value={outHashText} rows="4" readonly></textarea>
				<button class="copy-btn" on:click={() => copyToClipboard(outHashText, 'base64')}>
					Copy
				</button>
			</div>
			<small>{base64Bytes} bytes</small>
		</div>

		<!-- Hex Output -->
		<div class="form-group">
			<label for="hashHex">Hash (Hex)</label>
			<div class="output-container">
				<textarea id="hashHex" bind:value={outHexText} rows="4" readonly></textarea>
				<button class="copy-btn" on:click={() => copyToClipboard(outHexText, 'hex')}> Copy </button>
			</div>
			<small>{hexBytes} bytes</small>
		</div>
	</section>
	<section class="description" aria-label="Information about Hashing">
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

		<h3>How to Use This Hashing Tool</h3>
		<ol>
			<li>Select your preferred hashing algorithm from the dropdown menu</li>
			<li>Enter the text you want to hash in the input field</li>
			<li>Click the "Hash" button to generate the hash values</li>
			<li>View the results in both Base64 and Hexadecimal formats</li>
		</ol>

		<h3>Applications of Cryptographic Hashing</h3>
		<p>Cryptographic hashing serves many important purposes in modern computing:</p>
		<ul>
			<li><strong>Data Integrity:</strong> Ensure files or messages haven't been tampered with</li>
			<li><strong>Password Storage:</strong> Secure storage of user credentials in databases</li>
			<li><strong>Digital Signatures:</strong> Authentication of digital documents and messages</li>
			<li>
				<strong>Blockchain Technology:</strong> Creating transaction IDs and maintaining chain integrity
			</li>
			<li>
				<strong>File Identification:</strong> Generating unique fingerprints for file verification
			</li>
		</ul>

		<h3>Security Considerations</h3>
		<p>When choosing a hash algorithm, consider these important factors:</p>
		<ul>
			<li>
				SHA-1 and MD5 are considered cryptographically broken and should be avoided for security
				applications
			</li>
			<li>SHA-256 and above provide strong security for most modern applications</li>
			<li>For maximum security in sensitive applications, consider SHA-512 or SHA-3 variants</li>
			<li>BLAKE2 and BLAKE3 offer excellent performance for high-speed applications</li>
		</ul>
	</section>
</main>

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
