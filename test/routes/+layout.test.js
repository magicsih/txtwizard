import { render, screen } from '@testing-library/svelte';
import Layout from '../src/routes/+layout.svelte';

describe('Layout Component', () => {
	it('should render navigation links', async () => {
		render(Layout);
		const homeLink = screen.getByText('home');
		const encryptionLink = screen.getByText('encryption');
		const decryptionLink = screen.getByText('decryption');
        const encodingLink = screen.getByText('encoding');
        const hashingLink = screen.getByText('hashing');
        const compressionLink = screen.getByText('compression');
        const keygenLink = screen.getByText('keygen');
        const qrcodeLink = screen.getByText('qr-code-gen');
        const currencyLink = screen.getByText('currency');
		const textTransformLink = screen.getByText('Text Transform');

		expect(homeLink).toBeInTheDocument();
		expect(encryptionLink).toBeInTheDocument();
		expect(decryptionLink).toBeInTheDocument();
        expect(encodingLink).toBeInTheDocument();
        expect(hashingLink).toBeInTheDocument();
        expect(compressionLink).toBeInTheDocument();
        expect(keygenLink).toBeInTheDocument();
        expect(qrcodeLink).toBeInTheDocument();
        expect(currencyLink).toBeInTheDocument();
		expect(textTransformLink).toBeInTheDocument();
	});
});
