<script lang="ts">
	import { Buffer } from 'buffer';
	import { getRandomBytesSync } from 'ethereum-cryptography/random';
	import { secp256k1 } from 'ethereum-cryptography/secp256k1';
	import { keccak256 } from 'ethereum-cryptography/keccak';
	import { ripemd160 } from 'ethereum-cryptography/ripemd160';
	import { sha256 } from 'ethereum-cryptography/sha256';
	import base58 from 'bs58';

	let privateKey = '';
	let publicKey = '';
	let address = '';

	let btcPrivateKey = '';
	let btcPublicKey = '';
	let btcAddress = '';

	// Function to generate Ethereum and Bitcoin keys
	function generateKeys() {
		// Generate random private key (32 bytes)
		const privKey = getRandomBytesSync(32);

		// Generate Ethereum public key from the private key
		const pubKey = secp256k1.getPublicKey(privKey);

		// Compute Ethereum address (keccak256 hash of the public key's x, y coordinates, skipping the first byte)
		const addr = keccak256(pubKey.slice(1)).slice(-20);

		// Store Ethereum private key and public key in hex format
		privateKey = '0x' + Buffer.from(privKey).toString('hex');
		publicKey = '0x' + Buffer.from(pubKey).toString('hex');

		// Convert Ethereum address to EIP-55 checksum address
		address = toChecksumAddress(Buffer.from(addr).toString('hex'));

		// Generate Bitcoin keys
		generateBitcoinKeys(privKey);
	}

	// Function to generate Bitcoin keys based on the same private key
	function generateBitcoinKeys(privKey: Uint8Array) {
		// Generate Bitcoin public key
		const pubKey = secp256k1.getPublicKey(privKey, true); // Compressed public key (33 bytes)

		// Compute Bitcoin address (RIPEMD-160 hash of SHA-256 hash of the public key)
		const hashSha256 = sha256(pubKey);
		const btcAddr = ripemd160(hashSha256);

		// Add version byte (0x00 for mainnet) at the beginning
		const versionedPayload = Buffer.concat([Buffer.from([0x00]), btcAddr]);

		// Perform checksum (first 4 bytes of SHA256(SHA256(versionedPayload)))
		const checksum = sha256(sha256(versionedPayload)).slice(0, 4);

		// Concatenate versioned payload and checksum, then encode with Base58
		const fullPayload = Buffer.concat([versionedPayload, checksum]);
		btcAddress = base58.encode(fullPayload);

		// Convert private key to WIF format
		btcPrivateKey = toWIF(privKey);
		btcPublicKey = Buffer.from(pubKey).toString('hex');
	}

	// Function to convert Ethereum address to EIP-55 checksum format
	function toChecksumAddress(address: string) {
		const addressLower = address.toLowerCase();
		const hash = Buffer.from(keccak256(Buffer.from(addressLower, 'utf-8'))).toString('hex');

		let checksumAddress = '0x';
		for (let i = 0; i < addressLower.length; i++) {
			checksumAddress += parseInt(hash[i], 16) >= 8 ? addressLower[i].toUpperCase() : addressLower[i];
		}
		return checksumAddress;
	}

	// Function to convert private key to WIF (Wallet Import Format)
	function toWIF(privKey: Uint8Array) {
		// Add version byte (0x80 for mainnet) at the beginning of the private key
		const versionedPrivKey = Buffer.concat([Buffer.from([0x80]), privKey]);

		// Add a compressed byte (0x01) at the end for compressed public keys
		const compressedPrivKey = Buffer.concat([versionedPrivKey, Buffer.from([0x01])]);

		// Perform checksum (first 4 bytes of SHA256(SHA256(versionedPrivKey)))
		const checksum = sha256(sha256(compressedPrivKey)).slice(0, 4);

		// Concatenate versioned private key and checksum, then encode with Base58
		const fullPayload = Buffer.concat([compressedPrivKey, checksum]);
		return base58.encode(fullPayload);
	}
</script>

<head>
	<title>Free Online BTC and ETH Key Generation Tool</title>
	<meta name="keywords" content="secp256k1,ethereum,bitcoin,key,generation,public,private,address" />
	<meta name="description" content="Free online tool to generate Ethereum and Bitcoin public-private key pairs and addresses" />
</head>

<!-- Key Generation Tool UI -->
<div class="container">
	<h2>Ethereum and Bitcoin Key Generation Tool</h2>
	<p>
		<strong style="color: #e74c3c">Note:</strong> All keys are generated locally in your browser. They are never sent to any remote server.
	</p>

	<!-- Generate Keys Button -->
	<div class="form-group">
		<button on:click={generateKeys}>Generate Keys (BTC, ETH)</button>
	</div>

	<!-- Private Keys (HEX & WIF) Output -->
	<div class="form-group">
		<label>Private Keys</label>
		<div>
			<strong>Ethereum Private Key (HEX):</strong>
			<input type="text" bind:value={privateKey} readonly />

			<strong>Bitcoin Private Key (WIF):</strong>
			<input type="text" bind:value={btcPrivateKey} readonly />
		</div>
	</div>

	<!-- Bitcoin Address Output -->
	<div class="form-group">
		<label for="btcAddress">Bitcoin Address</label>
		<input type="text" id="btcAddress" bind:value={btcAddress} readonly />
		{#if btcAddress}
			<a href="https://www.blockchain.com/btc/address/{btcAddress}" target="_blank" rel="noopener noreferrer">
				View Bitcoin address on Blockchain Explorer
			</a>
		{/if}
	</div>

	<!-- Ethereum Address Output -->
	<div class="form-group">
		<label for="ethAddress">Ethereum Address</label>
		<input type="text" id="ethAddress" bind:value={address} readonly />
		{#if address}
			<a href="https://etherscan.io/address/{address}" target="_blank" rel="noopener noreferrer">
				View Ethereum address on Etherscan
			</a>
		{/if}
	</div>
</div>

<div class="description">
	<h3>Outputs:</h3>
	<ol>
		<li>
			<strong>Private Keys (HEX & WIF):</strong> Ethereum Private Key in HEX format, Bitcoin Private Key in WIF format.
		</li>
		<li>
			<strong>Bitcoin Address:</strong> Derived by first taking the SHA-256 hash of the public key, followed by the RIPEMD-160 hash, and then Base58Check encoded.
		</li>
		<li>
			<strong>Ethereum Address:</strong> Derived by taking the Keccak-256 hash of the public key and using the last 20 bytes.
		</li>
	</ol>
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
		display: block;
		font-weight: bold;
		margin-bottom: 8px;
	}

	input,
	button {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
		border-radius: 4px;
		border: 1px solid #ccc;
		font-size: 1em;
	}

	input[readonly] {
		background-color: #f0f0f0;
	}

	button {
		cursor: pointer;
	}

	ol {
		padding-left: 20px;
	}

	h2,
	h3 {
		margin-bottom: 15px;
	}

	p {
		margin-bottom: 10px;
	}

	div > div {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
