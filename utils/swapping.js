import { NftSwap } from "@traderxyz/nft-swap-sdk";
import { ethers } from "ethers";

export async function part2(userAddress, userNFT, makerData) {
  let signedOrder = makerData;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const CHAIN_ID = 4; //rinkeby
  const Aether_420 = {
    tokenAddress: userNFT,
    tokenId: "420",
    type: "ERC721",
  };

  // User B Trade Data
  const walletAddressUserB = userAddress;
  const assetsToSwapUserB = [Aether_420];
  // ............................
  // Part 2 of the trade -- User B (the 'taker') accepts and fills order from User A and completes trade
  // ............................
  // Initiate the SDK for User B.
  const signer = provider.getSigner();
  console.log(signer);
  const nftSwapSdk = new NftSwap(provider, signer, CHAIN_ID);

  // Check if we need to approve the NFT for swapping
  const approvalStatusForUserB = await nftSwapSdk.loadApprovalStatus(assetsToSwapUserB[0], walletAddressUserB);
  // If we do need to approve NFT for swapping, let's do that now
  if (!approvalStatusForUserB.contractApproved) {
    const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(assetsToSwapUserB[0], walletAddressUserB);
    const approvalTxReceipt = await approvalTx.wait();
    console.log(`Approved ${assetsToSwapUserB[0].tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`);
  }
  // The final step is the taker (User B) submitting the order.
  // The taker approves the trade transaction and it will be submitted on the blockchain for settlement.
  // Once the transaction is confirmed, the trade will be settled and cannot be reversed.
  const fillTx = await nftSwapSdk.fillSignedOrder(signedOrder, undefined, {
    gasLimit: "500000",
    // HACK(johnnrjj) - Rinkeby still has protocol fees, so we give it a little bit of ETH so its happy.
    value: ethers.utils.parseEther("0.01"),
  });
  console.log(fillTx);
  const fillTxReceipt = await nftSwapSdk.awaitTransactionHash(fillTx.hash);

  console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);

  return fillTxReceipt.transactionHash;
}

export async function swap(userAddress, userNFT, nftContract) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const CHAIN_ID = 4; //rinkeby

  const Oizys_69 = {
    tokenAddress: userNFT,
    tokenId: "69",
    type: "ERC721",
  };
  const Aether_420 = {
    tokenAddress: nftContract,
    tokenId: "420",
    type: "ERC721",
  };
  // User A Trade Data
  const walletAddressUserA = userAddress;
  const assetsToSwapUserA = [Oizys_69];

  // User B Trade Data
  // const walletAddressUserB = nftHolder;
  const assetsToSwapUserB = [Aether_420];
  // ............................
  // Part 1 of the trade -- User A (the 'maker') initiates an order
  // ............................

  // Initiate the SDK for User A.
  // Pass the user's wallet signer (available via the user's wallet provider) to the Swap SDK
  const nftSwapSdk = new NftSwap(provider, signer, CHAIN_ID);

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
  return signedOrder;
  // console.log({
  //   userAddress,
  //   userNFT,
  //   nftHolder,
  //   nftContract,
  // });
}
