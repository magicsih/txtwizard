export type JsonFormatResult =
	| { ok: true; output: string }
	| { ok: false; error: string; line?: number; column?: number };

export type JsonIndent = '2' | '4' | 'tab' | 'minify';

function getIndentValue(indent: JsonIndent): string | number {
	switch (indent) {
		case '2':
			return 2;
		case '4':
			return 4;
		case 'tab':
			return '\t';
		case 'minify':
			return 0;
	}
}

function locateError(
	input: string,
	error: unknown
): { line?: number; column?: number; message: string } {
	const message = error instanceof Error ? error.message : String(error);
	const positionMatch = message.match(/position\s+(\d+)/i);
	if (!positionMatch) {
		return { message };
	}

	const position = Number(positionMatch[1]);
	if (!Number.isFinite(position) || position < 0) {
		return { message };
	}

	const slice = input.slice(0, position);
	const lines = slice.split('\n');
	const line = lines.length;
	const column = lines[lines.length - 1].length + 1;
	return { message, line, column };
}

export function formatJson(input: string, indent: JsonIndent = '2'): JsonFormatResult {
	if (!input.trim()) {
		return { ok: false, error: 'Input is empty.' };
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (error) {
		const located = locateError(input, error);
		return { ok: false, error: located.message, line: located.line, column: located.column };
	}

	const indentValue = getIndentValue(indent);
	const output =
		indentValue === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentValue);
	return { ok: true, output };
}

export function sortJsonKeys(input: string, indent: JsonIndent = '2'): JsonFormatResult {
	if (!input.trim()) {
		return { ok: false, error: 'Input is empty.' };
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (error) {
		const located = locateError(input, error);
		return { ok: false, error: located.message, line: located.line, column: located.column };
	}

	const sorted = sortKeys(parsed);
	const indentValue = getIndentValue(indent);
	const output =
		indentValue === 0 ? JSON.stringify(sorted) : JSON.stringify(sorted, null, indentValue);
	return { ok: true, output };
}

function sortKeys(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(sortKeys);
	}
	if (value && typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
			a.localeCompare(b)
		);
		const result: Record<string, unknown> = {};
		for (const [key, val] of entries) {
			result[key] = sortKeys(val);
		}
		return result;
	}
	return value;
}

export function escapeJsonString(input: string): string {
	return JSON.stringify(input);
}

export function unescapeJsonString(input: string): JsonFormatResult {
	const trimmed = input.trim();
	if (!trimmed) {
		return { ok: false, error: 'Input is empty.' };
	}

	const candidate = trimmed.startsWith('"') ? trimmed : `"${trimmed}"`;
	try {
		const parsed = JSON.parse(candidate);
		if (typeof parsed !== 'string') {
			return { ok: false, error: 'Input does not decode to a string.' };
		}
		return { ok: true, output: parsed };
	} catch (error) {
		const located = locateError(candidate, error);
		return { ok: false, error: located.message, line: located.line, column: located.column };
	}
}
