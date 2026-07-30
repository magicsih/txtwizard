<script lang="ts">
	import { AMAZON_DISCLOSURE, type AffiliateItem } from '$lib/affiliate';

	export let heading: string;
	export let intro: string;
	export let items: AffiliateItem[];
</script>

<aside class="affiliate" aria-label="Recommended products">
	<h3>{heading}</h3>
	<p class="intro">{intro}</p>
	<ul>
		{#each items as item}
			<li>
				<a href={item.url} target="_blank" rel="nofollow sponsored noopener">{item.label}</a>{#if item.note}<span
						class="note"
					>
						— {item.note}</span
					>{/if}
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
