require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function claimLoop() {
  let counter = 0;
  let currentNonce = await provider.getTransactionCount(wallet.address, "latest");

  console.log("Starting claim loop...");
  console.log("Wallet:", wallet.address);
  console.log("Starting nonce:", currentNonce);

  while (true) {
    try {
      const tx = await wallet.sendTransaction({
        to: CONTRACT_ADDRESS,
        data: "0x05632f40", // function selector untuk `claim()`
        gasLimit: 100000,   // sesuaikan jika perlu
        nonce: currentNonce
      });

      counter++;
      console.log(`[${counter}] Tx sent: ${tx.hash} | Nonce: ${currentNonce}`);
      currentNonce++; // increment nonce manual

    } catch (err) {
      console.error(`[${counter}] ❌ Error on nonce ${currentNonce}:`, err?.reason || err?.message || err);
      // Jangan increment nonce jika gagal
    }

    // Delay antar tx — kecil karena kita tidak menunggu confirmation
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}

claimLoop();
