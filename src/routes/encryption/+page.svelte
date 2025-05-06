<script lang="ts">
	import { t } from 'svelte-i18n';
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
		const target = event.target as HTMLInputElement | null;
		if (!target) return; // Handle null case
		values.key = target.value;
		val
