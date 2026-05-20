import { describe, expect, it } from 'vitest';

import { escapeJsonString, formatJson, sortJsonKeys, unescapeJsonString } from './json-tools';

describe('formatJson', () => {
	it('pretty-prints JSON with the requested indent', () => {
		const result = formatJson('{"a":1,"b":[1,2]}', '2');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}');
		}
	});

	it('minifies JSON', () => {
		const result = formatJson('{\n  "a": 1\n}', 'minify');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('{"a":1}');
		}
	});

	it('returns error with line and column when parsing fails', () => {
		const result = formatJson('{\n  "a": 1,\n  "b" 2\n}', '2');
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(typeof result.error).toBe('string');
			expect(result.line).toBeGreaterThan(0);
		}
	});

	it('rejects empty input', () => {
		const result = formatJson('   ', '2');
		expect(result.ok).toBe(false);
	});
});

describe('sortJsonKeys', () => {
	it('sorts object keys recursively', () => {
		const result = sortJsonKeys('{"b":1,"a":{"d":1,"c":2}}', 'minify');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('{"a":{"c":2,"d":1},"b":1}');
		}
	});

	it('leaves array order intact while sorting nested object keys', () => {
		const result = sortJsonKeys('[{"b":1,"a":2},{"z":1}]', 'minify');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('[{"a":2,"b":1},{"z":1}]');
		}
	});
});

describe('escapeJsonString / unescapeJsonString', () => {
	it('escapes a string into a JSON string literal', () => {
		expect(escapeJsonString('hello "world"\n')).toBe('"hello \\"world\\"\\n"');
	});

	it('unescapes a quoted JSON string', () => {
		const result = unescapeJsonString('"hello \\"world\\"\\n"');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('hello "world"\n');
		}
	});

	it('unescapes a JSON string without surrounding quotes', () => {
		const result = unescapeJsonString('hello\\nworld');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.output).toBe('hello\nworld');
		}
	});
});
