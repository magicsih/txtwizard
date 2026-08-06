<script lang="ts">
	import { t } from 'svelte-i18n';
	import { getRelatedTools } from '$lib/related-tools';
	import { trackToolsUsageEvent } from '$lib/utils/analytics';

	/** Route name of the current tool, e.g. "compression". */
	export let tool: string;
	export let heading = 'Continue with';

	$: related = getRelatedTools(tool);

	function handleClick(targetHref: string) {
		trackToolsUsageEvent(tool, 'related_tool_click', { target_tool: targetHref });
	}
</script>

{#if related.length > 0}
	<nav class="related" aria-label="Related tools">
		<h3>{heading}</h3>
		<ul>
			{#each related as item}
				<li>
					<a href={item.href} on:click={() => handleClick(item.href)}>
						<span class="name">{$t(item.labelKey)}</span>
						<span class="blurb">{item.blurb}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.related {
		margin: 24px auto;
		max-width: 1200px;
	}

	.related h3 {
		margin: 0 0 12px;
	}

	.related ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.related a {
		display: block;
		height: 100%;
		padding: 14px 16px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background-color: var(--bg-2);
		color: inherit;
		text-decoration: none;
	}

	.related a:hover,
	.related a:focus-visible {
		border-color: var(--link);
	}

	.name {
		display: block;
		font-weight: 700;
		color: var(--link);
	}

	.blurb {
		display: block;
		margin-top: 4px;
		font-size: 0.9rem;
		color: var(--fg-2);
	}
</style>
