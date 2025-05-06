<script lang="ts">
	import { t } from 'svelte-i18n';
</script>

<nav>
	<button class="menu-toggle" aria-label="Toggle navigation">☰</button>
	<div class="nav-links">
		<a href="/">Home</a>
		<a href="/encryption">Encryption</a>
		<a href="/decryption">Decryption</a>
		<a href="/encoding-decoding">Encoding</a>
		<a href="/hashing">Hashing</a>
		<a href="/compression">Compression</a>
		<a href="/key-generation">Key Generation</a>
		<a href="/qrcode">QR Code Generator</a>
		<a href="/currency">Currency</a>
		<a href="/reverse-text">Reverse Text</a>
		<a href="/letter-case">Letter Case</a>
		<a href="/text-analyzer">Text Analyzer</a>
	</div>
</nav>
<slot />
