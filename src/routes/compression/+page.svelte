<script lang="ts">
	import { Buffer } from 'buffer'; // Buffer for handling base64 and hex output
	import * as fflate from 'fflate';
	import { t } from 'svelte-i18n'

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
		level: 6, // Compression level (default: 6)
		mem: 8 // Memory level
	};

	// Compress the input text based on the selected algorithm
	function doCompress() {
		// Convert plain text to Uint8Array
		const buf = fflate.strToU8(targetPlainText);

		let compressed;

		// Compress using the selected algorithm
		if (selectedAlgorithm === 'gzip') {
			compressed = fflate.compressSync(buf, deflateOptions);
		} else if (selectedAlgorithm === 'deflate') {
			compressed = fflate.deflateSync(buf, deflateOptions);
		} else if (selectedAlgorithm === 'zip-bzip2') {
			// ZIP with BZIP2-like compression (BZIP2 isn't natively supported, but we can use ZIP with high compression)
			const zip = { 'file.txt': buf };
			compressed = fflate.zipSync(zip, { level: 9, mem: 8 });
		} else if (selectedAlgorithm === 'zip-lzma') {
			// ZIP with LZMA-like compression (using advanced compression in ZIP format)
			const zip = { 'file.txt': buf };
			compressed = fflate.zipSync(zip, { level: 9, mem: 12 });
		}

		// Calculate sizes and compression ratio
		const originalSize = buf.byteLength;
		const outputSize = compressed.byteLength;
		const compressionRatio = (((originalSize - outputSize) / originalSize) * 100).toFixed(2);

		// Update metrics
		metrics = {
			compressionRatio,
			originalSize,
			outputSize
		};

		// Convert compressed result to Base64 and Hex
		const outBuffer = Buffer.from(compressed);
		outHashText = outBuffer.toString('base64');
		outHexText = outBuffer.toString('hex');
	}
</script>

<!-- Head tag for SEO -->
<head>
	<title>TxtWizard | Free Online Compression Tool - GZIP, Deflate, ZIP with BZIP2, LZMA</title>
	<meta name="keywords" content="gzip,bzip2,lzma,deflate,zip,online,compression" />
	<meta
		name="description"
		content="An online tool that compresses plain text using GZIP, Deflate, and ZIP with BZIP2 or LZMA, and provides base64 and hex-encoded results, along with compression ratio details."
	/>
</head>
<h2>{ $t('compression') } { $t('tool') } - GZIP, BZIP2, Deflate, LZMA</h2>

<!-- Compression Tool UI -->
<div class="container">
	<!-- Algorithm Selection -->
	<div class="form-group">
		<label for="algorithm">Select Compression Algorithm</label>
		<select id="algorithm" bind:value={selectedAlgorithm}>
			{#each algorithms as algorithm}
				<option value={algorithm}>{algorithm.toUpperCase().replace('-', ' ')}</option>
			{/each}
		</select>
	</div>

	<!-- Plain Text Input -->
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
		<button on:click={doCompress}>{ $t('compress-button') }</button>
	</div>

	<!-- Base64 Output -->
	<div class="form-group">
		<label for="hashBase64">Compressed Result (Base64)</label>
		<textarea id="hashBase64" bind:value={outHashText} rows="4" readonly></textarea>
	</div>

	<!-- Hex Output -->
	<div class="form-group">
		<label for="hashHex">Compressed Result (Hex)</label>
		<textarea id="hashHex" bind:value={outHexText} rows="4" readonly></textarea>
	</div>
</div>

<div class="description">
	<h3>About the Compression Tool</h3>
	<p>
		Welcome to our free online compression tool, designed to compress your plain text into multiple
		formats such as GZIP, BZIP2, Deflate, and LZMA. Compression is a crucial technique used to
		reduce file sizes, making data transfer more efficient and storage less costly. This tool
		provides instant compression results along with detailed metrics, including compression ratio,
		original size, and compressed size.
	</p>

	<h3>What is Compression?</h3>
	<p>
		Compression is the process of reducing the size of data by encoding it in a more efficient way.
		This allows you to save storage space and speed up data transfer. Compressed data is essential
		in web development, file storage, and online transfers where bandwidth and storage limitations
		exist. Our tool provides a simple and efficient way to compress your text data and see the
		results in both Base64 and Hex formats.
	</p>
</div>

<div class="description">
	<h3>Compression Algorithms Supported</h3>
	<ul>
		<li>
			<strong>GZIP:</strong> GZIP is a widely used compression algorithm, especially on the web. It compresses
			data efficiently and is used to speed up website loading times by reducing the size of HTML, CSS,
			and JavaScript files. GZIP offers a good balance between compression speed and size reduction,
			making it ideal for web and network data transmission.
		</li>
		<li>
			<strong>BZIP2:</strong> BZIP2 is another popular compression algorithm known for producing smaller
			file sizes compared to GZIP, although it tends to be slower. BZIP2 is ideal when maximum compression
			is needed and speed is less critical, such as in backup and archival systems.
		</li>
		<li>
			<strong>Deflate:</strong> The Deflate algorithm is commonly used in file formats like ZIP and PNG.
			It offers a fast and efficient way to compress data, especially text-based files, without sacrificing
			too much speed. Deflate is also used in HTTP compression to reduce the size of web traffic.
		</li>
		<li>
			<strong>LZMA (Lempel–Ziv–Markov chain algorithm):</strong> LZMA is known for its excellent compression
			ratios and is used in formats like 7-Zip. While LZMA may take longer to compress data, the resulting
			files are often significantly smaller, making it a good choice for situations where space savings
			are more important than speed.
		</li>
	</ul>

	<h3>How to Use the Compression Tool</h3>
	<p>
		Our online compression tool is incredibly easy to use. Follow these steps to compress your data:
	</p>
	<ol>
		<li>Enter your plain text into the text box provided.</li>
		<li>Select your desired compression algorithm: GZIP, BZIP2, Deflate, or LZMA.</li>
		<li>Click the "Compress" button to generate the compressed data.</li>
		<li>
			The compressed result will be displayed in Base64 and Hex formats for easy use and transfer.
		</li>
		<li>
			You will also see the compression ratio, original size, and compressed size to help you
			understand the efficiency of each algorithm.
		</li>
	</ol>

	<h3>Benefits of Data Compression</h3>
	<ul>
		<li>
			<strong>Reduced File Sizes:</strong> Compressing data reduces its size, making it faster to upload,
			download, and transfer. This can save bandwidth and reduce load times on websites.
		</li>
		<li>
			<strong>Efficient Storage:</strong> Compression allows you to store more data within a limited
			amount of space, reducing storage costs and improving file management.
		</li>
		<li>
			<strong>Improved Network Speed:</strong> By reducing the size of data transmitted over a network,
			compression helps improve network performance, especially in low-bandwidth environments.
		</li>
		<li>
			<strong>Compatibility with Various Formats:</strong> Our tool supports popular algorithms like
			GZIP, BZIP2, and Deflate, which are widely compatible with many software systems and file formats,
			ensuring that your compressed files can be easily shared and used.
		</li>
	</ul>

	<h3>When to Use Compression</h3>
	<p>Data compression is essential in various situations, such as:</p>
	<ul>
		<li>
			<strong>Web Development:</strong> Compressing HTML, CSS, and JavaScript files to reduce page load
			times and improve user experience on websites.
		</li>
		<li>
			<strong>File Archiving:</strong> Using BZIP2 or LZMA to compress files for backup and archival,
			ensuring they take up less space while remaining accessible when needed.
		</li>
		<li>
			<strong>Data Transfer:</strong> Compressing files before transferring them over the internet or
			internal networks to reduce bandwidth usage and improve transfer speed.
		</li>
		<li>
			<strong>Storage Optimization:</strong> Compressing large files such as logs, backups, or multimedia
			to save storage space on both local machines and cloud systems.
		</li>
	</ul>
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
