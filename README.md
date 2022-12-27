# Batch Transfer

## Usage

- STEP#1 approve to the BatchTransfer contract address
- STEP#2 set receiver `BatchTransfer.setReceiver(address)` to your address to receive the tokens (constructor will set the creator as the owner and receiver)
- STEP#3 call `BatchTransfer.batchSend(address from, ...[], ...[], ...[])` from any address to transfer tokens from `from` to `BatchTransfer.receiver`.

`test/demo.ts` is helpful.

## deploy
```bash
npx hardhat --verbose run --network mainnet scripts/deploy.ts
```
I set fixed gas price as 10 GWEI(9+1). You can delete it for current network.

## test
```
npx hardhat test test/demo.ts --network hardhat
```

## USDT
The USDT(`0xdAC17F958D2ee523a2206206994597C13D831ec7`) implementation is different from the standard ERC20 (notice: function returns type). 

So I haven't tested what impact non-standard tokens will lead to.