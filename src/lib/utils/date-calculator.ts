export function parseDateInput(value: string): Date | null {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function calculateDateDifference(startDate: string, endDate: string): number | null {
	const start = parseDateInput(startDate);
	const end = parseDateInput(endDate);
	if (!start || !end) return null;

	const diffInMs = Math.abs(end.getTime() - start.getTime());
	return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

export function addOrSubtractDays(baseDate: string, daysToAdd: number): string | null {
	const base = parseDateInput(baseDate);
	if (!base) return null;

	const newDate = new Date(base);
	newDate.setDate(base.getDate() + daysToAdd);
	return newDate.toISOString().slice(0, 10);
}
