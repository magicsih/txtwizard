import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import TextCaseConverter from '../../src/routes/text-case-converter/+page.svelte';

describe('TextCaseConverter Component', () => {
    it('renders the component with correct elements', async () => {
        render(TextCaseConverter);

        expect(screen.getByText('Text Case Converter')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter Text:')).toBeInTheDocument();
        expect(screen.getByLabelText('Select Case:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Convert' })).toBeInTheDocument();
        expect(screen.getByLabelText('Output Text:')).toBeInTheDocument();
    });

    it('updates output text based on selected case and input', async () => {
        render(TextCaseConverter);

        const inputTextarea = screen.getByLabelText('Enter Text:');
        const caseSelect = screen.getByLabelText('Select Case:');
        const convertButton = screen.getByRole('button', { name: 'Convert' });
        const outputTextarea = screen.getByLabelText('Output Text:');

        // Test Uppercase
        await fireEvent.input(inputTextarea, { target: { value: 'hello world' } });
        await fireEvent.change(caseSelect, { target: { value: 'uppercase' } });
        await fireEvent.click(convertButton);
        expect(outputTextarea).toHaveValue('HELLO WORLD');

        // Test Lowercase
        await fireEvent.input(inputTextarea, { target: { value: 'HeLlO WoRlD' } });
        await fireEvent.change(caseSelect, { target: { value: 'lowercase' } });
        await fireEvent.click(convertButton);
        expect(outputTextarea).toHaveValue('hello world');

        // Test Title Case
        await fireEvent.input(inputTextarea, { target: { value: 'this is a test' } });
        await fireEvent.change(caseSelect, { target: { value: 'titlecase' } });
        await fireEvent.click(convertButton);
        expect(outputTextarea).toHaveValue('This Is A Test');

        // Test Sentence Case
        await fireEvent.input(inputTextarea, { target: { value: 'this is a test. another sentence?' } });
        await fireEvent.change(caseSelect, { target: { value: 'sentencecase' } });
        await fireEvent.click(convertButton);
        expect(outputTextarea).toHaveValue('This is a test. Another sentence?');

        // Test Alternating Case
        await fireEvent.input(inputTextarea, { target: { value: 'alternating case' } });
        await fireEvent.change(caseSelect, { target: { value: 'alternatingcase' } });
        await fireEvent.click(convertButton);
        expect(outputTextarea).toHaveValue('AlTeRnAtInG cAsE');
    });
});