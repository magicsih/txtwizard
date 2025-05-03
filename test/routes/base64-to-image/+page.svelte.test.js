import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Base64ToImage from '../src/routes/base64-to-image/+page.svelte';

describe('base64-to-image/+page.svelte', () => {
    it('should render the component', async () => {
        render(Base64ToImage);
        const element = screen.getByText(/Base64 to Image/i); // Assuming there is a heading
        expect(element).toBeInTheDocument();
    });

    it('should have an input field for base64 data', async () => {
        render(Base64ToImage);
        const input = screen.getByRole('textbox', {name: /Base64 Data/i}); // or input type: "text" if no label
        expect(input).toBeInTheDocument();
    });

    it('should render an image after base64 data is provided', async () => {
      render(Base64ToImage);
      const input = screen.getByRole('textbox', { name: /Base64 Data/i });
      const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+AClK/9jQyDAAAAABJRU5ErkJggg=='; // A small, valid base64 string

      await fireEvent.input(input, { target: { value: sampleBase64 } });

      const image = screen.getByRole('img'); // Assuming the image has a role="img"
      expect(image).toBeInTheDocument();
      expect(image.src).toContain(sampleBase64); // Check if the src contains the base64 data, or a preview url

    });

    it('should display an error message for invalid base64 data', async () => {
        render(Base64ToImage);
        const input = screen.getByRole('textbox', { name: /Base64 Data/i });
        const invalidBase64 = 'invalid-base64';

        await fireEvent.input(input, { target: { value: invalidBase64 } });

        const errorMessage = screen.getByText(/Invalid Base64/i); // Or the actual error message
        expect(errorMessage).toBeInTheDocument();

    });
});