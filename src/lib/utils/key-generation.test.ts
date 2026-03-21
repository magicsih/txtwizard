import { describe, expect, it } from 'vitest';

import { deriveKeysFromNumericInput } from './key-generation';

describe('deriveKeysFromNumericInput', () => {
	it('derives deterministic ETH and BTC outputs from numeric input', () => {
		const result = deriveKeysFromNumericInput('1');
		expect(result.privateKey).toBe(
			'0x0000000000000000000000000000000000000000000000000000000000000001'
		);
		expect(result.address).toBe('0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf');
		expect(result.btcAddress).toBe('1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH');
	});
});
