import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Layout from '../src/routes/+layout.svelte';
import { init, register } from 'svelte-i18n';

const setupI18n = async () => {
  register('en', () => import('../src/lib/i18n/en.json'));
  init({
    fallbackLocale: 'en',
    initialLocale: 'en',
  });
};

describe('Layout', () => {
	beforeEach(async () => {
    await setupI18n();
  });

  it('renders the navigation links', async () => {
    render(Layout, {  // Provide any necessary props or slots here
        // For example:
        // slots: { default: '<div>Content</div>' }
    });

    const homeLink = await screen.findByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');

    const encryptionLink = await screen.findByText('Encryption');
    expect(encryptionLink).toBeInTheDocument();
    expect(encryptionLink.closest('a')).toHaveAttribute('href', '/encryption');

    const decryptionLink = await screen.findByText('Decryption');
    expect(decryptionLink).toBeInTheDocument();
    expect(decryptionLink.closest('a')).toHaveAttribute('href', '/decryption');

    const encodingDecodingLink = await screen.findByText('Encoding');
    expect(encodingDecodingLink).toBeInTheDocument();
    expect(encodingDecodingLink.closest('a')).toHaveAttribute('href', '/encoding-decoding');

    const hashingLink = await screen.findByText('Hashing');
    expect(hashingLink).toBeInTheDocument();
    expect(hashingLink.closest('a')).toHaveAttribute('href', '/hashing');

    const compressionLink = await screen.findByText('Compression');
    expect(compressionLink).toBeInTheDocument();
    expect(compressionLink.closest('a')).toHaveAttribute('href', '/compression');

    const keygenLink = await screen.findByText('Key Generation');
    expect(keygenLink).toBeInTheDocument();
    expect(keygenLink.closest('a')).toHaveAttribute('href', '/key-generation');

    const qrCodeLink = await screen.findByText('QR Code Generator');
    expect(qrCodeLink).toBeInTheDocument();
    expect(qrCodeLink.closest('a')).toHaveAttribute('href', '/qrcode');

    const currencyLink = await screen.findByText('Currency');
    expect(currencyLink).toBeInTheDocument();
    expect(currencyLink.closest('a')).toHaveAttribute('href', '/currency');

    const textDiffLink = await screen.findByText('Text Diff');
    expect(textDiffLink).toBeInTheDocument();
    expect(textDiffLink.closest('a')).toHaveAttribute('href', '/text-diff');
  });
});