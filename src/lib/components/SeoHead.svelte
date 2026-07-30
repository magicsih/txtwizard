<script lang="ts">
	export let title: string;
	export let description: string;
	export let path = '/';
	export let type: 'website' | 'article' = 'website';
	export let structuredData: Record<string, unknown> | Array<Record<string, unknown>> | null = null;
	// Social share image. Drop a 1200x630 PNG at static/og-image.png to override
	// the default (favicon) with a proper Open Graph card.
	export let image: string | null = null;

	const siteName = 'TxtWizard';
	const siteUrl = 'https://www.txtwizard.net';

	$: normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '');
	$: canonicalUrl = `${siteUrl}${normalizedPath}`;
	$: imageUrl = `${siteUrl}${image ?? '/favicon.png'}`;
	// Escape "<" so a value can never break out of the closing script tag.
	$: structuredDataJson = structuredData
		? JSON.stringify(structuredData).replace(/</g, '\\u003c')
		: '';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	{#if structuredDataJson}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${structuredDataJson}<\/script>`}
	{/if}
</svelte:head>
