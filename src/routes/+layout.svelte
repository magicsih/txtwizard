<script lang="ts">
	import { t } from 'svelte-i18n';

	export let data: {
		buildInfo: {
			buildNumber: string | number;
			date: string;
		};
	};
</script>

<nav>
	<button class="menu-toggle" aria-label="Toggle navigation">☰</button>
	<div class="nav-links">
		<a href="/">{$t('home')}</a>
		<a href="/encryption">{$t('encryption')}</a>
		<a href="/decryption">{$t('decryption')}</a>
		<a href="/encoding-decoding">{$t('encoding')}</a>
		<a href="/analyzer">{$t('analyzer')}</a>
		<a href="/hashing">{$t('hashing')}</a>
		<a href="/password-generator">{$t('password-generator')}</a>
		<a href="/compression">{$t('compression')}</a>
		<a href="/key-generation">{$t('keygen')}</a>
		<a href="/qrcode">{$t('qr-code-gen')}</a>
		<a href="/currency">{$t('currency')}</a>
		<a href="/comparison">{$t('comparison')}</a>
	</div>
</nav>
<slot />

<footer class="sticky-footer">
	<div class="footer-content">
		<p>
			&copy; {new Date().getFullYear()} TxtWizard<br />
			<small>
				Build #{data.buildInfo.buildNumber} | Deployed at {data.buildInfo.date}<br />
				If you need a feature, please
				<a
					href="https://github.com/magicsih/txtwizard/issues"
					target="_blank"
					rel="noopener noreferrer">open an issue</a
				>
				or
				<a
					href="https://github.com/magicsih/txtwizard/pulls"
					target="_blank"
					rel="noopener noreferrer">create a PR</a
				>
				on
				<a href="https://github.com/magicsih/txtwizard" target="_blank" rel="noopener noreferrer"
					>GitHub</a
				>.
			</small>
		</p>
	</div>
</footer>
