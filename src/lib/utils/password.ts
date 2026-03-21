const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+~`|}{[]:;<>,.?/';

export type PasswordOptions = {
	length: number;
	includeUppercase: boolean;
	includeLowercase: boolean;
	includeNumbers: boolean;
	includeSymbols: boolean;
};

export type PasswordStrength = {
	label: 'Weak' | 'Medium' | 'Strong';
	color: 'red' | 'yellow' | 'green';
};

export function buildCharacterSet(options: PasswordOptions): string {
	let characterSet = '';

	characterSet += options.includeUppercase ? UPPERCASE_CHARS : '';
	characterSet += options.includeLowercase ? LOWERCASE_CHARS : '';
	characterSet += options.includeNumbers ? NUMBER_CHARS : '';
	characterSet += options.includeSymbols ? SYMBOL_CHARS : '';

	return characterSet;
}

export function generatePassword(
	options: PasswordOptions,
	randomInt: (maxExclusive: number) => number = getCryptoRandomInt
): string {
	const characterSet = buildCharacterSet(options);

	if (!characterSet) {
		throw new Error('At least one character set must be selected.');
	}

	let password = '';
	for (let i = 0; i < options.length; i++) {
		password += characterSet[randomInt(characterSet.length)];
	}

	return password;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
	let complexity = 0;
	if (/[a-z]+/.test(password)) complexity++;
	if (/[A-Z]+/.test(password)) complexity++;
	if (/[0-9]+/.test(password)) complexity++;
	if (/[!@#$%^&*()_+~`|}{[\]:;<>,.?/]+/.test(password)) complexity++;

	const lengthFactor = Math.min(password.length / 8, 1);
	const score = complexity * lengthFactor;

	if (score <= 1) {
		return { label: 'Weak', color: 'red' };
	}

	if (score <= 2) {
		return { label: 'Medium', color: 'yellow' };
	}

	return { label: 'Strong', color: 'green' };
}

function getCryptoRandomInt(maxExclusive: number): number {
	if (maxExclusive <= 0) {
		throw new Error('maxExclusive must be greater than 0.');
	}

	const randomValues = new Uint32Array(1);
	const maxUint32 = 0x100000000;
	const maxUnbiasedValue = maxUint32 - (maxUint32 % maxExclusive);

	do {
		crypto.getRandomValues(randomValues);
	} while (randomValues[0] >= maxUnbiasedValue);

	return randomValues[0] % maxExclusive;
}
