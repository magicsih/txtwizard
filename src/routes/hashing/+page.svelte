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

	type Algorithm = typeof algorithms[number]; // Create a union type from the array
	
	let targetPlainText = '';
	let outHashText = ''
