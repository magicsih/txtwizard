export type DeduplicationType = 'line' | 'sentence';

export function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export function compareTexts(text1: string, text2: string): string {
	const lines1 = text1.split('\n');
	const lines2 = text2.split('\n');
	const differences: string[] = [];

	let i = 0;
	let j = 0;

	while (i < lines1.length || j < lines2.length) {
		if (i >= lines1.length) {
			const line2 = escapeHtml(lines2[j] || '');
			if (lines2[j]) differences.push(`<span class='added'>+ ${line2}</span>`);
			j++;
			continue;
		}

		if (j >= lines2.length) {
			const line1 = escapeHtml(lines1[i] || '');
			if (lines1[i]) differences.push(`<span class='removed'>- ${line1}</span>`);
			i++;
			continue;
		}

		const line1 = escapeHtml(lines1[i] || '');
		const line2 = escapeHtml(lines2[j] || '');

		if (line1 === line2) {
			i++;
			j++;
		} else if (lines1[i] != lines2[j + 1] && lines2[j] != lines1[i + 1]) {
			if (lines1[i]) differences.push(`<span class='removed'>- ${line1}</span>`);
			if (lines2[j]) differences.push(`<span class='added'>+ ${line2}</span>`);
			i++;
			j++;
		} else if (lines1[i] == lines2[j + 1]) {
			if (lines1[i]) differences.push(`<span class='removed'>- ${line1}</span>`);
			i++;
			j++;
		} else if (lines2[j] == lines1[i + 1]) {
			if (lines2[j]) differences.push(`<span class='added'>+ ${line2}</span>`);
			i++;
			j++;
		} else {
			i++;
			j++;
		}
	}

	return differences.join('<br>');
}

export function deduplicateText(text: string, deduplicationType: DeduplicationType): string {
	const entries = deduplicationType === 'line' ? text.split('\n') : text.split(/[.!?]+/);
	const uniqueEntries: string[] = [];
	const seen = new Set<string>();

	for (const entry of entries) {
		const trimmedEntry = entry.trim();
		if (trimmedEntry && !seen.has(trimmedEntry)) {
			uniqueEntries.push(trimmedEntry);
			seen.add(trimmedEntry);
		}
	}

	let result = uniqueEntries.join(deduplicationType === 'line' ? '\n' : '. ');
	if (deduplicationType !== 'line' && result) {
		result += '.';
	}

	return result;
}
