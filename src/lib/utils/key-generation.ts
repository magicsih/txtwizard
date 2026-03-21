import { Buffer } from 'buffer';
import { getRandomBytesSync } from 'ethereum-cryptography/random';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { ripemd160 } from 'ethereum-cryptography/ripemd160';
import { sha256 } from 'ethereum-cryptography/sha256';
import base58 from 'bs58';

export type DerivedKeys = {
	privateKey: string;
	privateKeyNumeric: string;
	publicKey: string;
	address: string;
	btcPrivateKey: string;
	btcPublicKey: string;
	btcAddress: string;
};

export function generateRandomKeyPair(): DerivedKeys {
	return deriveKeysFromPrivateKey(getRandomBytesSync(32));
}

export function deriveKeysFromNumericInput(privateKeyNumeric: string): DerivedKeys {
	const value = BigInt(privateKeyNumeric);
	const curveOrder = secp256k1.CURVE.n;
	if (value < 1n || value >= curveOrder) {
		throw new Error('Private key must be within the valid secp256k1 range.');
	}

	const privateKeyHex = value.toString(16).padStart(64, '0');
	return deriveKeysFromPrivateKey(Uint8Array.from(Buffer.from(privateKeyHex, 'hex')));
}

export function deriveKeysFromPrivateKey(privateKeyBytes: Uint8Array): DerivedKeys {
	const ethereumPublicKey = secp256k1.getPublicKey(privateKeyBytes, false);
	const ethereumAddressBytes = keccak256(ethereumPublicKey.slice(1)).slice(-20);
	const bitcoinPublicKey = secp256k1.getPublicKey(privateKeyBytes, true);
	const bitcoinAddressBytes = ripemd160(sha256(bitcoinPublicKey));

	return {
		privateKey: `0x${Buffer.from(privateKeyBytes).toString('hex')}`,
		privateKeyNumeric: BigInt(`0x${Buffer.from(privateKeyBytes).toString('hex')}`).toString(),
		publicKey: `0x${Buffer.from(ethereumPublicKey).toString('hex')}`,
		address: toChecksumAddress(Buffer.from(ethereumAddressBytes).toString('hex')),
		btcPrivateKey: toWIF(privateKeyBytes),
		btcPublicKey: Buffer.from(bitcoinPublicKey).toString('hex'),
		btcAddress: toBitcoinAddress(bitcoinAddressBytes)
	};
}

export function toChecksumAddress(address: string): string {
	const addressLower = address.toLowerCase();
	const hash = Buffer.from(keccak256(Buffer.from(addressLower, 'utf-8'))).toString('hex');

	let checksumAddress = '0x';
	for (let i = 0; i < addressLower.length; i++) {
		checksumAddress += parseInt(hash[i], 16) >= 8 ? addressLower[i].toUpperCase() : addressLower[i];
	}
	return checksumAddress;
}

export function toWIF(privateKeyBytes: Uint8Array): string {
	const versionedPrivateKey = Buffer.concat([Buffer.from([0x80]), privateKeyBytes]);
	const compressedPrivateKey = Buffer.concat([versionedPrivateKey, Buffer.from([0x01])]);
	const checksum = sha256(sha256(compressedPrivateKey)).slice(0, 4);
	return base58.encode(Buffer.concat([compressedPrivateKey, checksum]));
}

function toBitcoinAddress(publicKeyHash: Uint8Array): string {
	const versionedPayload = Buffer.concat([Buffer.from([0x00]), publicKeyHash]);
	const checksum = sha256(sha256(versionedPayload)).slice(0, 4);
	return base58.encode(Buffer.concat([versionedPayload, checksum]));
}
