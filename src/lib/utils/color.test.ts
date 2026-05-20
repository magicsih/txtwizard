import { describe, expect, it } from 'vitest';

import {
	contrastRatio,
	generatePalette,
	parseColor,
	relativeLuminance,
	rgbToHsl,
	rotateHue,
	toHex,
	toHslString,
	toRgbString,
	wcagRating
} from './color';

describe('parseColor', () => {
	it('parses 6-digit hex with and without leading hash', () => {
		expect(parseColor('#ff8800')).toEqual({ r: 255, g: 136, b: 0, a: 1 });
		expect(parseColor('ff8800')).toEqual({ r: 255, g: 136, b: 0, a: 1 });
	});

	it('expands 3-digit hex shortcuts', () => {
		expect(parseColor('#f80')).toEqual({ r: 255, g: 136, b: 0, a: 1 });
	});

	it('parses 8-digit hex with alpha', () => {
		const result = parseColor('#ff880080');
		expect(result).not.toBeNull();
		expect(result!.r).toBe(255);
		expect(result!.a).toBeCloseTo(128 / 255, 3);
	});

	it('parses rgb() and rgba()', () => {
		expect(parseColor('rgb(255, 136, 0)')).toEqual({ r: 255, g: 136, b: 0, a: 1 });
		expect(parseColor('rgba(255, 136, 0, 0.5)')).toEqual({ r: 255, g: 136, b: 0, a: 0.5 });
	});

	it('parses modern rgb() with slash alpha', () => {
		expect(parseColor('rgb(255 136 0 / 0.4)')).toEqual({ r: 255, g: 136, b: 0, a: 0.4 });
	});

	it('parses hsl() and converts to rgb', () => {
		const result = parseColor('hsl(0, 100%, 50%)');
		expect(result).toEqual({ r: 255, g: 0, b: 0, a: 1 });
	});

	it('parses hsl with deg suffix and percent alpha', () => {
		const result = parseColor('hsla(120deg, 100%, 50%, 50%)');
		expect(result).toEqual({ r: 0, g: 255, b: 0, a: 0.5 });
	});

	it('returns null for invalid input', () => {
		expect(parseColor('')).toBeNull();
		expect(parseColor('not-a-color')).toBeNull();
		expect(parseColor('#zzzzzz')).toBeNull();
	});
});

describe('toHex / toRgbString / toHslString', () => {
	it('round-trips a primary color', () => {
		const rgb = parseColor('#ff8800')!;
		expect(toHex(rgb)).toBe('#ff8800');
		expect(toRgbString(rgb)).toBe('rgb(255, 136, 0)');
	});

	it('emits 8-digit hex when alpha is below 1', () => {
		const rgb = { r: 255, g: 136, b: 0, a: 0.5 };
		expect(toHex(rgb)).toBe('#ff880080');
	});

	it('produces hsl that round-trips through rgb', () => {
		const rgb = { r: 255, g: 0, b: 0, a: 1 };
		const { h, s, l } = rgbToHsl(rgb);
		expect(Math.round(h)).toBe(0);
		expect(Math.round(s * 100)).toBe(100);
		expect(Math.round(l * 100)).toBe(50);
		expect(toHslString(rgb)).toBe('hsl(0, 100%, 50%)');
	});
});

describe('contrastRatio + wcagRating', () => {
	it('returns 21:1 for black on white', () => {
		const black = { r: 0, g: 0, b: 0, a: 1 };
		const white = { r: 255, g: 255, b: 255, a: 1 };
		expect(contrastRatio(black, white)).toBeCloseTo(21, 0);
	});

	it('is symmetric regardless of order', () => {
		const a = { r: 50, g: 100, b: 150, a: 1 };
		const b = { r: 240, g: 240, b: 240, a: 1 };
		expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 5);
	});

	it('flags AAA pass for black on white', () => {
		const ratio = contrastRatio({ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 });
		const rating = wcagRating(ratio);
		expect(rating.aaNormal).toBe(true);
		expect(rating.aaaNormal).toBe(true);
		expect(rating.aaLarge).toBe(true);
		expect(rating.aaaLarge).toBe(true);
	});

	it('flags AA fail for low contrast', () => {
		const ratio = contrastRatio({ r: 200, g: 200, b: 200, a: 1 }, { r: 255, g: 255, b: 255, a: 1 });
		const rating = wcagRating(ratio);
		expect(rating.aaNormal).toBe(false);
		expect(rating.aaaNormal).toBe(false);
	});
});

describe('relativeLuminance', () => {
	it('returns 0 for black and 1 for white', () => {
		expect(relativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBe(0);
		expect(relativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1, 5);
	});
});

describe('rotateHue + generatePalette', () => {
	it('rotates 180 degrees to the complementary color', () => {
		const rotated = rotateHue({ r: 255, g: 0, b: 0, a: 1 }, 180);
		expect(rotated.r).toBeLessThan(5);
		expect(rotated.g).toBeGreaterThan(250);
		expect(rotated.b).toBeGreaterThan(250);
	});

	it('produces a palette with tints, shades, and harmonies', () => {
		const palette = generatePalette({ r: 100, g: 150, b: 200, a: 1 });
		expect(palette.tints).toHaveLength(4);
		expect(palette.shades).toHaveLength(4);
		expect(palette.tints[0].r).toBeGreaterThan(palette.base.r);
		expect(palette.shades[0].r).toBeLessThan(palette.base.r);
		expect(palette.triadic).toHaveLength(2);
		expect(palette.analogous).toHaveLength(2);
	});
});
