import { describe, expect, it } from 'vitest';

import {
	buildCharacterSet,
	calculatePasswordStrength,
	generatePassword,
	type PasswordOptions
} from './password';

const fullOptions: PasswordOptions = {
	length: 12,
	includeUppercase: true,
	includeLowercase: true,
	includeNumbers: true,
	includeSymbols: true
};

describe('buildCharacterSet', () => {
	it('includes only selected character groups', () => {
		expect(
			buildCharacterSet({
				length: 8,
				includeUppercase: false,
				includeLowercase: true,
				includeNumbers: true,
				includeSymbols: false
			})
		).toBe('abcdefghijklmnopqrstuvwxyz0123456789');
	});
});

describe('generatePassword', () => {
	it('creates a password with the requested length', () => {
		const password = generatePassword(fullOptions, () => 0);
		expect(password).toHaveLength(fullOptions.length);
	});

	it('throws when no character groups are selected', () => {
		expect(() =>
			generatePassword({
				length: 8,
				includeUppercase: false,
				includeLowercase: false,
				includeNumbers: false,
				includeSymbols: false
			})
		).toThrow('At least one character set must be selected.');
	});
});

describe('calculatePasswordStrength', () => {
	it('marks simple passwords as weak', () => {
		expect(calculatePasswordStrength('aaaa')).toEqual({ label: 'Weak', color: 'red' });
	});

	it('marks mixed long passwords as strong', () => {
		expect(calculatePasswordStrength('Abc123!@#xyz')).toEqual({
			label: 'Strong',
			color: 'green'
		});
	});
});
