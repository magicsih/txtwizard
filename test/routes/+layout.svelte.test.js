import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom'; // Import for DOM matchers
import Layout from '../src/routes/+layout.svelte';

describe('+layout.svelte', () => {
  it('should render without errors', async () => {
    try {
      render(Layout);
      // Check for a basic element to confirm rendering
      const element = screen.getByRole('main'); // or whatever is appropriate
      expect(element).toBeInTheDocument();
    } catch (error) {
      console.error("Rendering error:", error);
      // Optionally re-throw the error or fail the test
      throw error;
    }
  });

  it('should render the title', async () => {
      render(Layout);
      const titleElement = screen.getByText(/txtwizard/i); // Assuming "txtwizard" is in the layout
      expect(titleElement).toBeInTheDocument();
  });
});