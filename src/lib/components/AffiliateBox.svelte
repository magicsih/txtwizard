<script lang="ts">
	import { onMount } from 'svelte';
	import { AMAZON_DISCLOSURE, type AffiliateItem } from '$lib/affiliate';
	import { trackAnalyticsEvent } from '$lib/utils/analytics';

	export let heading: string;
	export let intro: string;
	export let items: AffiliateItem[];

	let affiliateElement: HTMLElement;

	function sourcePath(): string {
		return typeof window === 'undefined' ? '' : window.location.pathname;
	}

	onMount(() => {
		if (!affiliateElement || typeof IntersectionObserver === 'undefined') return;

		let impressionTracked = false;
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.some(
					(entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25
				);
				if (!visible || impressionTracked) return;

				impressionTracked = true;
				trackAnalyticsEvent('affiliate_impression', {
					affiliate_partner: 'amazon',
					placement: 'tool_recommendations',
					source_path: sourcePath(),
					item_count: items.length
				});
				observer.disconnect();
			},
			{ threshold: 0.25 }
		);

		observer.observe(affiliateElement);
		return () => observer.disconnect();
	});

	function handleClick(item: AffiliateItem, linkPosition: number) {
		trackAnalyticsEvent('affiliate_click', {
			affiliate_partner: 'amazon',
			placement: 'tool_recommendations',
			source_path: sourcePath(),
			item_label: item.label,
			link_position: linkPosition,
			destination_host: new URL(item.url).hostname,
			transport_type: 'beacon'
		});
	}
</script>

<aside class="affiliate" aria-label="Recommended products" bind:this={affiliateElement}>
	<h3>{heading}</h3>
	<p class="intro">{intro}</p>
	<ul>
		{#each items as item, index (item.url)}
			<li>
				<a
					href={item.url}
					target="_blank"
					rel="nofollow sponsored noopener external"
					on:click={() => handleClick(item, index + 1)}>{item.label}</a
				>{#if item.note}<span class="note"> — {item.note}</span>{/if}
			</li>
		{/each}
	</ul>
	<p class="disclosure">{AMAZON_DISCLOSURE}</p>
</aside>

<style>
	.affiliate {
		margin: 24px auto;
		max-width: 1200px;
		padding: 16px 20px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background-color: var(--bg-2);
		color: var(--fg-1);
	}

	.affiliate h3 {
		margin: 0 0 8px;
	}

	.intro {
		margin: 0 0 12px;
	}

	.affiliate ul {
		margin: 0 0 12px;
		padding-left: 20px;
	}

	.affiliate li {
		margin-bottom: 6px;
	}

	.note {
		color: var(--fg-2);
	}

	.disclosure {
		margin: 0;
		font-size: 0.8rem;
		color: var(--fg-2);
	}
</style>
