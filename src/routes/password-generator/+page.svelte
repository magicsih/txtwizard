<script lang="ts">
	import { t } from 'svelte-i18n';

	let passwordLength = 12;
	let includeUppercase = true;
	let includeLowercase = true;
	let includeNumbers = true;
	let includeSymbols = true;
	let generatedPassword = '';
	let strength = '';
	let strengthColor = '';

	function generatePassword() {
		let characterSet = '';
		const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
		const numberChars = '0123456789';
		const symbolChars = '!@#$%^&*()_+~`|}{[]:;<>,.?/';

		characterSet += includeUppercase ? uppercaseChars : '';
		characterSet += includeLowercase ? lowercaseChars : '';
		characterSet += includeNumbers ? numberChars : '';
		characterSet += includeSymbols ? symbolChars : '';

		let newPassword = '';
		for (let i = 0; i < passwordLength; i++) {
			const randomIndex = Math.floor(Math.random() * characterSet.length);
			newPassword += characterSet.charAt(randomIndex);
		}

		generatedPassword = newPassword;
		updateStrength(newPassword);
	}

	function updateStrength(password: string) {
		let complexity = 0;
		if (/[a-z]+/.test(password)) complexity++;
		if (/[A-Z]+/.test(password)) complexity++;
		if (/[0-9]+/.test(password)) complexity++;
		if (/[!@#$%^&*()_+~`|}{[\]:;<>,.?/]+/.test(password)) complexity++;

		const lengthFactor = Math.min(password.length / 8, 1); // Normalize length factor
		complexity = complexity * lengthFactor;

		// Determine the strength level based on complexity
		let newStrength = '';
		let newStrengthColor = '';

		// Determine the strength level based on complexity
		// Adjust thresholds as needed
		const weakThreshold = 1;
		const mediumThreshold = 2;

		// Assign strength level and color
		// Keep original logic, just update the values
		if (complexity <= weakThreshold) {
			newStrength = 'Weak';
			newStrengthColor = 'red';
		} else if (complexity <= mediumThreshold) {
			newStrength = 'Medium';
			newStrengthColor = 'yellow';
		} else {
			newStrength = 'Strong';
			newStrengthColor = 'green';
		}

		strength = newStrength;
		strengthColor = newStrengthColor;
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(generatedPassword);
	}
</script>

<svelte:head>
	<title>TxtWizard | Random Password Generator</title>
	<meta name="description" content="Generate secure, random passwords with customizable options." />
</svelte:head>

<h2>{$t('password-generator')}</h2>

<div class="container">
	<div class="form-group">
		<label for="passwordLength">{$t('password-length')}: {passwordLength}</label>
		<input
			bind:value={passwordLength}
			class="slider"
			id="passwordLength"
			max="32"
			min="4"
			type="range"
		/>
	</div>

	<div class="form-group">
		<label>
			<input bind:checked={includeUppercase} type="checkbox" />
			{$t('include-uppercase')}
		</label>
		<label>
			<input bind:checked={includeLowercase} type="checkbox" />
			{$t('include-lowercase')}
		</label>
		<label>
			<input bind:checked={includeNumbers} type="checkbox" />
			{$t('include-numbers')}
		</label>
		<label>
			<input bind:checked={includeSymbols} type="checkbox" />
			{$t('include-symbols')}
		</label>
	</div>

	<button on:click={generatePassword}>{$t('generate-password')}</button>

	{#if generatedPassword}
		<div class="password-output">
			<input readonly type="text" value={generatedPassword} />
			<button on:click={copyToClipboard}>{$t('copy-to-clipboard')}</button>
		</div>
		{#if strength}
			<p>
				{$t('strength')}: <span style="color: {strengthColor}">{strength}</span>
			</p>
		{/if}
	{/if}
</div>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
		max-width: 600px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
	}

	input[type='text'] {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	button {
		background-color: #4caf50;
		color: white;
		padding: 14px 20px;
		margin: 8px 0;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		width: 100%;
	}

	button:hover {
		background-color: #45a049;
	}

	.password-output {
		margin-top: 20px;
		border: 1px solid #ddd;
		padding: 10px;
		border-radius: 4px;
	}

	.slider {
		width: 100%;
	}
</style>
