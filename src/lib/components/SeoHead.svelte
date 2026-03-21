<script lang="ts">
	export let title: string;
	export let description: string;
	export let path = '/';
	export let type: 'website' | 'article' = 'website';
	export let structuredData: Record<string, unknown> | Array<Record<string, unknown>> | null = null;

	const siteName = 'TxtWizard';
	const siteUrl = 'https://www.txtwizard.net';

	$: normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '');
	$: canonicalUrl = `${siteUrl}${normalizedPath}`;
	$: structuredDataJson = structuredData ? JSON.stringify(structuredData) : '';
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
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if structuredDataJson}
		<script type="application/ld+json">{structuredDataJson}</script>
	{/if}
</svelte:head>
