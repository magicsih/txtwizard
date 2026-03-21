<script lang="ts">
	import { page } from '$app/stores';
	import { t } from 'svelte-i18n';

	export let data: {
		buildInfo: {
			buildNumber: string | number;
			date: string;
		};
	};

	let isNavOpen = false;

	const navItems = [
		{ href: '/', label: 'home' },
		{ href: '/encryption', label: 'encryption' },
		{ href: '/decryption', label: 'decryption' },
		{ href: '/encoding-decoding', label: 'encoding' },
		{ href: '/analyzer', label: 'analyzer' },
		{ href: '/date-calculator', label: 'date-calculator' },
		{ href: '/hashing', label: 'hashing' },
		{ href: '/password-generator', label: 'password-generator' },
		{ href: '/compression', label: 'compression' },
		{ href: '/key-generation', label: 'keygen' },
		{ href: '/qrcode', label: 'qr-code-gen' },
		{ href: '/comparison', label: 'comparison' },
		{ href: '/minifier', label: 'code-minifier' }
	];

	$: if ($page.url.pathname) {
		isNavOpen = false;
	}

	function toggleNav() {
		isNavOpen = !isNavOpen;
	}

	function closeNav() {
		isNavOpen = false;
	}
</script>

<nav class:open={isNavOpen}>
	<a class="brand" href="/" on:click={closeNav}>
		<span class="brand-mark">TW</span>
		<span class="brand-text">TxtWizard</span>
	</a>
	<button
		class="menu-toggle"
		type="button"
		aria-label="Toggle navigation"
		aria-expanded={isNavOpen}
		aria-controls="site-nav"
		on:click={toggleNav}>Menu</button
	>
	<div class="nav-links" id="site-nav">
		{#each navItems as item}
			<a
				href={item.href}
				aria-current={$page.url.pathname === item.href ? 'page' : undefined}
				on:click={closeNav}>{$t(item.label)}</a
			>
		{/each}
	</div>
</nav>
<slot />

<footer class="sticky-footer">
	<div class="footer-content">
		<p>
			&copy; {new Date().getFullYear()} TxtWizard<br />
			<small>
				Build #{data.buildInfo.buildNumber} | Deployed at {data.buildInfo.date}<br />
				If you need a feature, please
				<a
					href="https://github.com/magicsih/txtwizard/issues"
					target="_blank"
					rel="noopener noreferrer">open an issue</a
				>
				or
				<a
					href="https://github.com/magicsih/txtwizard/pulls"
					target="_blank"
					rel="noopener noreferrer">create a PR</a
				>
				on
				<a href="https://github.com/magicsih/txtwizard" target="_blank" rel="noopener noreferrer"
					>GitHub</a
				>.
			</small>
		</p>
	</div>
</footer>

<style>
	nav {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		color: inherit;
		text-decoration: none;
		font-weight: 700;
	}

	.brand-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 0.75rem;
		background: linear-gradient(135deg, #0e4d8b, #3e8e41);
		color: white;
		font-size: 0.82rem;
		letter-spacing: 0.03em;
	}

	.brand-text {
		font-size: 1.02rem;
		letter-spacing: -0.02em;
	}

	.nav-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		align-items: center;
	}

	.nav-links a {
		padding: 0.35rem 0;
	}

	@media (max-width: 768px) {
		nav {
			grid-template-columns: auto auto;
			justify-content: space-between;
		}

		.nav-links {
			display: none;
			grid-column: 1 / -1;
			flex-direction: column;
			align-items: flex-start;
		}

		nav.open .nav-links {
			display: flex;
		}
	}
</style>
