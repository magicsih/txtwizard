<script lang="ts">
	import { t } from 'svelte-i18n';
</script>
<nav>
	<button class="menu-toggle" aria-label="Toggle navigation">☰</button>
	<div class="nav-links">
		<a href="/">{$t('home')}</a>
		<a href="/encryption">{$t('encryption')}</a>
		<a href="/decryption">{$t('decryption')}</a>
		<a href="/encoding-decoding">{$t('encoding')}</a>
		<a href="/hashing">{$t('hashing')}</a>
		<a href="/compression">{$t('compression')}</a>
		<a href="/key-generation">{$t('keygen')}</a>
		<a href="/merge-text">{$t('merge-text')}</a>
		<a href="/qrcode">{$t('qr-code-gen')}</a>
		<a href="/currency">{$t('currency')}</a>
		<a href="/reverse-text">Reverse Text</a>
		<a href="/letter-case">Letter Case</a>
		<a href="/text-analyzer">Text Analyzer</a>
	</div>
</nav>
<slot />