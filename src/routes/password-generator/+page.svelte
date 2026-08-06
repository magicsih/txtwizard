<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AffiliateBox from '$lib/components/AffiliateBox.svelte';
	import RelatedTools from '$lib/components/RelatedTools.svelte';
	import { amazonSearch } from '$lib/affiliate';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
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

	function getStrengthColor(color: string) {
		if (color === 'red') return 'var(--danger-text)';
		if (color === 'yellow') return 'var(--warning-text)';
		if (color === 'green') return 'var(--success-text)';
		return 'var(--fg-1)';
	}

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

		trackToolsUsageEvent('password-generator', 'generate', {
			length: passwordLength,
			include_uppercase: includeUppercase ? 1 : 0,
			include_lowercase: includeLowercase ? 1 : 0,
			include_numbers: includeNumbers ? 1 : 0,
			include_symbols: includeSymbols ? 1 : 0,
			strength,
			succeeded: generatedPassword.length > 0 ? 1 : 0
		});
	}

	function copyToClipboard() {
		if (!generatedPassword) return;
		navigator.clipboard.writeText(generatedPassword);
		trackToolsUsageEvent('password-generator', 'copy', { length: generatedPassword.length });
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
				{$t('strength')}: <span style="color: {getStrengthColor(strengthColor)}">{strength}</span>
			</p>
		{/if}
	{/if}
</div>

<AffiliateBox
	heading="Beyond passwords: add a hardware security key"
	intro="A strong generated password is a great start. For the accounts that matter most, add a hardware security key for phishing-resistant two-factor authentication:"
	items={[
		{
			label: 'YubiKey security keys',
			url: amazonSearch('YubiKey security key'),
			note: 'hardware 2FA'
		}
	]}
/>

<RelatedTools tool="password-generator" />

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background-color: var(--bg-2);
		color: var(--fg-1);
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
		border: 1px solid var(--bg-3);
		border-radius: 4px;
		background-color: var(--bg-1);
		color: var(--fg-1);
		box-sizing: border-box;
	}

	button {
		background-color: #2e7d32;
		color: white;
		padding: 14px 20px;
		margin: 8px 0;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		width: 100%;
	}

	button:hover {
		background-color: #1b5e20;
	}

	.password-output {
		margin-top: 20px;
		border: 1px solid var(--bg-3);
		padding: 10px;
		border-radius: 4px;
		background-color: var(--bg-1);
		color: var(--fg-1);
	}

	.slider {
		width: 100%;
	}

	.error {
		color: #b91c1c;
		margin: 8px 0 0;
	}
</style>
