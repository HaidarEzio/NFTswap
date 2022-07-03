# Example Project for NFT Swap SDK

You can check the demo here https://nft-swapping-demo.vercel.app/

Hi everyone ! I'll break down the main features of this project

- 1:1 NFT Swapping between 2 NFTs on Rinkeby test network on Ethereum
- I've provided 2 `NFT.sol` files under `NFTs`, use Truffle or HardHat to migrate them to your wallets that you want to test with
- [ERC-721, ERC-20] <> [ERC-721] swap isn't possible as of yet on the Rinkeby network

Now the actual installation procedure:

- Clone this repo
- `npm install`
- `npm run dev`
- deploy the `NFT.sol` contracts to your testing wallets
- after deploying the NFTs in the wallets, Sign in with the 1st Wallet with Metamask
- now Provide your
  - 1st NFT contract (Maker) (I've provided the 1st Wallet address with `Wagmi.js`)
  - 2nd Wallet Address (Taker)
  - 2nd NFT Contract
- You'll provide 2 signatures from the 1st wallet, one for approval, and the second for the first half of the swapping order
- if everything works out correctly you'll be taken to `/taker`
- sign in with the 2nd Wallet with Metamask
- now provide the 2nd NFT contract (that's in Taker)
- you'll be prompted to sign the second half of the swapping order
- (there will be errors if the NFTs aren't in their respective places)
- after it's done without errors, you'll get to `/congrats`, and you can see the transaction hash

and Voila 🥳 hopefully it worked out nicely for you ! special thanks to the [nft-swap-sdk](https://github.com/trader-xyz/nft-swap-sdk) team for their efforts, and check out their [discord](https://discord.gg/RTvpQcxn4V)
