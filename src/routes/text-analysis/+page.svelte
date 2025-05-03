<script lang="ts">
    let inputText = '';
    let wordCount = 0;
    let characterCount = 0;
    let sentenceCount = 0;
    let paragraphCount = 0;
    let averageWordLength = 0;
    let readingTime = 0;

    function analyzeText() {
        // Word Count
        wordCount = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;

        // Character Count (including spaces)
        characterCount = inputText.length;

        // Sentence Count
        sentenceCount = inputText.split(/[.!?]+/).filter(sentence => sentence.trim() !== '').length;

        // Paragraph Count
        paragraphCount = inputText.split(/\n\s*\n/).filter(paragraph => paragraph.trim() !== '').length;

        // Average Word Length
        const words = inputText.trim().split(/\s+/);
        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        averageWordLength = wordCount > 0 ? totalLength / wordCount : 0;

        // Reading Time (based on average reading speed of 200 words per minute)
        readingTime = wordCount / 200;
    }
</script>

<head>
    <title>TxtWizard | Text Analysis Tool</title>
    <meta
        name="description"
        content="Analyze text for word count, character count, sentence count, paragraph count, average word length, and estimated reading time."
    />
</head>

<div class="container">
    <h1>Text Analysis Tool</h1>

    <div class="form-group">
        <label for="inputText">Enter Text:</label>
        <textarea id="inputText" bind:value={inputText} rows="10" on:input={analyzeText}></textarea>
    </div>

    <h2>Analysis Results:</h2>
    <ul>
        <li>Word Count: {wordCount}</li>
        <li>Character Count: {characterCount}</li>
        <li>Sentence Count: {sentenceCount}</li>
        <li>Paragraph Count: {paragraphCount}</li>
        <li>Average Word Length: {averageWordLength.toFixed(2)}</li>
        <li>Estimated Reading Time: {readingTime.toFixed(2)} minutes</li>
    </ul>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        font-size: 16px;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 8px;
    }
</style>