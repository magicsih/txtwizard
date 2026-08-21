<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdUnit from '$lib/components/AdUnit.svelte';
	import AffiliateBox from '$lib/components/AffiliateBox.svelte';
	import RelatedTools from '$lib/components/RelatedTools.svelte';
	import { amazonSearch } from '$lib/affiliate';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';
	import { t } from 'svelte-i18n';
	import {
		deriveKeysFromNumericInput,
		generateRandomKeyPair,
		type DerivedKeys
	} from '$lib/utils/key-generation';

	let privateKey = '';
	let privateKeyNumeric = '';
	let publicKey = '';
	let address = '';
	let btcPrivateKey = '';
	let btcPublicKey = '';
	let btcAddress = '';

	function applyDerivedKeys(keys: DerivedKeys) {
		privateKey = keys.privateKey;
		privateKeyNumeric = keys.privateKeyNumeric;
		publicKey = keys.publicKey;
		address = keys.address;
		btcPrivateKey = keys.btcPrivateKey;
		btcPublicKey = keys.btcPublicKey;
		btcAddress = keys.btcAddress;
	}

	function generateKeys() {
		applyDerivedKeys(generateRandomKeyPair());
		trackToolsUsageEvent('key-generation', 'generate', { source: 'random' });
	}

	function updateKeysFromNumericInput() {
		let ok = 1;
		try {
			applyDerivedKeys(deriveKeysFromNumericInput(privateKeyNumeric));
		} catch (error) {
			ok = 0;
			console.error('Invalid numeric private key input:', error);
		}
		trackToolsUsageEvent('key-generation', 'derive', {
			source: 'numeric_input',
			input_length: privateKeyNumeric.length,
			succeeded: ok
		});
	}

	const pageTitle = 'Bitcoin & Ethereum Private Key Generator | TxtWizard';
	const pageDescription =
		'Generate Bitcoin and Ethereum private keys, public keys, and addresses locally in your browser for learning and testing.';
	const faqStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Are the keys generated on a server?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'No. Key generation runs locally in your browser.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I enter my own private key?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. You can paste a numeric private key to derive the matching public keys and addresses.'
				}
			},
			{
				'@type': 'Question',
				name: 'Should I use generated keys for real funds?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Only if you fully trust your device and environment. For production wallets, hardware-backed flows are safer.'
				}
			}
		]
	};
</script>

<SeoHead
	title={pageTitle}
	description={pageDescription}
	path="/key-generation"
	structuredData={faqStructuredData}
/>

<h1>Free Bitcoin &amp; Ethereum Private Key Generator</h1>

<div class="container">
	<div class="form-group">
		<button on:click={generateKeys}>{$t('generate')} ({$t('bitcoin')}, {$t('ethereum')})</button>
	</div>

	<div class="form-group">
		<div>
			<strong>Private Key (Numeric):</strong>
			<input type="text" bind:value={privateKeyNumeric} on:change={updateKeysFromNumericInput} />
			<small>
				Range: 1 &lt;= n &lt;
				115792089237316195423570985008687907852837564279074904382605163141518161494337
			</small>
		</div>
	</div>

	<div class="form-group">
		<label for="btcAddress">Bitcoin Address</label>
		<input type="text" id="btcAddress" bind:value={btcAddress} readonly />
		{#if btcAddress}
			<a
				href="https://www.blockchain.com/btc/address/{btcAddress}"
				target="_blank"
				rel="noopener noreferrer"
			>
				View Bitcoin address on Blockchain Explorer
			</a>
		{/if}
		<strong>Bitcoin Private Key (WIF):</strong>
		<input type="text" bind:value={btcPrivateKey} readonly />
	</div>

	<div class="form-group">
		<label for="ethAddress">Ethereum Address</label>
		<input type="text" id="ethAddress" bind:value={address} readonly />
		{#if address}
			<a href="https://etherscan.io/address/{address}" target="_blank" rel="noopener noreferrer">
				View Ethereum address on Etherscan
			</a>
		{/if}
		<strong>Ethereum Private Key (HEX):</strong>
		<input type="text" bind:value={privateKey} readonly />
	</div>

	<div class="form-group" style="display:none;">
		<label for="ethPublicKey">Ethereum Public Key</label>
		<input type="text" id="ethPublicKey" bind:value={publicKey} readonly />
		<strong>Bitcoin Public Key:</strong>
		<input type="text" bind:value={btcPublicKey} readonly />
	</div>
</div>

<div class="form-group">
	<h3>About this tool</h3>
	<p>
		This tool allows you to generate public-private key pairs and addresses for both Bitcoin and
		Ethereum. It operates entirely within your browser, ensuring that no sensitive information is
		sent to any remote servers. You can generate a new set of keys or input your own private key in
		numeric format to see the corresponding public key and address. Please make sure to securely
		store your private key, as it is critical for accessing your cryptocurrency assets.
	</p>
</div>

<AdUnit placement="toolResult" />

<AffiliateBox
	heading="Storing real crypto? Use a hardware wallet"
	intro="This tool generates keys in your browser — perfect for learning and testing, but not safe for real funds. For actual crypto, use a hardware wallet that creates and stores keys offline:"
	items={[
		{
			label: 'Ledger hardware wallets',
			url: amazonSearch('Ledger hardware wallet'),
			note: 'offline key storage'
		},
		{
			label: 'Trezor hardware wallets',
			url: amazonSearch('Trezor hardware wallet'),
			note: 'open-source firmware'
		}
	]}
/>

<RelatedTools tool="key-generation" heading="Next steps with your key pair" />

<div class="description">
	<h3>Outputs:</h3>
	<ol>
		<li>
			<strong>Private Keys (HEX & WIF):</strong> Ethereum Private Key in HEX format, Bitcoin Private Key
			in WIF format.
		</li>
		<li>
			<strong>Bitcoin Address:</strong> Derived by first taking the SHA-256 hash of the public key, followed
			by the RIPEMD-160 hash, and then Base58Check encoded.
		</li>
		<li>
			<strong>Ethereum Address:</strong> Derived by taking the Keccak-256 hash of the public key and using
			the last 20 bytes.
		</li>
	</ol>

	<h3>Frequently Asked Questions</h3>
	<dl>
		<dt>Are the keys generated on a server?</dt>
		<dd>No. Key generation runs locally in your browser.</dd>
		<dt>Can I enter my own private key?</dt>
		<dd>
			Yes. You can paste a numeric private key to derive the matching public keys and addresses.
		</dd>
		<dt>Should I use generated keys for real funds?</dt>
		<dd>
			Only if you fully trust your device and environment. For production wallets, hardware-backed
			flows are safer.
		</dd>
	</dl>
</div>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background-color: var(--bg-2);
		color: var(--fg-1);
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 8px;
	}

	input,
	button {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
		border-radius: 4px;
		border: 1px solid var(--bg-3);
		font-size: 1em;
		background-color: var(--bg-1);
		color: var(--fg-1);
	}

	input[readonly] {
		background-color: var(--bg-2);
		color: var(--fg-1);
	}

	button {
		border: none;
		background-color: var(--link);
		color: var(--bg-1);
		cursor: pointer;
	}

	ol {
		padding-left: 20px;
	}

	h3 {
		margin-bottom: 15px;
	}

	p {
		margin-bottom: 10px;
	}

	div > div {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
