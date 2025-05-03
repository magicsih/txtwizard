import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Home from '../src/routes/+page.svelte';
import { i18n } from '../src/i18n'; // Assuming you have an i18n setup
import { init } from 'svelte-i18n';

// Mock the t function for testing
const mockT = (key) => {
	const translations = {
		'page.title.home': 'Home',
		'page.description.home': 'Welcome to our home page',
		'welcome-to-txtwizard': 'Welcome to TxtWizard',
		'txtwizard-intro': 'This is an introduction to TxtWizard',
		'our-tools': 'Our Tools',
		'encryption': 'Encryption',
		'tool': 'Tool',
		'encryption-intro': 'Encrypt your text',
		'decryption': 'Decryption',
		'decryption-intro': 'Decrypt your text',
		'encoding': 'Encoding',
		'encoding-intro': 'Encode your text',
		'hashing': 'Hashing',
		'hashing-intro': 'Hash your text',
		'compression': 'Compression',
		'compression-intro': 'Compress your text',
		'keygen': 'Key Generation',
		'keygen-intro': 'Generate keys',
		'qr-code-gen': 'QR Code Generator',
		'qr-code-gen-intro': 'Generate QR Codes',
		'currency': 'Currency',
		'currency-intro': 'Currency conversion',
		'encoding-decoding': 'Encoding & Decoding'
	};
	return translations[key] || key;
};

// Mock svelte-i18n
jest.mock('svelte-i18n', () => ({
	t: (key) => mockT(key),
	_,
	locale: { subscribe: () => {} },
	locales: { subscribe: () => {} },
	addTranslations: () => {}
}));

function _(key) {
	return key;
}

describe('Home Page', () => {
	beforeAll(async () => {
		init({
			fallbackLocale: 'en',
			initialLocale: 'en',
			formats: {}
		});
		await i18n.loadTranslations(
			'en',
			{
				'page.title.home': 'Home',
				'page.description.home': 'Welcome to our home page',
				'welcome-to-txtwizard': 'Welcome to TxtWizard',
				'txtwizard-intro': 'This is an introduction to TxtWizard',
				'our-tools': 'Our Tools',
				'encryption': 'Encryption',
				'tool': 'Tool',
				'encryption-intro': 'Encrypt your text',
				'decryption': 'Decryption',
				'decryption-intro': 'Decrypt your text',
				'encoding': 'Encoding',
				'encoding-intro': 'Encode your text',
				'hashing': 'Hashing',
				'hashing-intro': 'Hash your text',
				'compression': 'Compression',
				'compression-intro': 'Compress your text',
				'keygen': 'Key Generation',
				'keygen-intro': 'Generate keys',
				'qr-code-gen': 'QR Code Generator',
				'qr-code-gen-intro': 'Generate QR Codes',
				'currency': 'Currency',
				'currency-intro': 'Currency conversion',
				'encoding-decoding': 'Encoding & Decoding'
			}
		);
	});

	it('renders the title and description meta tags', async () => {
		render(Home);
		const title = document.querySelector('head title');
		const description = document.querySelector('head meta[name="description"]');

		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('Home');
		expect(description).toBeInTheDocument();
		expect(description).toHaveAttribute('content', 'Welcome to our home page');
	});

	it('renders the welcome message', async () => {
		render(Home);
		const welcomeMessage = await screen.findByText('Welcome to TxtWizard');
		expect(welcomeMessage).toBeInTheDocument();
	});

	it('renders the tools list and links', async () => {
		render(Home);
		const toolsHeading = await screen.findByText('Our Tools');
		expect(toolsHeading).toBeInTheDocument();

		const encryptionLink = await screen.findByText('Encryption Tool');
		expect(encryptionLink).toBeInTheDocument();
		expect(encryptionLink).toHaveAttribute('href', '/encryption');

		const decryptionLink = await screen.findByText('Decryption Tool');
		expect(decryptionLink).toBeInTheDocument();
		expect(decryptionLink).toHaveAttribute('href', '/decryption');

		const encodingDecodingLink = await screen.findByText('Encoding & Decoding Tool');
		expect(encodingDecodingLink).toBeInTheDocument();
		expect(encodingDecodingLink).toHaveAttribute('href', '/encoding-decoding');

		const hashingLink = await screen.findByText('Hashing Tool');
		expect(hashingLink).toBeInTheDocument();
		expect(hashingLink).toHaveAttribute('href', '/hashing');

		const compressionLink = await screen.findByText('Compression Tool');
		expect(compressionLink).toBeInTheDocument();
		expect(compressionLink).toHaveAttribute('href', '/compression');

		const keygenLink = await screen.findByText('Key Generation Tool');
		expect(keygenLink).toBeInTheDocument();
		expect(keygenLink).toHaveAttribute('href', '/key-generation');

		const qrCodeLink = await screen.findByText('QR Code Generator Tool');
		expect(qrCodeLink).toBeInTheDocument();
		expect(qrCodeLink).toHaveAttribute('href', '/qrcode');

		const currencyLink = await screen.findByText('Currency Tool');
		expect(currencyLink).toBeInTheDocument();
		expect(currencyLink).toHaveAttribute('href', '/currency');
	});
});