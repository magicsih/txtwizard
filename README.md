# TXTWIZARD

TxtWizard is a collection of online tools for text manipulation, encryption, decryption, encoding, decoding, and more. The service is live at [txtwizard.net](https://txtwizard.net).

## Development

To start developing locally, use the following commands:

```bash
npm install
npm run dev
```
# or start the server and open the app in a new browser tab
```npm run dev -- --open```

## Building
To build the project for production:

```npm run build```

## Deployment
Changes pushed to the `main` branch are automatically deployed to [https://www.txtwizard.net](https://www.txtwizard.net) via the CI/CD pipeline configured in the repository.

## Features
- Encryption & Decryption: Securely encrypt and decrypt text using AES-GCM and AES-CBC algorithms.
- Encoding & Decoding: Convert text between Base64, Hex, and other formats.
- Hashing: Generate hashes using SHA-1, SHA-256, SHA-512, and more.
- Compression: Compress text using GZIP, BZIP2, and other algorithms.
- Key Generation: Generate public-private key pairs for Bitcoin and Ethereum.
- QR Code Generator: Create QR codes from text or URLs.
- Currency Conversion: Convert between currencies with real-time exchange rates.

## Contributing
Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.