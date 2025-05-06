<svelte:head>
	<title>Text Merge - txtwizard.net</title>
	<meta name="description" content="Merge multiple text inputs into one. Simple and easy text merging tool.">
</svelte:head>

<h1>Text Merge</h1>

<p>Enter the texts you want to merge, one per field, and they will be concatenated.</p>

<script lang="ts">
	let texts: string[] = [''];
	let mergedText: string = '';

	function addTextarea() {
		exts = [...texts, ''];
	}

	function removeTextarea(index: number) {
		exts = texts.filter((_, i) => i !== index);
	}

	function mergeTexts() {
		mergedText = texts.join('\n');
	}
</script>

<form on:submit|preventDefault={mergeTexts}>
	{#each texts as text, index (index)}
		<label>
			Text {index + 1}:
			<textarea bind:value={text} rows="4" cols="50"></textarea>
			<button type="button" on:click={() => removeTextarea(index)} disabled={texts.length === 1}>Remove</button>
		</label>
	{/each}
	<button type="button" on:click={addTextarea}>Add Textarea</button>
	<button type="submit">Merge Texts</button>
</form>

{#if mergedText}
	<h2>Merged Text:</h2>
	<textarea readonly rows="4" cols="50" value={mergedText}></textarea>
{/if}