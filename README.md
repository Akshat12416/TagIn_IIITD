demo video : https://youtu.be/KYLPzUUvf1Q

TAG.IN: NFC + Blockchain Based Product Authentication Platform

TAG.IN is an end-to-end product authenticity and ownership verification system. It protects retail brands and customers from counterfeit goods by combining NFC technology, blockchain, AI-based similarity checks, and real-time analytics. The goal is to create a secure, transparent, and scalable product lifecycle ecosystem.

🚀 Problem

The retail market, both online and offline, is experiencing a rapid increase in counterfeit products. Examples include:

Fake electronic items

Knockoff accessories

Duplicate warranty claims

Unauthorized reselling

Fake supply chains

QR codes and barcodes can be easily copied. Even basic NFC tags can be cloned. This leads to loss of revenue, broken customer trust, and safety risks for buyers.

💡 Our Solution

TAG.IN introduces a multi-layer product verification system.

✔ 1. Secure NFC Tag on Every Product

Each product contains an NFC tag with a unique token ID.
When the user taps the tag, the token ID is read and verification begins.

✔ 2. Blockchain Based Product Registry

Each product is registered on the Sepolia blockchain test network with:

The metadata hash of the product

The manufacturer address

Ownership history

This ensures permanent and tamper proof records.

✔ 3. Dual Verification Process

When a user scans the NFC tag:

The backend fetches the actual product details

A metadata hash is recomputed

The hash is compared with the blockchain value

If both match, the product is authentic.
If not, the product is flagged as suspicious.

✔ 4. AI Based Counterfeit Detection

If a mismatch is reported, the user uploads an image.
A CLIP model checks similarity between the product appearance and metadata to classify:

Verified

Confirmed mismatch

Uncertain

This creates an additional security layer.

✔ 5. Hotspot Tracking

Reported counterfeit locations are stored along with city data.
This allows brands to identify counterfeit hotspots and take action.

✔ 6. Manufacturer Dashboard

Manufacturers get access to:

Total scans

Scan trends

Ownership transfers

Counterfeit reports

Heatmap of suspicious activity

🏗 Features

NFC based product detection

Blockchain powered immutability

AI similarity detection

Ownership transfer with MetaMask

Secure manufacturer login using blockchain whitelist

Report submission with image and location

Analytics dashboard for brands

Dual frontend (manufacturer + user app)

Modular backend design

🎯 Vision

TAG.IN aims to become the standard for product authenticity in retail.
The long term plan is to onboard major brands, help customers verify products with one tap, and reduce the circulation of counterfeit goods in both online and offline markets.
