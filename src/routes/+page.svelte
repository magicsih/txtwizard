<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import './+page.css';

	const featuredTools = [
		{
			href: '/compression',
			titleKey: 'compression',
			descriptionKey: 'compression-intro',
			kicker: 'Top Traffic'
		},
		{
			href: '/key-generation',
			titleKey: 'keygen',
			descriptionKey: 'keygen-intro',
			kicker: 'High Intent'
		},
		{
			href: '/decryption',
			titleKey: 'decryption',
			descriptionKey: 'decryption-intro',
			kicker: 'Security'
		}
	] as const;

	const toolGroups = [
		{
			title: 'Security',
			tools: [
				{ href: '/encryption', titleKey: 'encryption', descriptionKey: 'encryption-intro' },
				{ href: '/decryption', titleKey: 'decryption', descriptionKey: 'decryption-intro' },
				{ href: '/hashing', titleKey: 'hashing', descriptionKey: 'hashing-intro' },
				{ href: '/key-generation', titleKey: 'keygen', descriptionKey: 'keygen-intro' },
				{
					href: '/password-generator',
					titleKey: 'password-generator',
					descriptionKey: 'generate-password'
				}
			]
		},
		{
			title: 'Text',
			tools: [
				{
					href: '/encoding-decoding',
					titleKey: 'encoding',
					descriptionKey: 'encoding-intro',
					titleSuffix: ' & Decoding'
				},
				{ href: '/comparison', titleKey: 'comparison', descriptionKey: 'text-comparison' },
				{ href: '/analyzer', titleKey: 'analyzer', descriptionKey: 'input-text' },
				{ href: '/date-calculator', titleKey: 'date-calculator', descriptionKey: 'date_difference' }
			]
		},
		{
			title: 'Utilities',
			tools: [
				{ href: '/compression', titleKey: 'compression', descriptionKey: 'compression-intro' },
				{ href: '/qrcode', titleKey: 'qr-code-gen', descriptionKey: 'qr-code-intro' },
				{ href: '/minifier', titleKey: 'code-minifier', descriptionKey: 'code-minifier-intro' }
			]
		}
	] as const;

	const homeDescription =
		'Browser-based tools for encryption, decryption, compression, hashing, QR code generation, and text utilities.';

	const homeStructuredData = [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'TxtWizard',
			url: 'https://www.txtwizard.net/',
			description: homeDescription
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: 'TxtWizard',
			url: 'https://www.txtwizard.net/',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Any',
			browserRequirements: 'Requires a modern web browser',
			description: homeDescription,
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		}
	];
</script>

<SeoHead
	title="TxtWizard | Browser-Based Text and Security Tools"
	description={homeDescription}
	structuredData={homeStructuredData}
/>

<main>
	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow">Browser-Only Utilities</p>
			<h1>{$t('welcome-to-txtwizard')}</h1>
			<p class="hero-text">
				{$t('txtwizard-intro')}
			</p>
			<div class="hero-actions">
				<a class="primary-action" href="/compression">{$t('compression')} {$t('tool')}</a>
				<a class="secondary-action" href="/key-generation">{$t('keygen')} {$t('tool')}</a>
			</div>
		</div>

		<div class="hero-panel">
			<p class="panel-label">Most Used</p>
			<div class="hero-stack">
				{#each featuredTools as tool}
					<a class="hero-card" href={tool.href}>
						<span class="kicker">{tool.kicker}</span>
						<strong>{$t(tool.titleKey)} {$t('tool')}</strong>
						<span>{$t(tool.descriptionKey)}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="tool-groups">
		<h2>{$t('our-tools')}</h2>

		{#each toolGroups as group}
			<div class="group">
				<div class="group-header">
					<h3>{group.title}</h3>
				</div>
				<div class="tool-grid">
					{#each group.tools as tool}
						<a class="tool-card" href={tool.href}>
							<div class="tool-card-top">
								<strong>
									{$t(tool.titleKey)}{tool.titleSuffix ?? ` ${$t('tool')}`}
								</strong>
							</div>
							<p>{$t(tool.descriptionKey)}</p>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</section>
</main>
