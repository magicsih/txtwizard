<script lang="ts">
	import { Buffer } from 'buffer'; // Buffer for handling base64 and hex output
	import * as fflate from 'fflate';
	import { t } from 'svelte-i18n';

	let targetPlainText = '';
	let outHashText = '';
	let outHexText = '';
	let selectedAlgorithm = 'gzip'; // Default to gzip
	let metrics = {
		compressionRatio: 0,
		originalSize: 0,
		outputSize: 0
	};

	// Available compression algorithms
	const algorithms = ['gzip', 'deflate', 'zip-bzip2', 'zip-lzma'];

	// Compression options
	const deflateOptions = {
		level: 6 as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, // Compression level (default: 6)
		mem: 8 as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 // Memory level
	};

	// Compress the input text based on the selected algorithm
	function doCompress() {
		// Convert plain text to Uint8Array
		const buf = fflate.strToU8(targetPlainText);

		let compressed: Uint8Array | undefined;

		// Compress using the selected algorithm
		if (selectedAlgorithm === 'gzip') {
			com