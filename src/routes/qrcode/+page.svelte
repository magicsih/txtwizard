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
	<meta name="keywords" content="online,qr code,generator,create,free" />
	<meta
		name="description"
		content="QR Code Generator, free online tool to create QR codes from text or URLs"
	/>
</head>

<h2>{$t('qr-code-gen')} {$t('tool')}</h2>

<!-- QR Code Generator UI -->
<div class="container">
	<!-- Input Text for QR Code -->
	<div class="form-group">
		<label for="qrInput">Enter Text or URL for QR Code</label>
		<textarea id="qrInput" bind:value={qrInputText} rows="4" placeholder="Enter text or U
