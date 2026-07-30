<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { AD_CLIENT, getAdSlot, type AdPlacement } from '$lib/ads';

	export let placement: AdPlacement;
	export let label = 'Advertisement';

	const slot = getAdSlot(placement);
	const configured = slot.length > 0;

	onMount(() => {
		if (!configured) return;
		try {
			const w = window as unknown as { adsbygoogle?: unknown[] };
			(w.adsbygoogle = w.adsbygoogle || []).push({});
		} catch {
			// Ad blocker or loader not ready yet — safe to ignore.
		}
	});
</script>

{#if configured}
	<aside class="ad-slot" aria-label={label}>
		<ins
			class="adsbygoogle"
			style="display:block"
			data-ad-client={AD_CLIENT}
			data-ad-slot={slot}
			data-ad-format="auto"
			data-full-width-responsive="true"
		></ins>
	</aside>
{:else if dev}
	<aside class="ad-slot ad-placeholder" aria-label="Ad placeholder">
		<span>Ad slot &ldquo;{placement}&rdquo; — set its id in src/lib/ads.ts</span>
	</aside>
{/if}

<style>
	.ad-slot {
		display: block;
		margin: 24px auto;
		max-width: 1200px;
		min-height: 90px;
	}

	.ad-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px dashed var(--bg-3);
		border-radius: 8px;
		background: var(--bg-2);
		color: var(--fg-2);
		font-size: 0.85rem;
		padding: 12px;
		text-align: center;
	}
</style>
