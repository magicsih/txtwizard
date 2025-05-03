import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Layout from '../src/routes/+layout.svelte';
import { init } from 'svelte-i18n';

// Mock the svelte-i18n module
jest.mock('svelte-i18n', () => ({
  init: jest.fn(),
  t: jest.fn((key) => key), // Mock t function to return the key
}));


describe('Layout Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
    // Set up svelte-i18n mock
    init.mockImplementation(() => {
      return {
        t: jest.fn(key => key),
        loadTranslations: jest.fn(),
        locale: { subscribe: jest.fn() },
        format: jest.fn(),
        addTranslations: jest.fn(),
        locales: [],
        loading: false
      };
    });
  });

  it('renders navigation links correctly', () => {
    render(Layout);

    const homeLink = screen.getByRole('link', { name: 'home' });
    const encryptionLink = screen.getByRole('link', { name: 'encryption' });
    const decryptionLink = screen.getByRole('link', { name: 'decryption' });
    const encodingDecodingLink = screen.getByRole('link', { name: 'encoding' });
    const hashingLink = screen.getByRole('link', { name: 'hashing' });
    const compressionLink = screen.getByRole('link', { name: 'compression' });
    const keygenLink = screen.getByRole('link', { name: 'keygen' });
    const qrcodeLink = screen.getByRole('link', { name: 'qr-code-gen' });
    const currencyLink = screen.getByRole('link', { name: 'currency' });
    const textCaseConverterLink = screen.getByRole('link', { name: 'Text Case Converter' });

    expect(homeLink).toBeInTheDocument();
    expect(encryptionLink).toBeInTheDocument();
    expect(decryptionLink).toBeInTheDocument();
    expect(encodingDecodingLink).toBeInTheDocument();
    expect(hashingLink).toBeInTheDocument();
    expect(compressionLink).toBeInTheDocument();
    expect(keygenLink).toBeInTheDocument();
    expect(qrcodeLink).toBeInTheDocument();
    expect(currencyLink).toBeInTheDocument();
    expect(textCaseConverterLink).toBeInTheDocument();
  });

  it('renders the menu toggle button', () => {
    render(Layout);
    const menuToggle = screen.getByRole('button', { name: 'Toggle navigation' });
    expect(menuToggle).toBeInTheDocument();
  });
});