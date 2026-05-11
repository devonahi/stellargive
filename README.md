# StellarGive

A decentralized donation platform built on the Stellar network using Soroban smart contracts.

## Project Structure

- `contracts/`: Soroban smart contracts written in Rust.
- `frontend/`: Next.js web application.
- `scripts/`: Deployment and utility scripts.
- `docs/`: Project documentation.

## Getting Started

...

## Contract Deployment (Stellar Testnet)

The `stellar-give` Soroban contract has been built and deployed to Stellar Testnet.

- **Contract name:** `stellarGive` (`contracts/stellar-give`)
- **Contract ID:** `CB6HVHRQYILGNKW7RBB66BC6TDBIEWADOA2YUUV4I22RXRLA6DY6OAKT`
- **Deployer identity alias:** `copilot-deployer`
- **WASM upload transaction:** `92a8a10978d2216de9f6e97bd2b4c522076eb1242a3d2d5c4738c4fb86a6dd2a`
- **Contract deploy transaction:** `e3f88cee225bb5548e4640afe02c351373575469fb60dac6f5de670aa7687156`
- **Explorer (deploy tx):** `https://stellar.expert/explorer/testnet/tx/e3f88cee225bb5548e4640afe02c351373575469fb60dac6f5de670aa7687156`
- **Lab contract link:** `https://lab.stellar.org/r/testnet/contract/CB6HVHRQYILGNKW7RBB66BC6TDBIEWADOA2YUUV4I22RXRLA6DY6OAKT`

### Testnet Network Configuration

- **RPC URL:** `https://soroban-testnet.stellar.org`
- **Network passphrase:** `Test SDF Network ; September 2015`
- **Friendbot:** `https://friendbot.stellar.org/?addr=<PUBLIC_KEY>`

### Contract Interface (Frontend Integration)

- `create_campaign(creator, beneficiary, title, target_amount, deadline, accepted_token) -> campaign_id`
- `donate(donor, campaign_id, amount)`
- `claim_funds(caller, campaign_id) -> claimed_amount`
- `get_campaign(campaign_id) -> Campaign`
