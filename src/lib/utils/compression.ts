import { Buffer } from 'buffer';
import * as fflate from 'fflate';

export const COMPRESSION_ALGORITHMS = [
	'gzip',
	'deflate',
	'zip',
	'zip-max'
] as const;

export type CompressionAlgorithm = (typeof COMPRESSION_ALGORITHMS)[number];

export type CompressionMetrics = {
	compressionRatio: number;
	originalSize: number;
	outputSize: number;
};

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
	}
}

export function compressText(text: string, algorithm: CompressionAlgorithm): {
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
	}
}
