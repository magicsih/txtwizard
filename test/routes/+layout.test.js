import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Layout from '../src/routes/+layout.svelte';
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
                    home: 'Home',
                    encryption: 'Encryption',
                    decryption: 'Decryption',
                    encoding: 'Encoding/Decoding',
                    hashing: 'Hashing',
                    compression: 'Compression',
                    keygen: 'Key Generation',
                    'qr-code-gen': 'QR Code Generator',
                    currency: 'Currency',
                },
            };
        },
    ],
});

describe('Layout Component', () => {
    it('renders navigation links with correct text', async () => {
        render(Layout);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Encryption')).toBeInTheDocument();
        expect(screen.getByText('Decryption')).toBeInTheDocument();
        expect(screen.getByText('Encoding/Decoding')).toBeInTheDocument();
        expect(screen.getByText('Hashing')).toBeInTheDocument();
        expect(screen.getByText('Compression')).toBeInTheDocument();
        expect(screen.getByText('Key Generation')).toBeInTheDocument();
        expect(screen.getByText('QR Code Generator')).toBeInTheDocument();
        expect(screen.getByText('Currency')).toBeInTheDocument();
    });

    it('renders a menu toggle button', async () => {
        render(Layout);
        const toggleButton = screen.getByRole('button', { name: /Toggle navigation/i });
        expect(toggleButton).toBeInTheDocument();
        expect(toggleButton.textContent).toContain('☰');
    });
});