export type TimestampUnit = 'seconds' | 'milliseconds';

export type TimestampParseResult =
	| { ok: true; date: Date; sourceUnit: TimestampUnit | 'iso' }
	| { ok: false; error: string };

function utcMs(year: number, month = 0, day = 1, hour = 0, minute = 0, second = 0, ms = 0): number {
	const date = new Date(Date.UTC(2000, month, day, hour, minute, second, ms));
	date.setUTCFullYear(year);
	return date.getTime();
}

const MIN_ALLOWED_MS = utcMs(1, 0, 1);
const MAX_ALLOWED_MS = utcMs(9999, 11, 31, 23, 59, 59, 999);

function inSupportedRange(ms: number): boolean {
	return Number.isFinite(ms) && ms >= MIN_ALLOWED_MS && ms <= MAX_ALLOWED_MS;
}

export function parseTimestampInput(value: string): TimestampParseResult {
	const trimmed = value.trim();
	if (!trimmed) {
		return { ok: false, error: 'Input is empty.' };
	}

	if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
		const numeric = Number(trimmed);
		if (!Number.isFinite(numeric)) {
			return { ok: false, error: 'Numeric value is out of range.' };
		}

		// Numbers with 13+ integer digits are unambiguously milliseconds;
		// shorter values are tried as seconds first and fall back to ms
		// when the seconds interpretation overflows the supported range.
		// This way millisecond epochs before ~2001 (e.g. 946684800000)
		// are still classified correctly.
		const digitCount = trimmed.replace(/^-/, '').split('.')[0].length;
		const candidates: Array<{ ms: number; unit: TimestampUnit }> =
			digitCount >= 13
				? [
						{ ms: numeric, unit: 'milliseconds' },
						{ ms: numeric * 1000, unit: 'seconds' }
					]
				: [
						{ ms: numeric * 1000, unit: 'seconds' },
						{ ms: numeric, unit: 'milliseconds' }
					];

		for (const candidate of candidates) {
			if (inSupportedRange(candidate.ms)) {
				const date = new Date(candidate.ms);
				if (!Number.isNaN(date.getTime())) {
					return { ok: true, date, sourceUnit: candidate.unit };
				}
			}
		}

		return { ok: false, error: 'Timestamp is outside the supported range (year 1 – 9999).' };
	}

	const date = new Date(trimmed);
	if (Number.isNaN(date.getTime())) {
		return { ok: false, error: 'Could not parse value as an ISO date.' };
	}
	return { ok: true, date, sourceUnit: 'iso' };
}

export type FormattedTimestamp = {
	iso: string;
	utc: string;
	local: string;
	unixSeconds: number;
	unixMilliseconds: number;
	relative: string;
};

export function formatTimestamp(date: Date, now: Date = new Date()): FormattedTimestamp {
	const ms = date.getTime();
	return {
		iso: date.toISOString(),
		utc: date.toUTCString(),
		local: date.toString(),
		unixSeconds: Math.floor(ms / 1000),
		unixMilliseconds: ms,
		relative: formatRelative(date, now)
	};
}

export function formatRelative(date: Date, now: Date = new Date()): string {
	const diffMs = date.getTime() - now.getTime();
	const absMs = Math.abs(diffMs);

	const minute = 60_000;
	const hour = 60 * minute;
	const day = 24 * hour;
	const week = 7 * day;
	const month = 30 * day;
	const year = 365 * day;

	const future = diffMs > 0;
	const verb = future ? 'in ' : '';
	const suffix = future ? '' : ' ago';

	if (absMs < 1000) {
		return future ? 'in a moment' : 'just now';
	}
	if (absMs < minute) {
		const value = Math.round(absMs / 1000);
		return `${verb}${value} second${value === 1 ? '' : 's'}${suffix}`;
	}
	if (absMs < hour) {
		const value = Math.round(absMs / minute);
		return `${verb}${value} minute${value === 1 ? '' : 's'}${suffix}`;
	}
	if (absMs < day) {
		const value = Math.round(absMs / hour);
		return `${verb}${value} hour${value === 1 ? '' : 's'}${suffix}`;
	}
	if (absMs < week) {
		const value = Math.round(absMs / day);
		return `${verb}${value} day${value === 1 ? '' : 's'}${suffix}`;
	}
	if (absMs < month) {
		const value = Math.round(absMs / week);
		return `${verb}${value} week${value === 1 ? '' : 's'}${suffix}`;
	}
	if (absMs < year) {
		const value = Math.round(absMs / month);
		return `${verb}${value} month${value === 1 ? '' : 's'}${suffix}`;
	}
	const value = Math.round(absMs / year);
	return `${verb}${value} year${value === 1 ? '' : 's'}${suffix}`;
}

export function nowSeconds(): number {
	return Math.floor(Date.now() / 1000);
}

export function nowMilliseconds(): number {
	return Date.now();
}
