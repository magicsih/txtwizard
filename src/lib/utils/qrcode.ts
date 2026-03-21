import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(text: string): Promise<string> {
	return QRCode.toDataURL(text);
}
