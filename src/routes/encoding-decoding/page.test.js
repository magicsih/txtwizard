import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import EncodingDecodingPage from './+page.svelte';

describe('EncodingDecodingPage', () => {
	it('renders the page and its sections', () => {
		render(EncodingDecodingPage);

		// Check for main headings
		const heading = screen.getByRole('heading', { name: /Encoding Tool/i });
		expect(heading).toBeInTheDocument();

		// Check for input and output sections
		const inputLabel = screen.getByLabelText('Enter Text');
		expect(inputLabel).toBeInTheDocument();

		const plainTextHeading = screen.getByRole('heading', { name: /Plain Text/i });
		expect(plainTextHeading).toBeInTheDocument();
		const base64Heading = screen.getByRole('heading', { name: /Base64/i });
		expect(base64Heading).toBeInTheDocument();
		const hexHeading = screen.getByRole('heading', { name: /Hex/i });					
		expect(hexHeading).toBeInTheDocument();
		const urlEncodedHeading = screen.getByRole('heading', { name: /URL Encoded/i });
		expect(urlEncodedHeading).toBeInTheDocument();
		const htmlEncodedHeading = screen.getByRole('heading', { name: /HTML Encoded/i });
		expect(htmlEncodedHeading).toBeInTheDocument();
	});

	it('updates output values correctly based on input', async () => {
		render(EncodingDecodingPage);
		const input = screen.getByLabelText('Enter Text');
		const plainTextOutput = screen.getByDisplayValue(''); // Initially empty
		const base64Output = screen.getByDisplayValue('');
		const hexOutput = screen.getByDisplayValue('');
		const urlEncodeOutput = screen.getByDisplayValue('');
		const htmlEncodeOutput = screen.getByDisplayValue('');
		const detectedEncoding = screen.getByText('Detected Encoding: Plain Text');

		fireEvent.input(input, { target: { value: 'hello world!' } });

		expect(plainTextOutput.value).toBe('hello world!');
		expect(base64Output.value).toBe('aGVsbG8gd29ybGQh');
		expect(hexOutput.value).toBe('68656c6c6f20776f726c6421');
		expect(urlEncodeOutput.value).toBe('hello%20world!');
		expect(htmlEncodeOutput.value).toBe('hello world!');
		expect(detectedEncoding.textContent).toBe('Detected Encoding: Plain Text');
	});

	it('detects encoding types correctly', async () => {
		render(EncodingDecodingPage);
		const input = screen.getByLabelText('Enter Text');
		const detectedEncoding = screen.getByText('Detected Encoding:');

		// Test Base64 detection
		fireEvent.input(input, { target: { value: 'aGVsbG8gd29ybGQh' } });
		expect(detectedEncoding.textContent).toContain('Detected Encoding: Base64');

		// Test Hex detection
		fireEvent.input(input, { target: { value: '68656c6c6f20776f726c6421' } });
		expect(detectedEncoding.textContent).toContain('Detected Encoding: Hex');

		// Test URL Encoded detection
		fireEvent.input(input, { target: { value: 'hello%20world!' } });
		expect(detectedEncoding.textContent).toContain('Detected Encoding: URL Encoded');

		// Test HTML Encoded detection
		fireEvent.input(input, { target: { value: '&lt;hello&gt;' } });
		expect(detectedEncoding.textContent).toContain('Detected Encoding: HTML Encoded');
	});

	it('handles empty input', async () => {
		render(EncodingDecodingPage);
		const input = screen.getByLabelText('Enter Text');
		const detectedEncoding = screen.getByText('Detected Encoding:');

		fireEvent.input(input, { target: { value: '' } });
		expect(detectedEncoding.textContent).toContain('Detected Encoding: Plain Text');
	});
});
