<script>
	let inputText = '';
	let reversedText = '';

	function reverseText() {
		reversedText = inputText.split('').reverse().join('');
	}
</script>

<svelte:head>
	<title>Reverse Text</title>
	<meta name="description" content="Reverse text online." />
</svelte:head>

<h1>Reverse Text</h1>

<textarea bind:value={inputText} placeholder="Enter text here" rows="4" cols="50" />
<button on:click={reverseText}>Reverse</button>

{#if reversedText}
	<h2>Reversed Text:</h2>
	<p>{reversedText}</p>
{/if}
