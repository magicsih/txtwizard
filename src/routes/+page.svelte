<script lang="ts">
	import { t } from 'svelte-i18n';
	import './+page.css';
</script>

<head>
	<title>{$t('page.title.home')}</title>
	<meta name="description" content={$t('page.description.home')} />
</head>

<body>
	<div class="container">
		<h1>{$t('welcome-to-txtwizard')}</h1>

		<p>
			{$t('txtwizard-intro')}
		</p>

		<h2>{$t('our-tools')}</h2>

		<ul>
			<li>
				<a href="/encryption">{$t('encryption')} {$t('tool')}</a> - {$t('encryption-intro')}
			</li>
			<li>
				<a href="/decryption">{$t('decryption')} {$t('tool')}</a> - {$t('decryption-intro')}
			</li>
			<li>
				<a href="/encoding-decoding">{$t('encoding')} & {$t('decoding')} {$t('tool')}</a> - {$t(
					'encoding-intro'
				)}
			</li>
			<li>
				<a href="/hashing">{$t('hashing')} {$t('tool')}</a> - {$t('hashing-intro')}
			</li>
			<li>
				<a href="/compression">{$t('compression')} {$t('tool')}</a> - {$t('compression-intro')}
			</li>
			<li>
				<a href="/key-generation">{$t('keygen')}
