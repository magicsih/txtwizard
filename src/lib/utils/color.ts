export type Rgb = { r: number; g: number; b: number; a: number };

export type WcagRating = {
	aaNormal: boolean;
	aaLarge: boolean;
	aaaNormal: boolean;
	aaaLarge: boolean;
};

export type Palette = {
	base: Rgb;
	tints: Rgb[];
	shades: Rgb[];
	complementary: Rgb;
	triadic: [Rgb, Rgb];
	analogous: [Rgb, Rgb];
};

const HEX_PATTERN = /^#?([0-9a-f]{3,8})$/i;

export function parseColor(input: string): Rgb | null {
	const trimmed = input.trim();
	if (!trimmed) return null;
	return parseHex(trimmed) ?? parseRgb(trimmed) ?? parseHsl(trimmed);
}

function parseHex(input: string): Rgb | null {
	const match = input.match(HEX_PATTERN);
	if (!match) return null;
	const hex = match[1];
	const len = hex.length;
	if (len !== 3 && len !== 4 && len !== 6 && len !== 8) return null;

	const expand = (s: string): number => parseInt(s.length === 1 ? s + s : s, 16);

	if (len <= 4) {
		const r = expand(hex[0]);
		const g = expand(hex[1]);
		const b = expand(hex[2]);
		const a = len === 4 ? expand(hex[3]) / 255 : 1;
		return { r, g, b, a };
	}

	const r = expand(hex.slice(0, 2));
	const g = expand(hex.slice(2, 4));
	const b = expand(hex.slice(4, 6));
	const a = len === 8 ? expand(hex.slice(6, 8)) / 255 : 1;
	return { r, g, b, a };
}

function parseRgb(input: string): Rgb | null {
	const match = input.match(/^rgba?\s*\(\s*([^)]+)\s*\)$/i);
	if (!match) return null;
	const parts = match[1].split(/[\s,/]+/).filter(Boolean);
	if (parts.length < 3 || parts.length > 4) return null;

	const channel = (value: string): number | null => {
		if (value.endsWith('%')) {
			const pct = Number(value.slice(0, -1));
			if (!Number.isFinite(pct)) return null;
			return clamp((pct / 100) * 255, 0, 255);
		}
		const num = Number(value);
		if (!Number.isFinite(num)) return null;
		return clamp(num, 0, 255);
	};

	const r = channel(parts[0]);
	const g = channel(parts[1]);
	const b = channel(parts[2]);
	if (r === null || g === null || b === null) return null;

	let a = 1;
	if (parts[3] !== undefined) {
		const alpha = parseAlpha(parts[3]);
		if (alpha === null) return null;
		a = alpha;
	}

	return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a };
}

function parseHsl(input: string): Rgb | null {
	const match = input.match(/^hsla?\s*\(\s*([^)]+)\s*\)$/i);
	if (!match) return null;
	const parts = match[1].split(/[\s,/]+/).filter(Boolean);
	if (parts.length < 3 || parts.length > 4) return null;

	const hueRaw = parts[0];
	const h = parseHue(hueRaw);
	const s = parsePercent(parts[1]);
	const l = parsePercent(parts[2]);
	if (h === null || s === null || l === null) return null;

	let a = 1;
	if (parts[3] !== undefined) {
		const alpha = parseAlpha(parts[3]);
		if (alpha === null) return null;
		a = alpha;
	}

	return { ...hslToRgb(h, s, l), a };
}

function parseHue(value: string): number | null {
	let raw = value;
	let multiplier = 1;
	if (raw.endsWith('deg')) {
		raw = raw.slice(0, -3);
	} else if (raw.endsWith('turn')) {
		raw = raw.slice(0, -4);
		multiplier = 360;
	} else if (raw.endsWith('rad')) {
		raw = raw.slice(0, -3);
		multiplier = 180 / Math.PI;
	} else if (raw.endsWith('grad')) {
		raw = raw.slice(0, -4);
		multiplier = 0.9;
	}
	const num = Number(raw);
	if (!Number.isFinite(num)) return null;
	return (((num * multiplier) % 360) + 360) % 360;
}

function parsePercent(value: string): number | null {
	if (!value.endsWith('%')) return null;
	const num = Number(value.slice(0, -1));
	if (!Number.isFinite(num)) return null;
	return clamp(num / 100, 0, 1);
}

function parseAlpha(value: string): number | null {
	if (value.endsWith('%')) {
		const num = Number(value.slice(0, -1));
		if (!Number.isFinite(num)) return null;
		return clamp(num / 100, 0, 1);
	}
	const num = Number(value);
	if (!Number.isFinite(num)) return null;
	return clamp(num, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hPrime = h / 60;
	const x = c * (1 - Math.abs((hPrime % 2) - 1));
	const m = l - c / 2;

	let r1 = 0;
	let g1 = 0;
	let b1 = 0;
	if (hPrime < 1) [r1, g1, b1] = [c, x, 0];
	else if (hPrime < 2) [r1, g1, b1] = [x, c, 0];
	else if (hPrime < 3) [r1, g1, b1] = [0, c, x];
	else if (hPrime < 4) [r1, g1, b1] = [0, x, c];
	else if (hPrime < 5) [r1, g1, b1] = [x, 0, c];
	else [r1, g1, b1] = [c, 0, x];

	return {
		r: Math.round((r1 + m) * 255),
		g: Math.round((g1 + m) * 255),
		b: Math.round((b1 + m) * 255)
	};
}

export function rgbToHsl(rgb: Rgb): { h: number; s: number; l: number } {
	const r = rgb.r / 255;
	const g = rgb.g / 255;
	const b = rgb.b / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;
	const l = (max + min) / 2;

	let h = 0;
	let s = 0;
	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1));
		if (max === r) h = 60 * (((g - b) / delta) % 6);
		else if (max === g) h = 60 * ((b - r) / delta + 2);
		else h = 60 * ((r - g) / delta + 4);
	}
	if (h < 0) h += 360;
	return { h, s, l };
}

export function toHex(rgb: Rgb): string {
	const pad = (n: number) => n.toString(16).padStart(2, '0');
	const r = pad(Math.round(rgb.r));
	const g = pad(Math.round(rgb.g));
	const b = pad(Math.round(rgb.b));
	if (rgb.a >= 1) return `#${r}${g}${b}`;
	const a = pad(Math.round(rgb.a * 255));
	return `#${r}${g}${b}${a}`;
}

export function toRgbString(rgb: Rgb): string {
	const r = Math.round(rgb.r);
	const g = Math.round(rgb.g);
	const b = Math.round(rgb.b);
	if (rgb.a >= 1) return `rgb(${r}, ${g}, ${b})`;
	return `rgba(${r}, ${g}, ${b}, ${roundAlpha(rgb.a)})`;
}

export function toHslString(rgb: Rgb): string {
	const { h, s, l } = rgbToHsl(rgb);
	const hue = Math.round(h);
	const sat = Math.round(s * 100);
	const light = Math.round(l * 100);
	if (rgb.a >= 1) return `hsl(${hue}, ${sat}%, ${light}%)`;
	return `hsla(${hue}, ${sat}%, ${light}%, ${roundAlpha(rgb.a)})`;
}

function roundAlpha(a: number): number {
	return Math.round(a * 1000) / 1000;
}

export function relativeLuminance(rgb: Rgb): number {
	const channel = (c: number) => {
		const n = c / 255;
		return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
	};
	return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	const [lighter, darker] = la >= lb ? [la, lb] : [lb, la];
	return (lighter + 0.05) / (darker + 0.05);
}

export function wcagRating(ratio: number): WcagRating {
	return {
		aaLarge: ratio >= 3,
		aaNormal: ratio >= 4.5,
		aaaLarge: ratio >= 4.5,
		aaaNormal: ratio >= 7
	};
}

export function mixColors(a: Rgb, b: Rgb, weight: number): Rgb {
	const w = clamp(weight, 0, 1);
	return {
		r: a.r * (1 - w) + b.r * w,
		g: a.g * (1 - w) + b.g * w,
		b: a.b * (1 - w) + b.b * w,
		a: a.a * (1 - w) + b.a * w
	};
}

export function rotateHue(rgb: Rgb, degrees: number): Rgb {
	const { h, s, l } = rgbToHsl(rgb);
	const nh = (((h + degrees) % 360) + 360) % 360;
	return { ...hslToRgb(nh, s, l), a: rgb.a };
}

export function generatePalette(rgb: Rgb): Palette {
	const white: Rgb = { r: 255, g: 255, b: 255, a: 1 };
	const black: Rgb = { r: 0, g: 0, b: 0, a: 1 };
	const tints = [0.2, 0.4, 0.6, 0.8].map((w) => mixColors(rgb, white, w));
	const shades = [0.2, 0.4, 0.6, 0.8].map((w) => mixColors(rgb, black, w));
	return {
		base: rgb,
		tints,
		shades,
		complementary: rotateHue(rgb, 180),
		triadic: [rotateHue(rgb, 120), rotateHue(rgb, 240)],
		analogous: [rotateHue(rgb, -30), rotateHue(rgb, 30)]
	};
}
