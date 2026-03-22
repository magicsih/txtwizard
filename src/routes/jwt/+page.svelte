<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { Buffer } from 'buffer';
	import { t } from 'svelte-i18n';
	import {
		formatJson,
		generateJwt,
		inspectRegisteredClaims,
		parseJsonObject,
		parseJwt,
		verifyJwtSignature,
		type ClaimStatus,
		type JwtAlgorithm,
		type JwtSecretEncoding,
		type ParsedJwt
	} from '$lib/utils/jwt';

	const generatorAlgorithms: JwtAlgorithm[] = [
		'HS256',
		'HS384',
		'HS512',
		'RS256',
		'RS384',
		'RS512',
		'PS256',
		'PS384',
		'PS512',
		'ES256',
		'ES384',
		'ES512',
		'none'
	];

	let generatorAlgorithm: JwtAlgorithm = 'HS256';
	let generatorSecretEncoding: JwtSecretEncoding = 'utf-8';
	let generatorKey = '';
	let issuer = '';
	let subject = '';
	let audience = '';
	let jwtId = '';
	let generatorHeaderText = JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2);
	let generatorPayloadText = JSON.stringify(
		{
			sub: '1234567890',
			name: 'John Doe',
			admin: true,
			iat: Math.floor(Date.now() / 1000)
		},
		null,
		2
	);
	let generatorStatus = '';
	let generatorTone: 'neutral' | 'success' | 'danger' | 'warning' = 'neutral';
	let token = '';
	let parsed: ParsedJwt | null = null;
	let parseError = '';
	let verificationKey = '';
	let secretEncoding: JwtSecretEncoding = 'utf-8';
	let verificationStatus: 'idle' | 'running' | 'done' = 'idle';
	let verificationResult = '';
	let verificationTone: 'neutral' | 'success' | 'danger' | 'warning' = 'neutral';
	let claimStatuses: ClaimStatus[] = [];

	function syncGeneratorHeaderAlgorithm() {
		try {
			const header = parseJsonObject(generatorHeaderText, 'JWT header');
			generatorHeaderText = JSON.stringify(
				{
					...header,
					alg: generatorAlgorithm,
					typ: typeof header.typ === 'string' ? header.typ : 'JWT'
				},
				null,
				2
			);
		} catch {
			generatorHeaderText = JSON.stringify({ alg: generatorAlgorithm, typ: 'JWT' }, null, 2);
		}
	}

	function decodeToken() {
		verificationStatus = 'idle';
		verificationResult = '';
		verificationTone = 'neutral';

		if (!token.trim()) {
			parsed = null;
			parseError = '';
			claimStatuses = [];
			return;
		}

		try {
			parsed = parseJwt(token);
			parseError = '';
			claimStatuses = inspectRegisteredClaims(parsed.payload);
		} catch (error) {
			parsed = null;
			claimStatuses = [];
			parseError = error instanceof Error ? error.message : 'Failed to decode JWT.';
		}
	}

	function getVerificationInputMode() {
		const algorithm = typeof parsed?.header.alg === 'string' ? parsed.header.alg : '';

		if (algorithm.startsWith('HS')) {
			return 'secret';
		}

		if (algorithm === 'none') {
			return 'none';
		}

		// Known supported public-key algorithms: RS*, PS*, ES*
		if (algorithm.startsWith('RS') || algorithm.startsWith('PS') || algorithm.startsWith('ES')) {
			return 'public-key';
		}

		if (algorithm) {
			// Non-empty but not supported: treat as unsupported to avoid misleading UI
			return 'unsupported';
		}
		return 'unknown';
	}

	$: verificationInputMode = getVerificationInputMode();

	function getGeneratorInputMode() {
		if (generatorAlgorithm.startsWith('HS')) {
			return 'secret';
		}

		if (generatorAlgorithm === 'none') {
			return 'none';
		}

		return 'private-key';
	}

	function generateRandomSecret() {
		const randomBytes = new Uint8Array(32);
		crypto.getRandomValues(randomBytes);

		if (generatorSecretEncoding === 'utf-8') {
			const alphabet =
				'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
			generatorKey = Array.from(randomBytes, (value) => alphabet[value % alphabet.length]).join('');
			return;
		}

		generatorKey = Buffer.from(randomBytes).toString(generatorSecretEncoding);
	}

	function applyTimeClaimsPreset(durationMinutes: number) {
		try {
			const payload = parseJsonObject(generatorPayloadText, 'JWT payload');
			const now = Math.floor(Date.now() / 1000);
			const nextPayload = {
				...payload,
				iat: now,
				nbf: now,
				exp: now + durationMinutes * 60
			};

			generatorPayloadText = JSON.stringify(nextPayload, null, 2);
			generatorStatus = `Applied iat/nbf/exp preset for ${durationMinutes} minute token lifetime.`;
			generatorTone = 'success';
		} catch (error) {
			generatorStatus =
				error instanceof Error ? error.message : 'Failed to apply time claims preset.';
			generatorTone = 'danger';
		}
	}

	function applyRegisteredClaims() {
		try {
			const payload = parseJsonObject(generatorPayloadText, 'JWT payload');
			const nextPayload = { ...payload };

			assignOrDelete(nextPayload, 'iss', issuer);
			assignOrDelete(nextPayload, 'sub', subject);
			assignOrDelete(nextPayload, 'aud', audience);
			assignOrDelete(nextPayload, 'jti', jwtId);

			generatorPayloadText = JSON.stringify(nextPayload, null, 2);
			generatorStatus = 'Applied registered claims to payload JSON.';
			generatorTone = 'success';
		} catch (error) {
			generatorStatus =
				error instanceof Error ? error.message : 'Failed to apply registered claims.';
			generatorTone = 'danger';
		}
	}

	async function handleGenerate() {
		try {
			const header = parseJsonObject(generatorHeaderText, 'JWT header');
			const payload = parseJsonObject(generatorPayloadText, 'JWT payload');
			const result = await generateJwt({
				header: {
					...header,
					alg: generatorAlgorithm,
					typ: typeof header.typ === 'string' ? header.typ : 'JWT'
				},
				payload,
				key: generatorKey,
				secretEncoding: generatorSecretEncoding
			});

			token = result.token;
			generatorStatus = 'JWT generated and loaded into the decoder below.';
			generatorTone = 'success';
			decodeToken();
		} catch (error) {
			generatorStatus = error instanceof Error ? error.message : 'Failed to generate JWT.';
			generatorTone = 'danger';
		}
	}

	async function handleVerify() {
		if (!parsed) {
			return;
		}

		verificationStatus = 'running';

		try {
			const result = await verifyJwtSignature({
				token,
				key: verificationKey,
				secretEncoding
			});
			verificationResult = result.message;
			verificationTone =
				result.status === 'valid'
					? 'success'
					: result.status === 'invalid'
						? 'danger'
						: result.status === 'missing-key'
							? 'warning'
							: 'neutral';
		} catch (error) {
			verificationResult =
				error instanceof Error ? error.message : 'Verification failed unexpectedly.';
			verificationTone = 'danger';
		} finally {
			verificationStatus = 'done';
		}
	}

	function formatClaimValue(value: unknown): string {
		if (value === null || value === undefined) {
			return '-';
		}

		if (typeof value === 'string') {
			return value;
		}

		return JSON.stringify(value);
	}

	function assignOrDelete(target: Record<string, unknown>, key: string, value: string) {
		const trimmedValue = value.trim();
		if (trimmedValue) {
			target[key] = trimmedValue;
			return;
		}

		delete target[key];
	}

	const pageTitle = 'TxtWizard | Free Online JWT Decoder, Generator, and Verification Viewer';
	const pageDescription =
		'Generate JWTs, decode headers and claims, inspect exp/nbf/iat, and verify HS, RS, PS, or ES signatures directly in your browser.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/jwt" />

<svelte:head>
	<meta name="robots" content="index,follow" />
</svelte:head>

<h1>{$t('jwt')} {$t('tool')}</h1>

<div class="page-shell">
	<section class="panel">
		<div class="panel-header">
			<h2>JWT Generator</h2>
			<p>Create a token from editable header and payload JSON, then inspect it immediately below.</p>
		</div>

		<div class="generator-top">
			<div>
				<label for="generator-algorithm">Algorithm</label>
				<select
					id="generator-algorithm"
					bind:value={generatorAlgorithm}
					on:change={syncGeneratorHeaderAlgorithm}
				>
					{#each generatorAlgorithms as algorithm}
						<option value={algorithm}>{algorithm}</option>
					{/each}
				</select>
			</div>

			{#if getGeneratorInputMode() === 'secret'}
				<div>
					<label for="generator-secret-encoding">Secret Encoding</label>
					<select id="generator-secret-encoding" bind:value={generatorSecretEncoding}>
						<option value="utf-8">UTF-8 text</option>
						<option value="base64">Base64</option>
						<option value="hex">Hex</option>
					</select>
				</div>
			{/if}
		</div>

		{#if getGeneratorInputMode() === 'secret'}
			<label for="generator-secret">Shared Secret</label>
			<div class="inline-action-field">
				<input
					id="generator-secret"
					type="text"
					bind:value={generatorKey}
					placeholder="Enter the HMAC secret"
				/>
				<button type="button" class="secondary-button" on:click={generateRandomSecret}
					>Random Secret</button
				>
			</div>
		{:else if getGeneratorInputMode() === 'private-key'}
			<label for="generator-private-key">Private Key (PKCS#8 PEM)</label>
			<textarea
				id="generator-private-key"
				rows="8"
				bind:value={generatorKey}
				placeholder="-----BEGIN PRIVATE KEY-----"
			></textarea>
		{:else}
			<p class="notice">`alg=none` creates an unsigned token with an empty signature segment.</p>
		{/if}

		<div class="panel-grid">
			<section>
				<label for="generator-header">Header JSON</label>
				<textarea id="generator-header" rows="12" bind:value={generatorHeaderText}></textarea>
			</section>

			<section>
				<h3 class="section-title">Registered Claims</h3>
				<div class="claims-form">
					<input type="text" bind:value={issuer} placeholder="iss (issuer)" aria-label="Issuer (iss)" />
					<input type="text" bind:value={subject} placeholder="sub (subject)" aria-label="Subject (sub)" />
					<input type="text" bind:value={audience} placeholder="aud (audience)" aria-label="Audience (aud)" />
					<input type="text" bind:value={jwtId} placeholder="jti (JWT ID)" aria-label="JWT ID (jti)" />
				</div>
				<div class="preset-row">
					<button type="button" class="secondary-button" on:click={applyRegisteredClaims}
						>Apply Claims</button
					>
				</div>

				<label for="generator-payload">Payload JSON</label>
				<div class="preset-row">
					<button type="button" class="secondary-button" on:click={() => applyTimeClaimsPreset(5)}
						>5m Claims</button
					>
					<button type="button" class="secondary-button" on:click={() => applyTimeClaimsPreset(60)}
						>60m Claims</button
					>
					<button
						type="button"
						class="secondary-button"
						on:click={() => applyTimeClaimsPreset(60 * 24)}
					>
						24h Claims
					</button>
				</div>
				<textarea id="generator-payload" rows="12" bind:value={generatorPayloadText}></textarea>
			</section>
		</div>

		<div class="actions">
			<button on:click={handleGenerate}>Generate JWT</button>
		</div>

		{#if generatorStatus}
			<p class={`notice ${generatorTone}`}>{generatorStatus}</p>
		{/if}
	</section>

	<section class="panel">
		<div class="panel-header">
			<h2>JWT Input</h2>
			<p>Paste a compact JWT to inspect its header, claims, and signature state.</p>
		</div>

		<label for="jwt-input">Token</label>
		<textarea
			id="jwt-input"
			rows="7"
			bind:value={token}
			on:input={decodeToken}
			placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
		></textarea>

		{#if parseError}
			<p class="notice danger">{parseError}</p>
		{:else if parsed}
			<div class="stats-grid">
				<div class="stat-card">
					<span>Algorithm</span>
					<strong>{typeof parsed.header.alg === 'string' ? parsed.header.alg : 'Unknown'}</strong>
				</div>
				<div class="stat-card">
					<span>Type</span>
					<strong>{typeof parsed.header.typ === 'string' ? parsed.header.typ : 'JWT'}</strong>
				</div>
				<div class="stat-card">
					<span>Segments</span>
					<strong>3</strong>
				</div>
				<div class="stat-card">
					<span>Signature Bytes</span>
					<strong>{parsed.signature.length}</strong>
				</div>
			</div>
		{/if}
	</section>

	{#if parsed}
		<section class="panel">
			<div class="panel-header">
				<h2>Verification</h2>
				<p>
					{#if verificationInputMode === 'secret'}
						Use the same shared secret that signed this token.
					{:else if verificationInputMode === 'public-key'}
						Provide a PEM-encoded public key for asymmetric verification.
					{:else if verificationInputMode === 'none'}
						This token does not require signature verification.
					{:else if verificationInputMode === 'unsupported'}
						This algorithm is not supported by this tool and cannot be verified here.
					{:else}
						Parse a JWT token to enable verification.
					{/if}
				</p>
			</div>

			{#if verificationInputMode === 'secret'}
				<label for="secret-encoding">Secret Encoding</label>
				<select id="secret-encoding" bind:value={secretEncoding}>
					<option value="utf-8">UTF-8 text</option>
					<option value="base64">Base64</option>
					<option value="hex">Hex</option>
				</select>

				<label for="verification-secret">Shared Secret</label>
				<input
					id="verification-secret"
					type="text"
					bind:value={verificationKey}
					placeholder="Enter the HMAC secret"
				/>
			{:else if verificationInputMode === 'public-key'}
				<label for="verification-key">Public Key (PEM)</label>
				<textarea
					id="verification-key"
					rows="8"
					bind:value={verificationKey}
					placeholder="-----BEGIN PUBLIC KEY-----"
				></textarea>
			{:else if verificationInputMode === 'none'}
				<p class="notice">Unsigned `alg=none` tokens can be decoded, but there is no signature to verify.</p>
			{:else if verificationInputMode === 'unsupported'}
				<p class="notice">This algorithm is not supported by this tool. Signature verification is unavailable.</p>
			{:else}
				<p class="notice">Unknown algorithm. Signature verification is unavailable.</p>
			{/if}

			<div class="actions">
				<button on:click={handleVerify} disabled={verificationStatus === 'running' || verificationInputMode === 'unsupported' || verificationInputMode === 'unknown'}>
					{verificationStatus === 'running' ? 'Verifying...' : 'Verify Signature'}
				</button>
			</div>

			{#if verificationResult}
				<p class={`notice ${verificationTone}`}>{verificationResult}</p>
			{/if}
		</section>

		<section class="panel-grid">
			<section class="panel">
				<div class="panel-header">
					<h2>Header</h2>
					<p>Decoded JOSE header fields.</p>
				</div>
				<pre>{formatJson(parsed.header)}</pre>
			</section>

			<section class="panel">
				<div class="panel-header">
					<h2>Payload</h2>
					<p>Decoded claims from the JWT body.</p>
				</div>
				<pre>{formatJson(parsed.payload)}</pre>
			</section>
		</section>

		<section class="panel">
			<div class="panel-header">
				<h2>Registered Claims</h2>
				<p>Quick status for common time-based claims.</p>
			</div>

			{#if claimStatuses.length > 0}
				<div class="claim-table">
					<div class="claim-row claim-head">
						<span>Claim</span>
						<span>Value</span>
						<span>ISO Time</span>
						<span>Status</span>
					</div>
					{#each claimStatuses as claim}
						<div class="claim-row">
							<span>{claim.name}</span>
							<span>{claim.value}</span>
							<span>{claim.iso}</span>
							<span class={`claim-status ${claim.status}`}>{claim.message}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="notice">No numeric `exp`, `nbf`, or `iat` claims were found.</p>
			{/if}
		</section>

		<section class="panel">
			<div class="panel-header">
				<h2>Common Claims Snapshot</h2>
				<p>Frequently inspected fields at a glance.</p>
			</div>

			<div class="snapshot-grid">
				<div class="snapshot-card">
					<span>Issuer</span>
					<strong>{formatClaimValue(parsed.payload.iss)}</strong>
				</div>
				<div class="snapshot-card">
					<span>Subject</span>
					<strong>{formatClaimValue(parsed.payload.sub)}</strong>
				</div>
				<div class="snapshot-card">
					<span>Audience</span>
					<strong>{formatClaimValue(parsed.payload.aud)}</strong>
				</div>
				<div class="snapshot-card">
					<span>JWT ID</span>
					<strong>{formatClaimValue(parsed.payload.jti)}</strong>
				</div>
			</div>
		</section>
	{/if}
</div>

<div class="description">
	<h3>What this JWT tool does</h3>
	<p>
		This page generates, decodes, and verifies JSON Web Tokens locally in the browser. It shows the
		JOSE header, token claims, and time-based status for `exp`, `nbf`, and `iat`. No token or key
		material is sent to a server.
	</p>

	<h3>Supported signing and verification algorithms</h3>
	<p>
		The page supports unsigned tokens (`none`), HMAC (`HS256`, `HS384`, `HS512`), RSA PKCS#1
		(`RS256`, `RS384`, `RS512`), RSA-PSS (`PS256`, `PS384`, `PS512`), and ECDSA (`ES256`,
		`ES384`, `ES512`).
	</p>

	<h3>When to use it</h3>
	<p>
		Use this tool when you need to create test tokens, inspect API claims, confirm signature
		validity with the right secret or key pair, or quickly check whether a token is expired.
	</p>
</div>

<style>
	.page-shell {
		display: grid;
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.panel-grid,
	.generator-top {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.panel {
		padding: 1.25rem;
		border: 1px solid #d7dee7;
		border-radius: 1rem;
		background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
		box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
	}

	.panel-header h2 {
		margin-bottom: 0.35rem;
	}

	.section-title {
		margin: 0 0 0.75rem;
		font-size: 1rem;
	}

	.panel-header p {
		margin-top: 0;
		color: #4b5563;
	}

	label {
		display: block;
		margin: 1rem 0 0.35rem;
		font-weight: 600;
	}

	textarea,
	input,
	select,
	button {
		width: 100%;
		padding: 0.85rem 0.95rem;
		border: 1px solid #c7d2e0;
		border-radius: 0.8rem;
		font: inherit;
		background: white;
	}

	textarea,
	pre {
		font-family: 'IBM Plex Mono', 'Fira Code', monospace;
		font-size: 0.95rem;
	}

	button {
		width: auto;
		min-width: 12rem;
		border: none;
		background: linear-gradient(135deg, #0b5cad, #157f5f);
		color: white;
		font-weight: 700;
		cursor: pointer;
	}

	.inline-action-field {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
	}

	.preset-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.claims-form {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		margin-bottom: 0.75rem;
	}

	.secondary-button {
		background: #e8eef7;
		color: #183b63;
		border: 1px solid #c7d2e0;
	}

	button:disabled {
		opacity: 0.7;
		cursor: progress;
	}

	pre {
		margin: 0;
		padding: 1rem;
		border-radius: 0.85rem;
		background: #0f172a;
		color: #dbeafe;
		overflow-x: auto;
	}

	.actions {
		margin-top: 1rem;
	}

	.notice {
		margin-top: 1rem;
		padding: 0.85rem 1rem;
		border-radius: 0.8rem;
		background: #eef4ff;
		color: #183b63;
	}

	.notice.success {
		background: #e9f9ef;
		color: #0f6a35;
	}

	.notice.warning {
		background: #fff8e8;
		color: #8a5a00;
	}

	.notice.danger {
		background: #fff0ef;
		color: #a11d2b;
	}

	.stats-grid,
	.snapshot-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		margin-top: 1rem;
	}

	.stat-card,
	.snapshot-card {
		padding: 1rem;
		border-radius: 0.85rem;
		background: white;
		border: 1px solid #d7dee7;
	}

	.stat-card span,
	.snapshot-card span {
		display: block;
		color: #64748b;
		font-size: 0.85rem;
	}

	.stat-card strong,
	.snapshot-card strong {
		display: block;
		margin-top: 0.35rem;
		word-break: break-word;
	}

	.claim-table {
		display: grid;
		gap: 0.5rem;
	}

	.claim-row {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: 80px 120px minmax(220px, 1fr) minmax(180px, 1fr);
		padding: 0.85rem 1rem;
		border-radius: 0.8rem;
		background: white;
		border: 1px solid #d7dee7;
		align-items: center;
	}

	.claim-head {
		background: #edf4ff;
		font-weight: 700;
	}

	.claim-status.valid {
		color: #166534;
	}

	.claim-status.expired,
	.claim-status.not-yet-valid,
	.claim-status.future-issued {
		color: #a11d2b;
	}

	@media (max-width: 900px) {
		.inline-action-field {
			grid-template-columns: 1fr;
		}

		.claim-row {
			grid-template-columns: 1fr;
		}
	}
</style>
