import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Home from '../src/routes/+page.svelte';
import { init } from 'svelte-i18n';

// Mock the svelte-i18n init function and translations
init({
    fallbackLocale: 'en',
    initialLocale: 'en',
    formats: {},
    loaders: [
        async () => {
            return {
                en: {
                    'page.title.home': 'Home',
                    'page.description.home': 'Welcome to the home page',
                    'welcome-to-txtwizard': 'Welcome to txtwizard.net',
                    'txtwizard-intro': 'This is an introduction.',
                    'our-tools': 'Our Tools',
                    encryption: 'Encryption',
                    tool: 'Tool',
                    'encryption-intro': 'Encrypt your text.',
                    decryption: 'Decryption',
                    'decryption-intro': 'Decrypt your text.',
                    encoding: 'Encoding',
                    decoding: 'Decoding',
                    'encoding-intro': 'Encode/Decode your text.',
                    hashing: 'Hashing',
                    'hashing-intro': 'Hash your text.',
                    compression: 'Compression',
                    'compression-intro': 'Compress your text.',
					keygen: 'Key Generation',
					'keygen-intro': 'Generate keys.',
                    'qr-code-gen': 'QR Code Generator',
                    'qr-code-gen-intro': 'Generate QR codes.',
                    currency: 'Currency',
                    'currency-intro': 'Convert currency.',
                },
            };
        },
    ],
});

describe('Home Page Component', () => {
    it('renders the page title and description', async () => {
        render(Home);
        const titleElement = document.querySelector('title');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveTextContent('Home');

        const metaDescription = document.querySelector('meta[name="description"]');
        expect(metaDescription).toBeInTheDocument();
        expect(metaDescription).toHaveAttribute('content', 'Welcome to the home page');
    });

    it('renders the welcome message', async () => {
        render(Home);
        expect(screen.getByText('Welcome to txtwizard.net')).toBeInTheDocument();
    });

    it('renders the introduction paragraph', async () => {
        render(Home);
        expect(screen.getByText('This is an introduction.')).toBeInTheDocument();
    });


    it('renders a list of tools with correct text', async () => {
        render(Home);

        expect(screen.getByText('Encryption Tool')).toBeInTheDocument();
        expect(screen.getByText('Encrypt your text.')).toBeInTheDocument();
        expect(screen.getByText('Decryption Tool')).toBeInTheDocument();
        expect(screen.getByText('Decrypt your text.')).toBeInTheDocument();
        expect(screen.getByText('Encoding & Decoding Tool')).toBeInTheDocument();
        expect(screen.getByText('Encode/Decode your text.')).toBeInTheDocument();
        expect(screen.getByText('Hashing Tool')).toBeInTheDocument();
        expect(screen.getByText('Hash your text.')).toBeInTheDocument();
        expect(screen.getByText('Compression Tool')).toBeInTheDocument();
        expect(screen.getByText('Compress your text.')).toBeInTheDocument();
        expect(screen.getByText('Key Generation Tool')).toBeInTheDocument();
		expect(screen.getByText('Generate keys.')).toBeInTheDocument();
        expect(screen.getByText('QR Code Generator Tool')).toBeInTheDocument();
        expect(screen.getByText('Generate QR codes.')).toBeInTheDocument();
        expect(screen.getByText('Currency Tool')).toBeInTheDocument();
        expect(screen.getByText('Convert currency.')).toBeInTheDocument();
    });
});