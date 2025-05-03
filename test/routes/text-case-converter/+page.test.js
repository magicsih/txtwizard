import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import TextCaseConverter from '../../../src/routes/text-case-converter/+page.svelte';

describe('Text Case Converter Component', () => {
    it('renders the title and description', async () => {
        render(TextCaseConverter);

        const titleElement = document.querySelector('title');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveTextContent('Text Case Converter - txtwizard.net');

        const metaDescription = document.querySelector('meta[name="description"]');
        expect(metaDescription).toBeInTheDocument();
        expect(metaDescription).toHaveAttribute('content', 'Convert text case to uppercase, lowercase, title case, or sentence case.');
    });

    it('updates output text to uppercase', async () => {
        render(TextCaseConverter);
        const input = screen.getByLabelText('Input Text:');
        const select = screen.getByLabelText('Select Case:');
        const convertButton = screen.getByRole('button', { name: 'Convert' });
        const output = screen.getByLabelText('Output Text:');

        await fireEvent.input(input, { target: { value: 'hello world' } });
        await fireEvent.change(select, { target: { value: 'uppercase' } });
        await fireEvent.click(convertButton);

        expect(output).toHaveValue('HELLO WORLD');
    });

    it('updates output text to lowercase', async () => {
        render(TextCaseConverter);
        const input = screen.getByLabelText('Input Text:');
        const select = screen.getByLabelText('Select Case:');
        const convertButton = screen.getByRole('button', { name: 'Convert' });
        const output = screen.getByLabelText('Output Text:');

        await fireEvent.input(input, { target: { value: 'HELLO WORLD' } });
        await fireEvent.change(select, { target: { value: 'lowercase' } });
        await fireEvent.click(convertButton);

        expect(output).toHaveValue('hello world');
    });

    it('updates output text to titlecase', async () => {
        render(TextCaseConverter);
        const input = screen.getByLabelText('Input Text:');
        const select = screen.getByLabelText('Select Case:');
        const convertButton = screen.getByRole('button', { name: 'Convert' });
        const output = screen.getByLabelText('Output Text:');

        await fireEvent.input(input, { target: { value: 'hello world' } });
        await fireEvent.change(select, { target: { value: 'titlecase' } });
        await fireEvent.click(convertButton);

        expect(output).toHaveValue('Hello World');
    });

    it('updates output text to sentencecase', async () => {
        render(TextCaseConverter);
        const input = screen.getByLabelText('Input Text:');
        const select = screen.getByLabelText('Select Case:');
        const convertButton = screen.getByRole('button', { name: 'Convert' });
        const output = screen.getByLabelText('Output Text:');

        await fireEvent.input(input, { target: { value: 'hello world. this is a test.' } });
        await fireEvent.change(select, { target: { value: 'sentencecase' } });
        await fireEvent.click(convertButton);

        expect(output).toHaveValue('Hello world. This is a test.');
    });

    it('handles empty input gracefully', async () => {
        render(TextCaseConverter);
        const input = screen.getByLabelText('Input Text:');
        const select = screen.getByLabelText('Select Case:');
        const convertButton = screen.getByRole('button', { name: 'Convert' });
        const output = screen.getByLabelText('Output Text:');

        await fireEvent.input(input, { target: { value: '' } });
        await fireEvent.change(select, { target: { value: 'uppercase' } });
        await fireEvent.click(convertButton);

        expect(output).toHaveValue('');
    });
});