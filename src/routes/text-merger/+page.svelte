<script>
	let text1 = '';
	let text2 = '';
	let mergedText = '';

	function mergeTexts() {
		mergedText = text1 + text2;
	}
</script>

<h1>Text Merger</h1>

<label>
	First Text:
	<textarea bind:value={text1} rows="4" cols="50"></textarea>
</label>

<label>
	Second Text:
	<textarea bind:value={text2} rows="4" cols="50"></textarea>
</label>

<button on:click={mergeTexts}>Merge Texts</button>

{#if mergedText}
	<h2>Merged Text:</h2>
	<textarea bind:value={mergedText} rows="4" cols="50" readonly></textarea>
{/if}