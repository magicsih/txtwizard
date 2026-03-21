import { describe, expect, it } from 'vitest';

import { generateQRCodeDataUrl } from './qrcode';

describe('generateQRCodeDataUrl', () => {
	it('returns a PNG data URL', async () => {
		const result = await generateQRCodeDataUrl('hello');
		expect(result.startsWith('data:image/png;base64,')).toBe(true);
	});
});
