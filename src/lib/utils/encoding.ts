import { Buffer } from 'buffer';

export type DetectedEncoding =
	| 'Plain Text'
	| 'Base64'
	| 'Hex'
	| 'URL-Encoded'
	| 'HTML-Encoded'
	| '';

export type EncodingResult = {
	plainText: string;
	base64: string;
	hex: string;
	urlEncode: string;
	htmlEncode: string;
	detectedEncoding: DetectedEncoding;
};

export function calculateRows(textLength: number): number {
	const minRows = 2;
	const maxRows = 10;
	return Math.min(Math.max(Math.ceil(textLength / 50), minRows), maxRows);
}

export function detectAndConvertInput(userInput: string): EncodingResult {
	if (!userInput) {
		return {
			plainText: '',
			base64: '',
			hex: '',
			urlEncode: '',
			htmlEncode: '',
			detectedEncoding: ''
		};
	}

	let plainText = userInput;
	let detectedEncoding: DetectedEncoding = 'Plain Text';
	let decodedBuffer = Buffer.from(userInput, 'utf-8');

	if (isHex(userInput)) {
		decodedBuffer = Buffer.from(userInput, 'hex');
		plainText = decodedBuffer.toString('utf-8');
		detectedEncoding = 'Hex';
	} else if (isUrlEncoded(userInput)) {
		plainText = decodeURIComponent(userInput);
		decodedBuffer = Buffer.from(plainText, 'utf-8');
		detectedEncoding = 'URL-Encoded';
	} else if (isHtmlEncoded(userInput)) {
		plainText = decodeHtmlEntities(userInput);
		decodedBuffer = Buffer.from(plainText, 'utf-8');
		detectedEncoding = 'HTML-Encoded';
	} else if (isBase64(userInput)) {
		decodedBuffer = Buffer.from(userInput, 'base64');
		plainText = decodedBuffer.toString('utf-8');
		detectedEncoding = 'Base64';
	}

	const utf8Text = decodedBuffer.toString('utf-8');

	return {
		plainText,
		base64: decodedBuffer.toString('base64'),
		hex: decodedBuffer.toString('hex'),
		urlEncode: encodeURIComponent(utf8Text),
		htmlEncode: encodeHtmlEntities(utf8Text),
		detectedEncoding
	};
}

export function isBase64(str: string): boolean {
	if (str.length % 4 !== 0) {
		return false;
	}

	const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
	if (!base64Regex.test(str)) {
		return false;
	}

	try {
		return Buffer.from(str, 'base64').toString('base64') === str;
	} catch {
		return false;
	}
}

export function isHex(str: string): boolean {
	return /^[0-9a-fA-F]+$/g.test(str) && str.length % 2 === 0;
}

export function isUrlEncoded(str: string): boolean {
	try {
		return str !== decodeURIComponent(str);
	} catch {
		return false;
	}
}

export function encodeHtmlEntities(str: string): string {
	return str.replace(/[\u00A0-\u9999<>]/gim, (character) => {
		return `&#${character.charCodeAt(0)};`;
	});
}

const namedHtmlEntities: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: '\u00A0'
};

export function decodeHtmlEntities(str: string): string {
	return str.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, entity: string) => {
		if (entity[0] === '#') {
			const isHex = entity[1] === 'x' || entity[1] === 'X';
			const code = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
			if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) {
				return match;
			}
			try {
				return String.fromCodePoint(code);
			} catch {
				return match;
			}
		}
		return namedHtmlEntities[entity] ?? match;
	});
}

export function isHtmlEncoded(str: string): boolean {
	return /&[a-z]+;/i.test(str) || /&#\d+;/.test(str);
}
