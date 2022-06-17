import { NftSwap } from "@traderxyz/nft-swap-sdk";
import { ethers } from "ethers";

export default async function swap(userAddress, userNFT, nftHolder, nftContract) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer1 = provider.listAccounts();
  console.log(signer1);
  const CHAIN_ID = 4; //rinkeby
  const Oizys_69 = {
    tokenAddress: userNFT,
    tokenId: "69",
    type: "ERC721",
  };
  console.log(provider);
  const Aether_420 = {
    tokenAddress: nftContract,
    tokenId: "420",
    type: "ERC721",
  };
  // User A Trade Data
  const walletAddressUserA = userAddress;
  const assetsToSwapUserA = [Oizys_69];

  // User B Trade Data
  const walletAddressUserB = nftHolder;
  const assetsToSwapUserB = [Aether_420];
  // ............................
  // Part 1 of the trade -- User A (the 'maker') initiates an order
  // ............................

  // Initiate the SDK for User A.
  // Pass the user's wallet signer (available via the user's wallet provider) to the Swap SDK
  const nftSwapSdk = new NftSwap(provider, signer1, CHAIN_ID);

  // Check if we need to approve the NFT for swapping
  const approvalStatusForUserA = await nftSwapSdk.loadApprovalStatus(assetsToSwapUserA[0], walletAddressUserA);

  // If we do need to approve User A's CryptoPunk for swapping, let's do that now
  if (!approvalStatusForUserA.contractApproved) {
    const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(assetsToSwapUserA[0], walletAddressUserA);
    const approvalTxReceipt = await approvalTx.wait();
    console.log(`Approved ${assetsToSwapUserA[0].tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`);
  }

  // Create the order (Remember, User A initiates the trade, so User A creates the order)
  const order = nftSwapSdk.buildOrder(assetsToSwapUserA, assetsToSwapUserB, walletAddressUserA);

  // Sign the order (User A signs since they are initiating the trade)
  const signedOrder = await nftSwapSdk.signOrder(order, walletAddressUserA);
  // Part 1 Complete. User A is now done. Now we send the `signedOrder` to User B to complete the trade.

  // ............................
  // Part 2 of the trade -- User B (the 'taker') accepts and fills order from User A and completes trade
  // ............................
  // Initiate the SDK for User B.
  const signer2 = provider.getSigner([1]);
  const nftSwapSdk1 = new NftSwap(provider, signer2, CHAIN_ID);

  // Check if we need to approve the NFT for swapping
  const approvalStatusForUserB = await nftSwapSdk1.loadApprovalStatus(assetsToSwapUserB[0], walletAddressUserB);
  // If we do need to approve NFT for swapping, let's do that now
  if (!approvalStatusForUserB.contractApproved) {
    const approvalTx = await nftSwapSdk1.approveTokenOrNftByAsset(assetsToSwapUserB[0], walletAddressUserB);
    const approvalTxReceipt = await approvalTx.wait();
    console.log(`Approved ${assetsToSwapUserB[0].tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`);
  }
  // The final step is the taker (User B) submitting the order.
  // The taker approves the trade transaction and it will be submitted on the blockchain for settlement.
  // Once the transaction is confirmed, the trade will be settled and cannot be reversed.
  const fillTx = await nftSwapSdk1.fillSignedOrder(signedOrder);
  const fillTxReceipt = await nftSwapSdk1.awaitTransactionHash(fillTx.hash);
  console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);

  console.log({
    userAddress,
    userNFT,
    nftHolder,
    nftContract,
  });
}
