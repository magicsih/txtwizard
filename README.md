[![Deploy GitHub Pages](https://github.com/magicsih/txtwizard/actions/workflows/deploy_pages.yaml/badge.svg)](https://github.com/magicsih/txtwizard/actions/workflows/deploy_pages.yaml)

# TXTWIZARD

TxtWizard is a collection of online tools for text manipulation, encryption, decryption, encoding, decoding, and more. The service is live at [txtwizard.net](https://txtwizard.net).

## Development

To start developing locally, use the following commands:

```bash
npm install
npm run dev
```

# or start the server and open the app in a new browser tab

`npm run dev -- --open`

## Building

To build the project for production:

`npm run build`

## Deployment

Changes pushed to the `main` branch are automatically deployed to [https://www.txtwizard.net](https://www.txtwizard.net) via GitHub Pages.

The legacy Kubernetes deployment workflow is kept as a manual fallback in `.github/workflows/build_and_push.yaml`.

### GitHub Pages setup

Before the first Pages deployment, configure the repository once:

1. Open `Settings` > `Pages` in the GitHub repository.
2. Set `Build and deployment` > `Source` to `GitHub Actions`.
3. Set `Custom domain` to `www.txtwizard.net`.
4. Enable `Enforce HTTPS` after GitHub finishes issuing the certificate.

Configure DNS for the domain:

- `www.txtwizard.net` CNAME to `magicsih.github.io`
- `txtwizard.net` A records to GitHub Pages:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

After DNS propagates, GitHub Pages should redirect `txtwizard.net` to `www.txtwizard.net`.

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
