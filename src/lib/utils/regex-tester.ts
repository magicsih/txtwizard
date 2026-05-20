export type RegexFlag = 'g' | 'i' | 'm' | 's' | 'u' | 'y';

export const SUPPORTED_FLAGS: RegexFlag[] = ['g', 'i', 'm', 's', 'u', 'y'];

export type RegexMatch = {
	match: string;
	index: number;
	groups: string[];
	namedGroups: Record<string, string>;
};

export type RegexTestResult = { ok: true; matches: RegexMatch[] } | { ok: false; error: string };

export type RegexReplaceResult =
	| { ok: true; output: string; replacementCount: number }
	| { ok: false; error: string };

function compile(pattern: string, flags: string): RegExp {
	return new RegExp(pattern, flags);
}

function normalizeFlags(flags: string): string {
	const unique = new Set<string>();
	for (const ch of flags) {
		if ((SUPPORTED_FLAGS as string[]).includes(ch)) {
			unique.add(ch);
		}
	}
	return Array.from(unique).join('');
}

const MAX_MATCH_ITERATIONS = 10_000;

export function testRegex(pattern: string, flags: string, input: string): RegexTestResult {
	if (!pattern) {
		return { ok: true, matches: [] };
	}

	const normalized = normalizeFlags(flags);
	const flagsWithGlobal = normalized.includes('g') ? normalized : `${normalized}g`;

	let regex: RegExp;
	try {
		regex = compile(pattern, flagsWithGlobal);
	} catch (error) {
		return { ok: false, error: error instanceof Error ? error.message : String(error) };
	}

	const matches: RegexMatch[] = [];
	let iterations = 0;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(input)) !== null) {
		iterations += 1;
		if (iterations > MAX_MATCH_ITERATIONS) {
			return {
				ok: false,
				error: `Aborted after ${MAX_MATCH_ITERATIONS} matches to prevent runaway execution.`
			};
		}

		matches.push({
			match: match[0],
			index: match.index,
			groups: match.slice(1).map((group) => group ?? ''),
			namedGroups: match.groups ? { ...match.groups } : {}
		});

		if (match.index === regex.lastIndex) {
			regex.lastIndex += 1;
		}
	}

	return { ok: true, matches };
}

export function replaceRegex(
	pattern: string,
	flags: string,
	input: string,
	replacement: string
): RegexReplaceResult {
	if (!pattern) {
		return { ok: true, output: input, replacementCount: 0 };
	}

	const normalized = normalizeFlags(flags);
	let regex: RegExp;
	try {
		regex = compile(pattern, normalized);
	} catch (error) {
		return { ok: false, error: error instanceof Error ? error.message : String(error) };
	}

	const countRegex = compile(pattern, normalized.includes('g') ? normalized : `${normalized}g`);
	let replacementCount = 0;
	const countMatches = input.match(countRegex);
	if (countMatches) {
		replacementCount = countMatches.length;
	}

	const output = input.replace(regex, replacement);
	return { ok: true, output, replacementCount };
}

export function highlightMatches(
	input: string,
	matches: RegexMatch[]
): Array<{ text: string; matched: boolean }> {
	if (matches.length === 0) {
		return input ? [{ text: input, matched: false }] : [];
	}

	const sorted = [...matches].sort((a, b) => a.index - b.index);
	const segments: Array<{ text: string; matched: boolean }> = [];
	let cursor = 0;
	for (const m of sorted) {
		if (m.index > cursor) {
			segments.push({ text: input.slice(cursor, m.index), matched: false });
		}
		segments.push({ text: m.match, matched: true });
		cursor = m.index + m.match.length;
	}
	if (cursor < input.length) {
		segments.push({ text: input.slice(cursor), matched: false });
	}
	return segments;
}
