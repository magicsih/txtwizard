<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import {
		COMPRESSION_ALGORITHMS,
		compressText,
		getCompressionLabel,
		type CompressionAlgorithm
	} from '$lib/utils/compression';

	let targetPlainText = '';
	let outHashText = '';
	let outHexText = '';
	let selectedAlgorithm: CompressionAlgorithm = 'gzip';
	let metrics = {
		compressionRatio: 0,
		originalSize: 0,
		outputSize: 0
	};

	const algorithms = COMPRESSION_ALGORITHMS;

	function doCompress() {
		const result = compressText(targetPlainText, selectedAlgorithm);
		outHashText = result.base64;
		outHexText = result.hex;
		metrics = result.metrics;
	}

	const pageTitle = 'TxtWizard | Free Online Compression Tool - GZIP, Deflate, ZIP';
	const pageDescription =
		'Compress plain text with GZIP, Deflate, and ZIP in the browser and get Base64, Hex, and compression ratio details.';
	const faqStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Does this tool upload my text?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'No. Compression runs in your browser, so the input stays on your device.'
				}
			},
			{
				'@type': 'Question',
				name: 'What is the difference between ZIP and ZIP (Max Compression)?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Both create ZIP output, but the max mode uses stronger compression settings and may be slower.'
				}
			},
			{
				'@type': 'Question',
				name: 'Why are both Base64 and Hex shown?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'They make binary compressed output easier to inspect, copy, and reuse in other tools.'
				}
			}
		]
	};
</script>

<SeoHead
	title={pageTitle}
	description={pageDescription}
	path="/compression"
	structuredData={faqStructuredData}
/>
<h1>{$t('compression')} {$t('tool')} - GZIP, Deflate, ZIP</h1>

<div class="container">
	<div class="form-group">
		<label for="algorithm">Select Compression Algorithm</label>
		<select id="algorithm" bind:value={selectedAlgorithm}>
			{#each algorithms as algorithm}
				<option value={algorithm}>{getCompressionLabel(algorithm)}</option>
			{/each}
		</select>
	</div>

	<div class="form-group">
		<label for="plainText">Enter Plain Text (UTF-8)</label>
		<textarea
			id="plainText"
			bind:value={targetPlainText}
			rows="4"
			placeholder="Enter your text here"
		></textarea>
		<span class="metrics">
			Size: {metrics.originalSize} bytes &gt; {metrics.outputSize} bytes, Compression Ratio: {metrics.compressionRatio}%
		</span>
		<button on:click={doCompress}>{$t('compress-button')}</button>
	</div>

	<div class="form-group">
		<label for="hashBase64">Compressed Result (Base64)</label>
		<textarea id="hashBase64" bind:value={outHashText} rows="4" readonly></textarea>
	</div>

	<div class="form-group">
		<label for="hashHex">Compressed Result (Hex)</label>
		<textarea id="hashHex" bind:value={outHexText} rows="4" readonly></textarea>
	</div>
</div>

<div class="description">
	<h3>About the Compression Tool</h3>
	<p>
		Welcome to our free online compression tool, designed to compress plain text using GZIP,
		Deflate, and ZIP. Compression reduces file sizes, making transfers more efficient and storage
		less costly. This tool provides instant results along with detailed metrics, including
		compression ratio, original size, and compressed size.
	</p>

	<h3>What is Compression?</h3>
	<p>
		Compression is the process of reducing the size of data by encoding it in a more efficient way.
		This allows you to save storage space and speed up data transfer. Our tool provides a simple and
		honest view of the formats it actually generates, with outputs available in both Base64 and Hex.
	</p>
</div>

<div class="description">
	<h3>Compression Algorithms Supported</h3>
	<ul>
		<li>
			<strong>GZIP:</strong> A widely used compression format, especially on the web, with a good balance
			between size reduction and speed.
		</li>
		<li>
			<strong>Deflate:</strong> A fast and efficient compression algorithm commonly used in ZIP, PNG, and
			HTTP payloads.
		</li>
		<li>
			<strong>ZIP:</strong> Standard ZIP archive output containing a single text file.
		</li>
		<li>
			<strong>ZIP (Max Compression):</strong> ZIP output using more aggressive compression settings for
			smaller files at the cost of speed.
		</li>
	</ul>

	<h3>How to Use the Compression Tool</h3>
	<p>Follow these steps to compress your data:</p>
	<ol>
		<li>Enter your plain text into the text box provided.</li>
		<li>Select your desired compression algorithm: GZIP, Deflate, ZIP, or ZIP (Max Compression).</li>
		<li>Click the "Compress" button to generate the compressed data.</li>
		<li>The compressed result will be displayed in Base64 and Hex formats.</li>
		<li>You will also see the compression ratio, original size, and compressed size.</li>
	</ol>

	<h3>Benefits of Data Compression</h3>
	<ul>
		<li>
			<strong>Reduced File Sizes:</strong> Smaller files are faster to upload, download, and transfer.
		</li>
		<li>
			<strong>Efficient Storage:</strong> Compression lets you store more data in less space.
		</li>
		<li>
			<strong>Improved Network Speed:</strong> Less data over the wire improves performance in low-bandwidth
			environments.
		</li>
		<li>
			<strong>Clear Output Format:</strong> The tool now labels output formats to match the actual generated
			compression type.
		</li>
	</ul>

	<h3>Frequently Asked Questions</h3>
	<dl>
		<dt>Does this tool upload my text?</dt>
		<dd>No. Compression runs in your browser, so the input stays on your device.</dd>
		<dt>What is the difference between ZIP and ZIP (Max Compression)?</dt>
		<dd>Both create ZIP output, but the max mode uses stronger compression settings and may be slower.</dd>
		<dt>Why are both Base64 and Hex shown?</dt>
		<dd>They make binary compressed output easier to inspect, copy, and reuse in other tools.</dd>
	</dl>
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

	textarea,
	select,
	button {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
		border-radius: 4px;
		border: 1px solid #ccc;
		font-size: 1em;
	}

	textarea[readonly] {
		background-color: #f0f0f0;
	}

	button {
		cursor: pointer;
	}

	.metrics {
		margin-top: 10px;
		color: #666;
	}

	ol {
		padding-left: 20px;
	}
</style>
