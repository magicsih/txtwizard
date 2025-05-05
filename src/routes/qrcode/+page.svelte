<script lang="ts">
	import { t } from 'svelte-i18n';
	import QRCode from 'qrcode'; // QR 코드 생성 라이브러리

	let qrInputText = ''; // 입력 텍스트
	let qrCodeDataUrl = ''; // QR 코드 데이터 URL (이미지)

	// Added for base64 encoding feature
	let base64Input = '';
	let base64Output = '';

	async function generateQRCode() {
		try {
			// 입력 텍스트를 QR 코드로 변환
			qrCodeDataUrl = await QRCode.toDataURL(qrInputText);
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	}

	// Added for base64 encoding feature
	function encodeBase64() {
		try {
			base64Output = btoa(base64Input);
		} catch (error) {
			console.error('Error encoding to Base64:', error);
			base64Output = 'Invalid input for Base64 encoding';
		}
	}

	function decodeBase64() {
		try {
			base64Output = atob(base64Input);
		} catch (error) {
			console.error('Error decoding from Base64:', error);
			base64Output = 'Invalid input for Base64 decoding';
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
			placeholder="Enter text here"
		/>
		<button class="button" on:click={generateQRCode}>Generate QR Code</button>
	</div>

	<!-- QR Code Output -->
	{#if qrCodeDataUrl}
		<div class="form-group">
			<img src={qrCodeDataUrl} alt="QR Code" />
		</div>
	{/if}

	<!-- Base64 Encode/Decode Section -->
	<h2>Base64 Encode/Decode</h2>
	<div class="form-group">
		<label for="base64Input">Enter Text for Base64 Encoding/Decoding</label>
		<textarea
			id="base64Input"
			bind:value={base64Input}
			rows="4"
			placeholder="Enter text here"
		/>
	</div>

	<div class="form-group">
		<button class="button" on:click={encodeBase64}>Encode to Base64</button>
		<button class="button" on:click={decodeBase64}>Decode from Base64</button>
	</div>

	<div class="form-group">
		<label for="base64Output">Output</label>
		<textarea
			id="base64Output"
			bind:value={base64Output}
			rows="4"
			readonly
		/>
	</div>
</div>

<style>
	/* General container for the tool */
	.container {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	/* Style for form groups (input fields, labels, and buttons) */
	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 5px;
	}

	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 16px;
		margin-bottom: 10px;
		box-sizing: border-box; /* Ensures padding and border are included in the width */
	}

	/* Style for the button */
	.button {
		background-color: #4CAF50;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		margin-right: 10px;
	}

	.button:hover {
		background-color: #3e8e41;
	}

	img {
		max-width: 100%;
		border-radius: 4px;
		margin-top: 10px;
	}
</style>
