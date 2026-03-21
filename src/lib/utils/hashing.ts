import { Buffer } from 'buffer';
import { sha256, sha384, sha512, sha224, sha512_256 } from '@noble/hashes/sha2';
import {
	sha3_224,
	sha3_256,
	sha3_384,
	sha3_512,
	keccak_224,
	keccak_256,
	keccak_384,
	keccak_512
} from '@noble/hashes/sha3';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { blake3 } from '@noble/hashes/blake3';
import { blake2b } from '@noble/hashes/blake2b';
import { blake2s } from '@noble/hashes/blake2s';
import { sha1 } from '@noble/hashes/sha1';

export const HASH_ALGORITHMS = [
	'SHA-1',
	'SHA-224',
	'SHA-256',
	'SHA-384',
	'SHA-512',
	'SHA-512/256',
	'SHA3-224',
	'SHA3-256',
	'SHA3-384',
	'SHA3-512',
	'Keccak-224',
	'Keccak-256',
	'Keccak-384',
	'Keccak-512',
	'RIPEMD160',
	'BLAKE2s',
	'BLAKE2b',
	'BLAKE3'
] as const;

export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];

const HASH_FUNCTIONS = {
	'SHA-1': sha1,
	'SHA-224': sha224,
	'SHA-256': sha256,
	'SHA-384': sha384,
	'SHA-512': sha512,
	'SHA-512/256': sha512_256,
	'SHA3-224': sha3_224,
	'SHA3-256': sha3_256,
	'SHA3-384': sha3_384,
	'SHA3-512': sha3_512,
	'Keccak-224': keccak_224,
	'Keccak-256': keccak_256,
	'Keccak-384': keccak_384,
	'Keccak-512': keccak_512,
	RIPEMD160: ripemd160,
	BLAKE2s: blake2s,
	BLAKE2b: blake2b,
	BLAKE3: blake3
} satisfies Record<HashAlgorithm, (message: Uint8Array) => Uint8Array>;

export function hashText(text: string, algorithm: HashAlgorithm): { base64: string; hex: string } {
	const digest = HASH_FUNCTIONS[algorithm](Buffer.from(text, 'utf-8'));
	return {
		base64: Buffer.from(digest).toString('base64'),
		hex: Buffer.from(digest).toString('hex')
	};
}
