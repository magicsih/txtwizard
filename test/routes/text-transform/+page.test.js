import { render, screen, fireEvent } from '@testing-library/svelte';
import TextTransform from '../src/routes/text-transform/+page.svelte';

describe('Text Transform Component', () => {
	it('should render the component', async () => {
		render(TextTransform);
		const headingElement = screen.getByRole('heading', { level: 2, name: 'Text Transformer Tool' });
		expect(headingElement).toBeInTheDocument();
	});

	it('should transform text to uppercase', async () => {
		render(TextTransform);
		const inputTextarea = screen.getByLabelText('Enter Text:');
		const caseSelect = screen.getByLabelText('Select Case:');
		const transformButton = screen.getByRole('button', { name: 'Transform' });
		const outputTextarea = screen.getByLabelText('Transformed Text:');

		await fireEvent.input(inputTextarea, { target: { value: 'hello world' } });
		await fireEvent.change(caseSelect, { target: { value: 'uppercase' } });
		await fireEvent.click(transformButton);

		expect(outputTextarea.value).toBe('HELLO WORLD');
	});

	it('should transform text to lowercase', async () => {
		render(TextTransform);
		const inputTextarea = screen.getByLabelText('Enter Text:');
		const caseSelect = screen.getByLabelText('Select Case:');
		const transformButton = screen.getByRole('button', { name: 'Transform' });
		const outputTextarea = screen.getByLabelText('Transformed Text:');

		await fireEvent.input(inputTextarea, { target: { value: 'HELLO WORLD' } });
		await fireEvent.change(caseSelect, { target: { value: 'lowercase' } });
		await fireEvent.click(transformButton);

		expect(outputTextarea.value).toBe('hello world');
	});

	it('should transform text to title case', async () => {
		render(TextTransform);
		const inputTextarea = screen.getByLabelText('Enter Text:');
		const caseSelect = screen.getByLabelText('Select Case:');
		const transformButton = screen.getByRole('button', { name: 'Transform' });
		const outputTextarea = screen.getByLabelText('Transformed Text:');

		await fireEvent.input(inputTextarea, { target: { value: 'hello world' } });
		await fireEvent.change(caseSelect, { target: { value: 'titlecase' } });
		await fireEvent.click(transformButton);

		expect(outputTextarea.value).toBe('Hello World');
	});
});
