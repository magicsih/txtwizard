import { Buffer } from 'buffer';
import * as fflate from 'fflate';
import * as zstdWasm from '@bokuweb/zstd-wasm';

const { compress: zstdCompress, decompress: zstdDecompress } = zstdWasm;

export const COMPRESSION_ALGORITHMS = ['gzip', 'deflate', 'zip', 'zip-max', 'zstd'] as const;

export type CompressionAlgorithm = (typeof COMPRESSION_ALGORITHMS)[number];

export type CompressionMetrics = {
	compressionRatio: number;
	originalSize: number;
	outputSize: number;
};

// The zstd WebAssembly binary is shipped from static/zstd.wasm (copied by the
// `copy:wasm` npm script) so it ends up at the site root under a stable path
// regardless of bundler hash conventions. init() expects a URL it can fetch, so
// a site-root relative URL is enough on both the static adapter and `npm run
// preview`.
const ZSTD_WASM_URL = '/zstd.wasm';

// zstd-wasm loads a WebAssembly module the first time `init()` runs. Cache
// the in-flight promise so subsequent calls reuse the same module instance.
// The shipped `.d.ts` types `init(path?: string)` so we widen through
// `unknown` once at the call site to satisfy strict svelte-check.
let zstdReady: Promise<void> | null = null;
export function ensureZstdReady(): Promise<void> {
	if (!zstdReady) {
		const init = zstdWasm.init as unknown as (url: string) => Promise<void>;
		zstdReady = init(ZSTD_WASM_URL).then(() => undefined);
	}
	return zstdReady;
}

export function getCompressionLabel(algorithm: CompressionAlgorithm): string {
	switch (algorithm) {
		case 'gzip':
			return 'GZIP';
		case 'deflate':
			return 'Deflate';
		case 'zip':
			return 'ZIP';
		case 'zip-max':
			return 'ZIP (Max Compression)';
		case 'zstd':
			return 'Zstandard (zstd)';
	}
}

export function compressText(
	text: string,
	algorithm: CompressionAlgorithm
): {
	base64: string;
	hex: string;
	metrics: CompressionMetrics;
} {
	const input = fflate.strToU8(text);
	const compressed = runCompression(input, algorithm);
	const outputBuffer = Buffer.from(compressed);

	const metrics = {
		originalSize: input.byteLength,
		outputSize: compressed.byteLength,
		compressionRatio:
			input.byteLength === 0
				? 0
				: parseFloat(
						(((input.byteLength - compressed.byteLength) / input.byteLength) * 100).toFixed(2)
					)
	};

	return {
		base64: outputBuffer.toString('base64'),
		hex: outputBuffer.toString('hex'),
		metrics
	};
}

function runCompression(input: Uint8Array, algorithm: CompressionAlgorithm): Uint8Array {
	switch (algorithm) {
		case 'gzip':
			return fflate.compressSync(input, { level: 6, mem: 8 });
		case 'deflate':
			return fflate.deflateSync(input, { level: 6, mem: 8 });
		case 'zip':
			return fflate.zipSync({ 'file.txt': input }, { level: 6, mem: 8 });
		case 'zip-max':
			return fflate.zipSync({ 'file.txt': input }, { level: 9, mem: 12 });
		case 'zstd':
			// zstd-wasm init() must have resolved before this is reached. The
			// compression page awaits ensureZstdReady() on mount before it
			// invokes doCompress(); direct callers from unit tests should also
			// await it first.
			return zstdCompress(input, 3);
	}
}

export function decompressText(bytes: Uint8Array, algorithm: CompressionAlgorithm): Uint8Array {
	switch (algorithm) {
		case 'gzip':
			return fflate.gunzipSync(bytes);
		case 'deflate':
			return fflate.inflateSync(bytes);
		case 'zip':
			return fflate.unzipSync(bytes)['file.txt'];
		case 'zip-max':
			return fflate.unzipSync(bytes)['file.txt'];
		case 'zstd':
			return zstdDecompress(bytes);
	}
}
