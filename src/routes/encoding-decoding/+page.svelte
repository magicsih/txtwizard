<script lang="ts">
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { Buffer } from 'buffer'; // Import Buffer for encoding/decoding

	// Define the reactive values for user input and the auto-converted formats
	let userInput = '';
	let plainText = '';
	let base64 = '';
	let hex = '';
	let urlEncode = '';
	let htmlEncode = '';
	let detectedEncoding = 'Plain Text'; // Default detected encoding type
	let decodedBuffer: Buffer; // Buffer to hold the decoded content

	// Byte lengths and letter counts
	let plainTextLength = 0;
	let plainTextBytes = 0;
	let base64Length = 0;
	let base64Bytes = 0;
	let hexLength = 0;
	let hexBytes = 0;
	let urlEncodeLength = 0;
	let urlEncodeBytes = 0;
	let htmlEncodeLength = 0;
	let htmlEncodeBytes = 0;

	// Function to calculate rows dynamically based on length
	function calculateRows(textLength: number): number {
		const minRows = 2;
		const maxRows = 10;
		// 50 characters per row approximation, adjust as needed
		const rows = 
