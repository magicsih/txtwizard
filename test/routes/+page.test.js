import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Home from '../src/routes/+page.svelte';
import { init, register } from 'svelte-i18n';







const setupI18n = async () => {
  register('en', () => import('../src/lib/i18n/en.json'));
  init({
    fallbackLocale: 'en',
    initialLocale: 'en',
  });
};


describe('Home Page', () => {
	beforeEach(async () => {
    await setupI18n();
  });

  it('renders the home page title', async () => {
    render(Home);
    const titleElement = await screen.findByText('Welcome to txtwizard');
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the home page description', async () => {
    render(Home);
    const descriptionElement = await screen.findByText('txtwizard-intro');
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders links to all tools', async () => {
    render(Home);

    const encryptionLink = await screen.findByText('Encryption Tool');
    expect(encryptionLink).toBeInTheDocument();
    expect(encryptionLink.closest('a')).toHaveAttribute('href', '/encryption');

    const decryptionLink = await screen.findByText('Decryption Tool');
    expect(decryptionLink).toBeInTheDocument();
    expect(decryptionLink.closest('a')).toHaveAttribute('href', '/decryption');

    const encodingDecodingLink = await screen.findByText('Encoding & Decoding Tool');
    expect(encodingDecodingLink).toBeInTheDocument();
    expect(encodingDecodingLink.closest('a')).toHaveAttribute('href', '/encoding-decoding');

    const hashingLink = await screen.findByText('Hashing Tool');
    expect(hashingLink).toBeInTheDocument();
    expect(hashingLink.closest('a')).toHaveAttribute('href', '/hashing');

    const compressionLink = await screen.findByText('Compression Tool');
    expect(compressionLink).toBeInTheDocument();
    expect(compressionLink.closest('a')).toHaveAttribute('href', '/compression');

    const keygenLink = await screen.findByText('Key Generation Tool');
    expect(keygenLink).toBeInTheDocument();
    expect(keygenLink.closest('a')).toHaveAttribute('href', '/key-generation');
  });
});