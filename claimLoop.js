require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const CLAIM_FUNCTION_SELECTOR = "0x05632f40";
const GAS_LIMIT = 100000;
const TX_BATCH_SIZE = 1; // Kirim 10 tx sekaligus per batch
const INTERVAL_MS = 1; // Delay antar batch

let counter = 0;
let successCounter = 0;

async function claimLoop() {
  let baseNonce = await provider.getTransactionCount(wallet.address, "latest");

  console.log("🚀 Claim loop started");
  console.log("Wallet:", wallet.address);
  console.log("Starting nonce:", baseNonce);

  setInterval(() => {
    console.log(`📊 TX sent: ${counter}, Successful: ${successCounter} [${new Date().toLocaleTimeString()}]`);
  }, 10 * 60 * 1000); // setiap 10 menit

  while (true) {
    const promises = [];

    for (let i = 0; i < TX_BATCH_SIZE; i++) {
      const nonce = baseNonce + counter;

      const txPromise = wallet.sendTransaction({
        to: CONTRACT_ADDRESS,
        data: CLAIM_FUNCTION_SELECTOR,
        gasLimit: GAS_LIMIT,
        nonce
      })
      .then(tx => {
        successCounter++;
        console.log(`[${counter}] ✅ Sent: ${tx.hash}`);
      })
      .catch(err => {
        console.error(`[${counter}] ❌ Error:`, err?.reason || err?.message || err);
      });

      promises.push(txPromise);
      counter++;
    }

    await Promise.all(promises);
    await new Promise((res) => setTimeout(res, INTERVAL_MS));
  }
}

claimLoop();
