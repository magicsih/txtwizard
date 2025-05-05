import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import TextDiff from '../src/routes/text-diff/+page.svelte';

describe('Text Diff Tool', () => {
  it('renders the text inputs and button', async () => {
    render(TextDiff);
    const text1Input = screen.getByLabelText('Text 1:');
    const text2Input = screen.getByLabelText('Text 2:');
    const generateButton = screen.getByText('Generate Diff');

    expect(text1Input).toBeInTheDocument();
    expect(text2Input).toBeInTheDocument();
    expect(generateButton).toBeInTheDocument();
  });

  it('updates the diff output when text is entered and the button is clicked', async () => {
    render(TextDiff);
    const text1Input = screen.getByLabelText('Text 1:');
    const text2Input = screen.getByLabelText('Text 2:');
    const generateButton = screen.getByText('Generate Diff');

    await fireEvent.input(text1Input, { target: { value: 'hello' } });
    await fireEvent.input(text2Input, { target: { value: 'world' } });
    await fireEvent.click(generateButton);

    const diffOutput = screen.getByText(/<span style="color: grey;">/i);
    expect(diffOutput).toBeInTheDocument();
  });
});