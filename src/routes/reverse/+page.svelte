<script>
	import { t } from 'svelte-i18n'
	let inputText = '';
	let reversedText = '';

	function reverseText() {
		reversedText = inputText.split('').reverse().join('');
	}
</script>

<head>
	<title>TxtWizard | Text Reverse</title>
	<meta
		name="keywords"
		content="text,reverse,online,tool"
	/>
	<meta
		name="description"
		content="Reverse text online with this free tool."
	/>
</head>

<h2>{$t('text-reverse')} {$t('tool')}</h2>

<div class="container">
	<div class="form-group">
		<label for="inputText">Enter Text:</label>
		<textarea
			id="inputText"
			bind:value={inputText}
			rows="4"
			placeholder="Enter your text here"
		></textarea>
	</div>
	<button class="primary-button" on:click={reverseText}>Reverse Text</button>

	{#if reversedText}
		<div class="form-group">
			<label for="reversedText">Reversed Text:</label>
			<textarea
				id="reversedText"
				bind:value={reversedText}
				rows="4"
				readonly
			></textarea>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f9f9f9;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 5px;
	}

	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: Arial, sans-serif;
		font-size: 14px;
	}

	.primary-button {
		background-color: #007bff;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	.primary-button:hover {
		background-color: #0056b3;
	}
</style>