<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import AffiliateBox from '$lib/components/AffiliateBox.svelte';
	import { amazonSearch } from '$lib/affiliate';
	import { generateQRCodeDataUrl } from '$lib/utils/qrcode';

	let qrInputText = '';
	let qrCodeDataUrl = '';

	async function generateQRCode() {
		try {
			qrCodeDataUrl = await generateQRCodeDataUrl(qrInputText);
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	}

	const pageTitle = 'TxtWizard | Free Online QR Code Generator';
	const pageDescription =
		'Generate QR codes from text or URLs in your browser and download the result as a PNG image.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/qrcode" />

<h1>{$t('qr-code-gen')} {$t('tool')}</h1>

<div class="container">
	<div class="form-group">
		<label for="qrInput">Enter Text or URL for QR Code</label>
		<textarea id="qrInput" bind:value={qrInputText} rows="4" placeholder="Enter text or URL here"
		></textarea>
		<small>{qrInputText.length} characters</small>
	</div>

	<div class="form-group">
		<button on:click={generateQRCode}>{$t('generate')}</button>
	</div>

	<div class="form-group" style="text-align: center;">
		{#if qrCodeDataUrl}
			<img src={qrCodeDataUrl} alt="Generated QR Code" />
			<a href={qrCodeDataUrl} download="qrcode.png">Download QR Code</a>
		{/if}
	</div>
</div>

<AffiliateBox
	heading="Printing or scanning QR codes often?"
	intro="This tool generates QR codes right in your browser. If you print labels or scan codes regularly, these make it easier:"
	items={[
		{
			label: 'Label printers',
			url: amazonSearch('label printer'),
			note: 'print QR labels'
		},
		{
			label: 'Barcode & QR scanners',
			url: amazonSearch('QR code barcode scanner'),
			note: 'fast scanning'
		}
	]}
/>

<div class="description">
	<h2>What is a QR Code?</h2>
	<p>
		A QR code (Quick Response code) is a type of matrix barcode that can encode information such as
		text, URLs, or other data. It's widely used for contactless payment systems, website links, and
		more.
	</p>
	<h3>How to Use This Tool</h3>
	<ul>
		<li>Enter any text or URL into the text box above.</li>
		<li>Click the "Generate QR Code" button.</li>
		<li>Your QR code will be generated and displayed as an image.</li>
		<li>You can download the QR code as a PNG file.</li>
	</ul>
</div>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background-color: var(--bg-2);
		color: var(--fg-1);
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 8px;
	}

	textarea,
	button {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid var(--bg-3);
		border-radius: 4px;
		background-color: var(--bg-1);
		color: var(--fg-1);
	}

	button {
		border: none;
		background-color: var(--link);
		color: var(--bg-1);
		cursor: pointer;
	}

	img {
		margin: 20px auto;
		max-width: 200px;
		height: auto;
	}

	a {
		display: block;
		color: #007bff;
		text-decoration: none;
		margin-top: 10px;
	}

	small {
		display: block;
		color: var(--fg-2);
		margin-top: 5px;
	}

	h2,
	h3 {
		margin-bottom: 15px;
	}

	p {
		margin-bottom: 10px;
	}

	ul {
		padding-left: 20px;
	}
</style>
