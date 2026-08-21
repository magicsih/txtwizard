<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { dev } from '$app/environment';
	import { AD_CLIENT, getAdSlot, type AdPlacement } from '$lib/ads';
	import { isLikelyAutomated, trackAnalyticsEvent } from '$lib/utils/analytics';

	export let placement: AdPlacement;
	export let label = 'Advertisement';

	const slot = getAdSlot(placement);
	const hasSlot = slot.length > 0;

	// The <ins> is mounted client-side only, so `isLikelyAutomated()` can read
	// `navigator` first. Keeping the unit out of automated sessions avoids
	// serving impressions to traffic that would count as invalid.
	let render = false;
	let adElement: HTMLElement;

	onMount(() => {
		if (!hasSlot || isLikelyAutomated()) return;

		let disposed = false;
		let statusReported = false;
		let statusObserver: MutationObserver | undefined;
		let statusTimeout: ReturnType<typeof setTimeout> | undefined;

		function sourcePath(): string {
			return window.location.pathname;
		}

		function reportStatus(status: string) {
			if (disposed || statusReported) return;
			statusReported = true;
			trackAnalyticsEvent('ad_slot_status', {
				placement,
				source_path: sourcePath(),
				ad_status: status
			});
			statusObserver?.disconnect();
			if (statusTimeout) clearTimeout(statusTimeout);
		}

		void (async () => {
			render = true;
			// Wait for the <ins> to be in the DOM before AdSense scans for it.
			await tick();
			if (disposed) return;

			trackAnalyticsEvent('ad_slot_rendered', {
				placement,
				source_path: sourcePath()
			});

			if (typeof MutationObserver !== 'undefined') {
				statusObserver = new MutationObserver(() => {
					const status = adElement?.getAttribute('data-ad-status');
					if (status) reportStatus(status);
				});
				statusObserver.observe(adElement, {
					attributes: true,
					attributeFilter: ['data-ad-status']
				});
			}

			try {
				const w = window as unknown as { adsbygoogle?: unknown[] };
				(w.adsbygoogle = w.adsbygoogle || []).push({});
			} catch {
				reportStatus('push_error');
				return;
			}

			const currentStatus = adElement?.getAttribute('data-ad-status');
			if (currentStatus) {
				reportStatus(currentStatus);
				return;
			}

			statusTimeout = setTimeout(() => reportStatus('unresolved'), 10_000);
		})();

		return () => {
			disposed = true;
			statusObserver?.disconnect();
			if (statusTimeout) clearTimeout(statusTimeout);
		};
	});
</script>

{#if render}
	<aside class="ad-slot" aria-label={label}>
		<ins
			bind:this={adElement}
			class="adsbygoogle"
			style="display:block"
			data-ad-client={AD_CLIENT}
			data-ad-slot={slot}
			data-ad-format="auto"
			data-full-width-responsive="true"
		></ins>
	</aside>
{:else if dev && !hasSlot}
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
