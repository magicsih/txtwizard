<script lang="ts">
	import { Buffer } from 'buffer';
	import { getRandomBytesSync } from 'ethereum-cryptography/random';
	import { secp256k1 } from 'ethereum-cryptography/secp256k1';
	import { keccak256 } from 'ethereum-cryptography/keccak';
	import { ripemd160 } from 'ethereum-cryptography/ripemd160';
	import { sha256 } from 'ethereum-cryptography/sha256';
	import base58 from 'bs58';
	import { t } from 'svelte-i18n';

	let privateKey = '';
	let privateKeyNumeric = ''; // 새로 추가된 numeric 형식의 private key
	let publicKey = '';
	let address = '';

	let btcPrivateKey = '';
	let btcPublicKey = '';
	let btcAddress = '';

	// Function to generate Ethereum and Bitcoin keys
	function generateKeys() {
		// Generate random private key (32 bytes)
		const privKey = getRandomBytesSync(32);

		// Store numeric private key as decimal
		privateKeyNumeric = BigInt('0x' + Buffer.from(privKey).toString('hex')).toString();

		// Update keys and addresses
		updateKeysFromPrivateKey(privKey);
	}

	// Function 
