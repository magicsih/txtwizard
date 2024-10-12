<script lang="ts">
	import { t } from 'svelte-i18n';
	import QRCode from 'qrcode'; // QR 코드 생성 라이브러리

	let qrInputText = ''; // 입력 텍스트
	let qrCodeDataUrl = ''; // QR 코드 데이터 URL (이미지)

	async function generateQRCode() {
		try {
			// 입력 텍스트를 QR 코드로 변환
			qrCodeDataUrl = await QRCode.toDataURL(qrInputText);
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	}
</script>

<head>
	<title>TxtWizard | Free Online QR Code Generator</title>
	<meta
		name="keywords"
		content="online,qr code,generator,create,free"
	/>
	<meta
		name="description"
		content="QR Code Generator, free online tool to create QR codes from text or URLs"
	/>
</head>

<h2>{ $t('qr-code-gen') } { $t('tool') }</h2>

<!-- QR Code Generator UI -->
<div class="container">

	<!-- Input Text for QR Code -->
	<div class="form-group">
		<label for="qrInput">Enter Text or URL for QR Code</label>
		<textarea
			id="qrInput"
			bind:value={qrInputText}
			rows="4"
			placeholder="Enter text or URL here"
		></textarea>
		<small>{qrInputText.length} characters</small>
	</div>

	<!-- Generate QR Code Button -->
	<div class="form-group">
		<button on:click={generateQRCode}>{ $t('generate') }</button>
	</div>

	<!-- QR Code Output -->
	<div class="form-group" style="text-align: center;">
		{#if qrCodeDataUrl}
			<img src={qrCodeDataUrl} alt="Generated QR Code" />
			<a href={qrCodeDataUrl} download="qrcode.png">Download QR Code</a>
		{/if}
	</div>
</div>

<div class="description">
	<h2>What is a QR Code?</h2>
	<p>
		A QR code (Quick Response code) is a type of matrix barcode that can encode information such as text, URLs, or other data. It's widely used for contactless payment systems, website links, and more.
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
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
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
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
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
		color: #666;
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
