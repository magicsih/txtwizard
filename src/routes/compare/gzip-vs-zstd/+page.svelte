<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import AdUnit from '$lib/components/AdUnit.svelte';
	import RelatedTools from '$lib/components/RelatedTools.svelte';

	const pageTitle = 'GZIP vs Zstandard — Which Text Compressor Should You Use? | TxtWizard';
	const pageDescription =
		'A practical comparison of GZIP and Zstandard (zstd): how they differ in speed, compression ratio, memory use, and the right use cases for each in 2026.';

	const faqStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Is Zstandard faster than GZIP?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. Zstandard is typically 2–5× faster than GZIP at similar compression ratios and is also faster to decompress at most levels.'
				}
			},
			{
				'@type': 'Question',
				name: 'Which compresses better, GZIP or Zstandard?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'At default levels Zstandard usually produces output that is 10–30% smaller than GZIP at the same speed, and at higher levels it can match or beat more expensive compressors while staying faster.'
				}
			},
			{
				'@type': 'Question',
				name: 'Is Zstandard widely supported?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes on Linux, in most modern databases (PostgreSQL, ClickHouse, RocksDB), and in browsers via WebAssembly. HTTP content-encoding is still mostly GZIP because Zstandard has not been standardized in HTTP.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I compare GZIP and Zstandard on my own text?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. TxtWizard has a free in-browser compression tool that supports GZIP, Deflate, ZIP, and Zstandard — no upload, runs locally.'
				}
			}
		]
	};
</script>

<SeoHead
	title={pageTitle}
	description={pageDescription}
	path="/compare/gzip-vs-zstd"
	structuredData={faqStructuredData}
/>

<main class="compare-page">
	<header class="compare-hero">
		<p class="eyebrow">Algorithm Comparison</p>
		<h1>GZIP vs Zstandard</h1>
		<p class="lede">
			GZIP has been the default text compressor on the web for 30 years. Zstandard (zstd) is a 2016
			design that gives you most of GZIP's ubiquity plus a noticeably faster compressor and a
			tighter ratio at the same speed. For most new systems the choice between them is no longer
			about ratio — it is about which one your stack already speaks.
		</p>
	</header>

	<AdUnit placement="toolResult" />

	<section aria-label="At a glance">
		<h2>At a glance</h2>
		<div class="table-wrap">
			<table class="compare-table">
				<thead>
					<tr>
						<th scope="col">Property</th>
						<th scope="col">GZIP</th>
						<th scope="col">Zstandard (zstd)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Algorithm core</th>
						<td>DEFLATE (LZ77 + Huffman)</td>
						<td>LZ77 + finite-state entropy + Huffman</td>
					</tr>
					<tr>
						<th scope="row">Compression speed (level 3)</th>
						<td>~120 MB/s</td>
						<td>~450 MB/s (≈3–5× faster)</td>
					</tr>
					<tr>
						<th scope="row">Decompression speed</th>
						<td>~350 MB/s</td>
						<td>~1100 MB/s (≈3× faster)</td>
					</tr>
					<tr>
						<th scope="row">Compression ratio (text)</th>
						<td>Baseline</td>
						<td>10–30% smaller than GZIP at the same speed</td>
					</tr>
					<tr>
						<th scope="row">Memory use</th>
						<td>Low (32 KB window)</td>
						<td>Configurable, low at default levels</td>
					</tr>
					<tr>
						<th scope="row">Streaming support</th>
						<td>Native, gzip members can be concatenated</td>
						<td>Frame-based, supports seeking inside a frame</td>
					</tr>
					<tr>
						<th scope="row">Container format</th>
						<td><code>.gz</code> (RFC 1952)</td>
						<td><code>.zst</code> (RFC 8478)</td>
					</tr>
					<tr>
						<th scope="row">HTTP content-encoding</th>
						<td>Universal (every browser, every server)</td>
						<td>Not standardized; supported client-side and in some CDNs</td>
					</tr>
					<tr>
						<th scope="row">Best for</th>
						<td>HTTP responses, legacy integrations, anywhere only GZIP is allowed</td>
						<td
							>On-disk logs, database compression, service-to-service traffic, anywhere you control
							both ends</td
						>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="speed-note">
			Speed numbers are approximate single-threaded figures on a modern x86 server. Real-world
			results vary with input type, level, and available memory.
		</p>
	</section>

	<section aria-label="GZIP details">
		<h2>How GZIP works</h2>
		<p>
			GZIP wraps the DEFLATE algorithm, which was standardized as RFC 1951 and combined with the
			gzip container in RFC 1952. DEFLATE itself is a combination of two passes:
		</p>
		<ul>
			<li>
				<strong>LZ77</strong> replaces repeated byte sequences with back-references to earlier in the
				stream. This is the heavy lifting for compression ratio.
			</li>
			<li>
				<strong>Huffman coding</strong> then assigns shorter codes to the most frequent symbols so the
				literal/back-reference stream itself is small.
			</li>
		</ul>
		<p>
			The window is fixed at 32 KB, which keeps memory use low and makes GZIP a natural fit for
			streaming. Every modern HTTP client and server can read and write gzip on the fly, which is
			why it has stayed the default HTTP content-encoding for decades.
		</p>
		<p>
			<strong>Pick GZIP when:</strong> the compressed bytes will travel over HTTP, or your stack only
			supports GZIP. For new service-to-service traffic you usually have a choice — and Zstandard is almost
			always the better answer.
		</p>
	</section>

	<section aria-label="Zstandard details">
		<h2>How Zstandard works</h2>
		<p>
			Zstandard (zstd) was published as RFC 8478 in 2018 after about a year of production use at
			Facebook. It keeps the LZ77 backbone but replaces the simple Huffman pass with a two-stage
			coder — a <strong>finite-state entropy</strong> stage followed by a Huffman pass — that gets significantly
			more ratio out of the same kind of work DEFLATE does.
		</p>
		<ul>
			<li>
				<strong>LZ77 with optimal parsing</strong> finds longer matches and better back-reference positions
				than the greedy DEFLATE match finder.
			</li>
			<li>
				<strong>tANS (finite-state entropy)</strong> exploits the byte-level distribution leftover after
				LZ77 in a way Huffman cannot, and is cheap enough to keep on the fast path.
			</li>
			<li>
				<strong>Dictionary compression</strong> is built in, so a small per-dataset dictionary can drop
				the ratio of small records by another 50–70%.
			</li>
		</ul>
		<p>
			Zstandard is also tunable over a much wider range than GZIP — the default level is roughly
			GZIP-equivalent, but you can push to 19+ for archival or drop to 1 for ultra fast compression
			of ephemeral data.
		</p>
		<p>
			<strong>Pick Zstandard when:</strong> you control both ends of the wire. That covers most service-to-service
			traffic, log files, database pages (PostgreSQL and ClickHouse both support it natively), and any
			local archive you would otherwise tar.gz.
		</p>
	</section>

	<section aria-label="When to use each">
		<h2>So which one should I use?</h2>
		<p>
			For browser-to-server HTTP, GZIP is still the default for compatibility. If your CDN or origin
			supports Zstandard (Cloudflare does), turn it on — the bytes saved on the network and the
			latency saved on compression are both real.
		</p>
		<p>
			For everything else, the modern answer is Zstandard. Same speed or faster than GZIP, better
			ratio, dictionary support, and built-in support in the Linux kernel tar, most modern
			databases, and every mainstream language runtime. There is very little reason to keep choosing
			GZIP for new code paths in 2026 unless the bytes need to be readable by something that only
			knows DEFLATE.
		</p>
	</section>

	<section class="cta" aria-label="Try the compression tool">
		<h2>Compare GZIP and Zstandard on your own text</h2>
		<p>
			Paste any text into the compression tool and run it through GZIP and Zstandard side by side.
			The page shows the compressed size in both Base64 and Hex, plus the compression ratio, so you
			can see the actual difference on your own data.
		</p>
		<p>
			<a class="cta-button" href="/compression">Open the compression tool →</a>
		</p>
	</section>

	<RelatedTools tool="compression" />

	<AdUnit placement="toolResult" />
</main>

<style>
	.compare-page {
		max-width: 880px;
		margin: 0 auto;
		padding: 1.5rem 1rem 3rem;
		color: var(--fg-1);
	}

	.compare-hero {
		margin-bottom: 1.5rem;
	}

	.eyebrow {
		display: inline-block;
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		background: rgba(14, 77, 139, 0.08);
		color: #0e4d8b;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.compare-hero h1 {
		margin: 0.6rem 0 0.7rem;
		font-size: clamp(2rem, 4.4vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.lede {
		font-size: 1.05rem;
		line-height: 1.65;
		color: #2a3b50;
		max-width: 60ch;
	}

	.table-wrap {
		overflow-x: auto;
		border: 1px solid var(--bg-3);
		border-radius: 14px;
		background: #fff;
	}

	.compare-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	.compare-table th,
	.compare-table td {
		text-align: left;
		padding: 0.7rem 0.9rem;
		border-bottom: 1px solid var(--bg-3);
		vertical-align: top;
	}

	.compare-table thead th {
		background: var(--bg-2);
		font-weight: 700;
	}

	.compare-table tbody th {
		font-weight: 600;
		width: 30%;
		color: var(--fg-2);
	}

	.compare-table tbody tr:last-child th,
	.compare-table tbody tr:last-child td {
		border-bottom: none;
	}

	.speed-note {
		margin-top: 0.6rem;
		font-size: 0.85rem;
		color: var(--fg-2);
	}

	section + section {
		margin-top: 1.75rem;
	}

	section h2 {
		margin-bottom: 0.6rem;
		font-size: 1.4rem;
		letter-spacing: -0.02em;
	}

	section p,
	section ul {
		line-height: 1.6;
	}

	section ul {
		padding-left: 1.2rem;
	}

	code {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
		font-size: 0.92em;
		background: var(--bg-2);
		padding: 0.05rem 0.35rem;
		border-radius: 4px;
	}

	.cta {
		margin-top: 2rem;
		padding: 1.25rem 1.25rem 1.4rem;
		border-radius: 18px;
		background: linear-gradient(135deg, #fffef9 0%, #eef5ff 50%, #f4fbf2 100%);
		border: 1px solid rgba(86, 118, 170, 0.18);
	}

	.cta h2 {
		margin-top: 0;
	}

	.cta-button {
		display: inline-block;
		margin-top: 0.6rem;
		padding: 0.7rem 1.1rem;
		border-radius: 999px;
		background: #0e4d8b;
		color: #fff;
		text-decoration: none;
		font-weight: 700;
		transition: transform 0.15s ease;
	}

	.cta-button:hover {
		transform: translateY(-2px);
	}

	@media (max-width: 600px) {
		.compare-table {
			font-size: 0.85rem;
		}
		.compare-table th,
		.compare-table td {
			padding: 0.55rem 0.6rem;
		}
	}
</style>
