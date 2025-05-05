import { render, fireEvent, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import EncodingDecodingPage from './+page.svelte';
import { Buffer } from 'buffer';

// Mock the Buffer object if it's not available in the test environment
global.Buffer = Buffer;

describe('EncodingDecodingPage', () => {
  it('renders without crashing', async () => {
    render(EncodingDecodingPage);
    expect(screen.getByLabelText('Enter Text')).toBeInTheDocument();
  });

  it('updates plain text correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'Hello, world!';
    await fireEvent.input(input, { target: { value: testString } });
    expect(screen.getByText(testString)).toBeInTheDocument();
  });

  it('updates base64 correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'Hello, world!';
    await fireEvent.input(input, { target: { value: testString } });
    const base64Output = Buffer.from(testString).toString('base64');
    expect(screen.getByText(base64Output)).toBeInTheDocument();
  });

  it('updates hex correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'Hello, world!';
    await fireEvent.input(input, { target: { value: testString } });
    const hexOutput = Buffer.from(testString).toString('hex');
    expect(screen.getByText(hexOutput)).toBeInTheDocument();
  });

  it('updates url encoded correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'Hello, world!@#$%^&*()_+=-`~[]\{}|;":	
,./<>?';
    await fireEvent.input(input, { target: { value: testString } });
    const urlEncodedOutput = encodeURIComponent(testString);
    expect(screen.getByText(urlEncodedOutput)).toBeInTheDocument();
  });

  it('updates html encoded correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = '<html><head><title>Test</title></head><body><h1>Hello</h1></body></html>';
    await fireEvent.input(input, { target: { value: testString } });
    const htmlEncodedOutput = testString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    expect(screen.getByText(htmlEncodedOutput)).toBeInTheDocument();
  });

  it('detects plain text correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'Just plain text';
    await fireEvent.input(input, { target: { value: testString } });
    expect(screen.getByText('Detected Encoding: Plain Text')).toBeInTheDocument();
  });

  it('detects base64 correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'SGVsbG8sIHdvcmxkIQ==';
    await fireEvent.input(input, { target: { value: testString } });
    expect(screen.getByText('Detected Encoding: Base64')).toBeInTheDocument();
  });

  it('detects hex correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = '48656c6c6f2c20776f726c6421';
    await fireEvent.input(input, { target: { value: testString } });
    expect(screen.getByText('Detected Encoding: Hex')).toBeInTheDocument();
  });

  it('detects url encoded correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'Hello%2C%20world%21';
    await fireEvent.input(input, { target: { value: testString } });
    expect(screen.getByText('Detected Encoding: URL Encoded')).toBeInTheDocument();
  });

  it('detects html encoded correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = '&lt;html&gt;';
    await fireEvent.input(input, { target: { value: testString } });
    expect(screen.getByText('Detected Encoding: HTML Encoded')).toBeInTheDocument();
  });

  it('calculates rows correctly', async () => {
    render(EncodingDecodingPage);
    const input = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    const testString = 'a'.repeat(150); // More than 50 characters
    await fireEvent.input(input, { target: { value: testString } });
    // Assuming the row calculation is based on the length of the input
    // and the number of rows is dynamically calculated (e.g., 150/50 = 3 rows)
    const plainTextarea = screen.getByText('Length: 150 characters, 150 bytes').closest('div')?.querySelector('textarea');
    expect(plainTextarea?.rows).toBe(3);
  });

  it('focuses on the input element on mount', async () => {
    render(EncodingDecodingPage);
    const inputElement = screen.getByLabelText('Enter Text') as HTMLTextAreaElement;
    expect(document.activeElement).toBe(inputElement);
  });
});
