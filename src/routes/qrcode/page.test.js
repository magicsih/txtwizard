import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import QRCodePage from './+page.svelte';
import QRCode from 'qrcode';

// Mock the QRCode library to avoid actual QR code generation during tests
jest.mock('qrcode', () => ({
	toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+EAwOIB/BCJWA+kGQAJ/IeZ5wS2XAAAAABJRU5ErkJggg==')
}));

describe('QRCodePage', () => {
	it('renders the QR code generator and base64 section', async () => {
		render(QRCodePage);
		const qrCodeHeading = screen.getByRole('heading', { name: /QR Code Generator/i });
		const base64Heading = screen.getByRole('heading', { name: /Base64 Encode\/Decode/i });

		expect(qrCodeHeading).toBeInTheDocument();
		expect(base64Heading).toBeInTheDocument();
	});

	it('generates a QR code when input is provided and button is clicked', async () => {
		render(QRCodePage);
		const input = screen.getByLabelText('Enter Text or URL for QR Code');
		const button = screen.getByRole('button', { name: 'Generate QR Code' });

		fireEvent.input(input, { target: { value: 'test qr code' } });
		fireEvent.click(button);

		// Wait for the QR code to be generated (mocked in this case)
		const img = await screen.findByAltText('QR Code');
		expect(img).toBeInTheDocument();
		expect(img.src).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+EAwOIB/BCJWA+kGQAJ/IeZ5wS2XAAAAABJRU5ErkJggg==');
		expect(QRCode.toDataURL).toHaveBeenCalledWith('test qr code');
	});

	it('encodes and decodes Base64 correctly', async () => {
		render(QRCodePage);
		const input = screen.getByLabelText('Enter Text for Base64 Encoding/Decoding');
		const encodeButton = screen.getByRole('button', { name: 'Encode to Base64' });
		const decodeButton = screen.getByRole('button', { name: 'Decode from Base64' });
		const output = screen.getByLabelText('Output');

		// Test Encoding
		fireEvent.input(input, { target: { value: 'hello' } });
		fireEvent.click(encodeButton);
		expect(output.value).toBe('aGVsbG8=');

		// Reset input and test Decoding
		fireEvent.input(input, { target: { value: 'aGVsbG8=' } });
		fireEvent.click(decodeButton);
		expect(output.value).toBe('hello');
	});

	it('handles invalid Base64 input during decoding', async () => {
		render(QRCodePage);
		const input = screen.getByLabelText('Enter Text for Base64 Encoding/Decoding');
		const decodeButton = screen.getByRole('button', { name: 'Decode from Base64' });
		const output = screen.getByLabelText('Output');

		fireEvent.input(input, { target: { value: 'invalid-base64' } });
		fireEvent.click(decodeButton);
		expect(output.value).toBe('Invalid input for Base64 decoding');
	});
});
