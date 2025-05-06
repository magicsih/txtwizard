<script>
	let inputText = '';
	let reversedText = '';

	function reverseString() {
		reversedText = inputText.split('').reverse().join('');
	}
</script>

<head>
	<title>TxtWizard | Reverse Text</title>
	<meta name="keywords" content="reverse text, online tool, text manipulation" />
	<meta name="description" content="Reverse text online. Simple tool to reverse any text." />
</head>

<h2>Reverse Text Tool</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea id="inputText" bind:value={inputText} rows="4" placeholder="Enter your text here"></textarea>
	</div>

	<button class="primary" on:click={reverseString}>Reverse</button>

	{#if reversedText}
		<div class="form-group">
			<label for="reversedText">Reversed Text:</label>
			<textarea id="reversedText" value={reversedText} rows="4" readonly></textarea>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		paddi
