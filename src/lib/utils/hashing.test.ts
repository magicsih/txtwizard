import { describe, expect, it } from 'vitest';

import { hashText } from './hashing';

describe('hashText', () => {
	it('produces expected SHA-256 hex output', () => {
		expect(hashText('abc', 'SHA-256').hex).toBe(
			'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
		);
	});
});
