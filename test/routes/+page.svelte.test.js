import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import HomePage from '../src/routes/+page.svelte';

describe('+page.svelte', () => {
  it('should render the home page content', async () => {
    render(HomePage);
    // Example assertions: Replace with actual content from your home page.
    const heading = screen.getByRole('heading', { level: 1 }); // Example: Find an h1
    expect(heading).toBeInTheDocument();
    // You might add more specific checks based on the content of your home page.
    // For instance:
    // const someText = screen.getByText(/Welcome/i);
    // expect(someText).toBeInTheDocument();

  });

   it('should render a navigation link', async () => {
      render(HomePage);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();

   });

});