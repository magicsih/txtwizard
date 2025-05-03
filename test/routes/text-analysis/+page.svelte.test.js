import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import TextAnalysis from '../src/routes/text-analysis/+page.svelte';

describe('Text Analysis Tool', () => {
    it('renders the title and description meta tags', async () => {
        render(TextAnalysis);
        const title = document.querySelector('head title');
        const description = document.querySelector('head meta[name="description"]');

        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('TxtWizard | Text Analysis Tool');
        expect(description).toBeInTheDocument();
        expect(description).toHaveAttribute('content', 'Analyze text for word count, character count, sentence count, paragraph count, average word length, and estimated reading time.');
    });

    it('renders the input area', async () => {
        render(TextAnalysis);
        const inputArea = screen.getByLabelText('Enter Text:');
        expect(inputArea).toBeInTheDocument();
        expect(inputArea).toHaveAttribute('rows', '10');
    });

    it('initially displays zero values for analysis results', async () => {
        render(TextAnalysis);
        expect(screen.getByText('Word Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Character Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Sentence Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Paragraph Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Average Word Length: 0.00')).toBeInTheDocument();
        expect(screen.getByText('Estimated Reading Time: 0.00 minutes')).toBeInTheDocument();
    });

    it('updates analysis results when text is entered', async () => {
        render(TextAnalysis);
        const inputArea = screen.getByLabelText('Enter Text:');

        // Simulate user typing text
        fireEvent.input(inputArea, { target: { value: 'Hello world. This is a test.' } });

        // Check if the results are updated
        expect(screen.getByText('Word Count: 6')).toBeInTheDocument();
        expect(screen.getByText('Character Count: 30')).toBeInTheDocument();
        expect(screen.getByText('Sentence Count: 2')).toBeInTheDocument();
        expect(screen.getByText('Paragraph Count: 1')).toBeInTheDocument();
        expect(screen.getByText('Average Word Length: 4.17')).toBeInTheDocument(); // 25 / 6 = 4.1666666
        expect(screen.getByText('Estimated Reading Time: 0.03 minutes')).toBeInTheDocument();
    });

    it('handles empty input correctly', async () => {
        render(TextAnalysis);
        const inputArea = screen.getByLabelText('Enter Text:');

        fireEvent.input(inputArea, { target: { value: '' } });

        expect(screen.getByText('Word Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Character Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Sentence Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Paragraph Count: 0')).toBeInTheDocument();
        expect(screen.getByText('Average Word Length: 0.00')).toBeInTheDocument();
        expect(screen.getByText('Estimated Reading Time: 0.00 minutes')).toBeInTheDocument();
    });

    it('handles multiple paragraphs correctly', async () => {
        render(TextAnalysis);
        const inputArea = screen.getByLabelText('Enter Text:');
        const text = `This is the first paragraph.
        
        This is the second paragraph.  With some extra spaces.
        This is the third one.
        `;
        fireEvent.input(inputArea, { target: { value: text } });

        expect(screen.getByText('Paragraph Count: 3')).toBeInTheDocument();
    });
});