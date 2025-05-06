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
		const newEncoding = target.value as 'base64' 
