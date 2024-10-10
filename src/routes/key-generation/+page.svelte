<script lang="ts">
	import { Buffer } from 'buffer';
	import { getRandomBytesSync } from 'ethereum-cryptography/random';
	import { secp256k1 } from 'ethereum-cryptography/secp256k1';
	import { keccak256 } from 'ethereum-cryptography/keccak';

	let privateKey = '';
	let publicKey = '';
	let address = '';

	// Function to generate the Ethereum keys
	function generateKeys() {
		// Generate a random private key (32 bytes)
		const privKey = getRandomBytesSync(32);

		// Generate the public key from the private key
		const pubKey = secp256k1.getPublicKey(privKey);

		// Compute the Ethereum address (keccak256 hash of the public key's x, y coordinates, skipping the first byte)
		const addr = keccak256(pubKey.slice(1)).slice(-20);

		// Store the private key and public key in hex format
		privateKey = '0x' + Buffer.from(privKey).toString('hex');
		publicKey = '0x' + Buffer.from(pubKey).toString('hex');

		// Convert the address to an EIP-55 checksum address
		address = toChecksumAddress(Buffer.from(addr).toString('hex'));
	}

	// Function to convert an address to EIP-55 checksum format
	function toChecksumAddress(address: string) {
		// Convert to lowercase
		const addressLower = address.toLowerCase();

		// Take the Keccak-256 hash of the lowercase address
		const hash = Buffer.from(keccak256(Buffer.from(addressLower, 'utf-8'))).toString('hex');

		// Iterate over each character and convert to uppercase if necessary
		let checksumAddress = '0x';
		for (let i = 0; i < addressLower.length; i++) {
			checksumAddress +=
				parseInt(hash[i], 16) >= 8 ? addressLower[i].toUpperCase() : addressLower[i];
		}
		return checksumAddress;
	}
</script>

<head>
	<title>Free Online Ethereum Key Generation Tool</title>
	<meta
		name="keywords"
		content="kekac256,secp256k1,ethereum,key,generation,public,private,address"
	/>
	<meta
		name="description"
		content="Free online tool to generate Ethereum public-private key pairs and addresses"
	/>
</head>

<div class="description">
	<h2>How Ethereum Key Generation Works</h2>
	<p>
		Ethereum uses a cryptographic process to generate a public-private key pair. A private key is
		randomly generated, and from it, a public key is derived using the elliptic curve algorithm
		secp256k1. The Ethereum address is then derived by taking the Keccak-256 hash of the public
		key's x and y coordinates (excluding the first byte), and using the last 20 bytes of the hash as
		the address.
	</p>
</div>

<!-- Ethereum Key Generation Tool UI -->
<div class="container">
	<h2>Ethereum Key Generation Tool</h2>
	<p>
		<strong style="color: #e74c3c">Note:</strong> All keys are generated locally in your browser. They
		are never sent to any remote server.
	</p>

	<!-- Generate Key Button -->
	<div class="form-group">
		<button on:click={generateKeys}>Generate Ethereum Keys</button>
	</div>

	<!-- Address Output -->
	<div class="form-group">
		<label for="address">Ethereum Address</label>
		<input type="text" id="address" bind:value={address} readonly />
		{#if address}
			<a href="https://etherscan.io/address/{address}" target="_blank" rel="noopener noreferrer">
				View address on Etherscan
			</a>
		{/if}
	</div>

	<!-- Private Key Output -->
	<div class="form-group">
		<label for="privateKey">Private Key</label>
		<input type="text" id="privateKey" bind:value={privateKey} readonly />
	</div>

	<!-- Public Key Output -->
	<div class="form-group">
		<label for="publicKey">Public Key</label>
		<input type="text" id="publicKey" bind:value={publicKey} readonly />
	</div>
</div>

<div class="description">
	<h3>Outputs:</h3>
	<ol>
		<li>
			<strong>Ethereum Address:</strong> The Ethereum address is derived by taking the Keccak-256 hash
			of the public key (excluding the first byte) and using the last 20 bytes (40 hex characters) as
			the Ethereum address. The address is then formatted using EIP-55 checksum to ensure that it is
			a valid and secure Ethereum address.
		</li>
		<li>
			<strong>Private Key:</strong> A private key is randomly generated, which is a 32-byte (64 hex characters)
			string.
		</li>
		<li>
			<strong>Public Key:</strong> The public key is derived from the private key using the secp256k1
			elliptic curve algorithm. The public key is 65 bytes (130 hex characters).
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
</style>
