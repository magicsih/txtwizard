<script>
    let inputText = '';
    let outputText = '';
    let selectedCase = 'uppercase';

    function convertCase() {
        switch (selectedCase) {
            case 'uppercase':
                outputText = inputText.toUpperCase();
                break;
            case 'lowercase':
                outputText = inputText.toLowerCase();
                break;
            case 'titlecase':
                outputText = inputText.replace(/\w\S*/g, (txt) => {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                break;
            case 'sentencecase':
                outputText = inputText.toLowerCase().replace(/(^\w|\.\s\w)/gm, (txt) => txt.toUpperCase());
                break;
            default:
                outputText = inputText;
        }
    }
</script>

<head>
    <title>Text Case Converter - txtwizard.net</title>
    <meta name="description" content="Convert text case to uppercase, lowercase, title case, or sentence case.">
</head>

<div class="container">
    <h2>Text Case Converter</h2>

    <div class="form-group">
        <label for="inputText">Input Text:</label>
        <textarea id="inputText" bind:value={inputText} rows="4" class="form-control"></textarea>
    </div>

    <div class="form-group">
        <label for="caseSelect">Select Case:</label>
        <select id="caseSelect" bind:value={selectedCase} class="form-control">
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="titlecase">Title Case</option>
            <option value="sentencecase">Sentence case</option>
        </select>
    </div>

    <button class="btn btn-primary" on:click={convertCase}>Convert</button>

    <div class="form-group">
        <label for="outputText">Output Text:</label>
        <textarea id="outputText" bind:value={outputText} rows="4" class="form-control" readonly></textarea>
    </div>
</div>