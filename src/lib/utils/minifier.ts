import { Buffer } from 'buffer';

export type MinifierLanguage = 'HTML' | 'CSS' | 'JavaScript';

export function minifyHTML(html: string): string {
	return html
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/>\s+</g, '><')
		.replace(/\s+/g, ' ')
		.trim();
}

export function minifyCSS(css: string): string {
	let minified = css
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\s+/g, ' ')
		.replace(/\s*([;:{},])\s*/g, '$1')
		.replace(/;}/g, '}');

	minified = minified.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/gi, '#$1$2$3');
	minified = minified.replace(/:\s*0(px|em|%|pt|pc|in|cm|mm|ex|rem)/g, ':0');
	minified = minified.replace(/\s0(px|em|%|pt|pc|in|cm|mm|ex|rem)/g, ' 0');

	return minified.trim();
}

export function minifyJS(js: string): string {
	let noComments = js.replace(/\/\*[\s\S]*?\*\//g, '');
	noComments = noComments.replace(/(^|[^:])\/\/.*$/gm, '$1');

	const lines = noComments
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	let joined = lines.join(' ');
	joined = joined.replace(/\s+/g, ' ');
	joined = joined.replace(/\s*([;,:{}()\[\]=*/%<>?&|^~!])\s*/g, '$1');

	return joined.trim();
}

export function minifyCode(inputCode: string, language: MinifierLanguage): string {
	switch (language) {
		case 'HTML':
			return minifyHTML(inputCode);
		case 'CSS':
			return minifyCSS(inputCode);
		case 'JavaScript':
			return minifyJS(inputCode);
	}
}

export function detectLanguageFromFilename(fileName: string): MinifierLanguage | null {
	const extension = fileName.split('.').pop()?.toLowerCase();
	if (extension === 'html' || extension === 'htm') return 'HTML';
	if (extension === 'css') return 'CSS';
	if (extension === 'js') return 'JavaScript';
	return null;
}

export function getCodeSizeMetrics(inputCode: string, outputCode: string) {
	const inputSize = Buffer.byteLength(inputCode, 'utf-8');
	const outputSize = outputCode ? Buffer.byteLength(outputCode, 'utf-8') : 0;

	return {
		inputSize,
		outputSize,
		savedBytes: outputCode ? inputSize - outputSize : 0
	};
}
