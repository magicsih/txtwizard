<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import {
		calculatePasswordStrength,
		generatePassword as createPassword,
		type PasswordOptions
	} from '$lib/utils/password';

	let passwordLength = 12;
	let includeUppercase = true;
	let includeLowercase = true;
	let includeNumbers = true;
	let includeSymbols = true;
	let generatedPassword = '';
	let strength = '';
	let strengthColor = '';
	let errorMessage = '';

	function handleGeneratePassword() {
		errorMessage = '';

		const options: PasswordOptions = {
			length: passwordLength,
			includeUppercase,
			includeLowercase,
			includeNumbers,
			includeSymbols
		};

		try {
			generatedPassword = createPassword(options);
			const passwordStrength = calculatePasswordStrength(generatedPassword);
			strength = passwordStrength.label;
			strengthColor = passwordStrength.color;
		} catch (error) {
			generatedPassword = '';
			strength = '';
			strengthColor = '';
			errorMessage = error instanceof Error ? error.message : 'Failed to generate password.';
		}
	}

	function copyToClipboard() {
		if (!generatedPassword) return;
		navigator.clipboard.writeText(generatedPassword);
	}

	const pageTitle = 'TxtWizard | Random Password Generator';
	const pageDescription =
		'Generate secure random passwords with configurable length, symbols, numbers, and letter options.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/password-generator" />

<h1>{$t('password-generator')}</h1>

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

	<button on:click={handleGeneratePassword}>{$t('generate-password')}</button>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}

	{#if generatedPassword}
		<div class="password-output">
			<input readonly type="text" bind:value={generatedPassword} />
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

	.error {
		color: #b91c1c;
		margin: 8px 0 0;
	}
</style>
