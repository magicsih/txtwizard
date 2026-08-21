// Cross-links between tools.
//
// The first week of BigQuery data showed 1.19 page views per session and 84%
// single-page sessions: visitors land on one tool from search and leave. These
// curated links follow real workflows (compress -> inspect the Base64 output,
// encrypt -> decrypt, generate a key -> use it) so the next click is useful
// rather than a generic tool dump.

import type { Pathname } from '$app/types';

export type RelatedTool = {
	href: Pathname;
	/** i18n key, same keys the nav uses. */
	labelKey: string;
	/** Short reason to click through. */
	blurb: string;
};

const TOOL: Record<string, RelatedTool> = {
	analyzer: {
		href: '/analyzer',
		labelKey: 'analyzer',
		blurb: 'count characters, words, and byte size'
	},
	comparison: {
		href: '/comparison',
		labelKey: 'comparison',
		blurb: 'diff two texts and drop duplicate lines'
	},
	compression: {
		href: '/compression',
		labelKey: 'compression',
		blurb: 'shrink text with GZIP, Deflate, or ZIP'
	},
	dateCalculator: {
		href: '/date-calculator',
		labelKey: 'date-calculator',
		blurb: 'add, subtract, and diff calendar dates'
	},
	decryption: { href: '/decryption', labelKey: 'decryption', blurb: 'decrypt AES or DES payloads' },
	encoding: {
		href: '/encoding-decoding',
		labelKey: 'encoding',
		blurb: 'convert Base64, Hex, URL, and HTML encodings'
	},
	encryption: {
		href: '/encryption',
		labelKey: 'encryption',
		blurb: 'encrypt text with AES or DES'
	},
	hashing: {
		href: '/hashing',
		labelKey: 'hashing',
		blurb: 'hash with MD5, SHA-1, SHA-256, or SHA-512'
	},
	json: { href: '/json', labelKey: 'json-tool', blurb: 'format, validate, and query JSON' },
	jwt: { href: '/jwt', labelKey: 'jwt', blurb: 'decode, verify, and sign JSON Web Tokens' },
	keygen: {
		href: '/key-generation',
		labelKey: 'keygen',
		blurb: 'generate BTC and ETH key pairs'
	},
	minifier: { href: '/minifier', labelKey: 'code-minifier', blurb: 'minify JS, CSS, and HTML' },
	password: {
		href: '/password-generator',
		labelKey: 'password-generator',
		blurb: 'build strong random passwords'
	},
	qrcode: { href: '/qrcode', labelKey: 'qr-code-gen', blurb: 'turn text or a URL into a QR code' },
	regex: { href: '/regex', labelKey: 'regex-tool', blurb: 'test regular expressions live' },
	timestamp: {
		href: '/timestamp',
		labelKey: 'timestamp-tool',
		blurb: 'convert Unix timestamps and dates'
	}
};

const RELATED: Record<string, RelatedTool[]> = {
	analyzer: [TOOL.comparison, TOOL.minifier, TOOL.encoding],
	comparison: [TOOL.analyzer, TOOL.json, TOOL.minifier],
	compression: [TOOL.encoding, TOOL.hashing, TOOL.analyzer],
	'date-calculator': [TOOL.timestamp, TOOL.analyzer, TOOL.comparison],
	decryption: [TOOL.encryption, TOOL.encoding, TOOL.hashing],
	'encoding-decoding': [TOOL.compression, TOOL.hashing, TOOL.jwt],
	encryption: [TOOL.decryption, TOOL.keygen, TOOL.hashing],
	hashing: [TOOL.encryption, TOOL.encoding, TOOL.password],
	json: [TOOL.minifier, TOOL.comparison, TOOL.jwt],
	jwt: [TOOL.encoding, TOOL.hashing, TOOL.timestamp],
	'key-generation': [TOOL.encryption, TOOL.hashing, TOOL.password],
	minifier: [TOOL.json, TOOL.compression, TOOL.analyzer],
	'password-generator': [TOOL.keygen, TOOL.hashing, TOOL.encryption],
	qrcode: [TOOL.encoding, TOOL.analyzer, TOOL.json],
	regex: [TOOL.comparison, TOOL.analyzer, TOOL.json],
	timestamp: [TOOL.dateCalculator, TOOL.jwt, TOOL.json]
};

export function getRelatedTools(toolName: string): RelatedTool[] {
	return RELATED[toolName] ?? [];
}
