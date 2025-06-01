require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const MULTICALL_ADDRESS = "0xB1F60733C7B76F8F4085af3d9f6e374C43E462f8";
const TARGET_CONTRACT_ADDRESS = "0xbe43d66327ca5b77e7f14870a94a3058511103d3";

const multicallAbi = [
  "function aggregate(tuple(address target, bytes callData)[] calls) public returns (uint256 blockNumber, bytes[] memory returnData)"
];

const CLAIM_FUNCTION_SELECTOR = "0x05632f40";

const BATCH_SIZE = 1;        // send 1 multicall transaction per batch
const CALLS_PER_TX = 125;    // each transaction contains 125 claim() calls
const GAS_LIMIT = 8_000_000; // gas limit per transaction
const DELAY_MS = 1;          // delay between batches (1 ms)
const MAX_RETRY = 0;         // max retry attempts on error

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMulticallTx(multicallContract, calls, attempt = 1) {
  try {
    const tx = await multicallContract.aggregate(calls, { gasLimit: GAS_LIMIT });
    console.log(`✅ Tx sent (attempt ${attempt}): ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`🎉 Tx confirmed in block ${receipt.blockNumber}`);
    return receipt;
  } catch (error) {
    console.error(`❌ Tx failed (attempt ${attempt}):`, error?.reason || error?.message || error);
    if (attempt < MAX_RETRY) {
      console.log(`🔁 Retrying attempt ${attempt + 1}...`);
      await delay(1000); // wait 1 second before retry
      return sendMulticallTx(multicallContract, calls, attempt + 1);
    } else {
      console.error(`🚫 Max retries reached. Skipping this tx.`);
      return null;
    }
  }
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const multicallContract = new ethers.Contract(MULTICALL_ADDRESS, multicallAbi, wallet);

  let batchCounter = 0;

  console.log("🚀 Starting to send multicall transaction batches...");

  while (true) {
    const txPromises = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const calls = [];
      for (let j = 0; j < CALLS_PER_TX; j++) {
        calls.push({
          target: TARGET_CONTRACT_ADDRESS,
          callData: CLAIM_FUNCTION_SELECTOR
        });
      }

      console.log(`Batch ${batchCounter + 1}, transaction #${i + 1}: sending multicall with ${CALLS_PER_TX} calls`);

      // Send multicall transaction with error handling and retry
      const txPromise = sendMulticallTx(multicallContract, calls);
      txPromises.push(txPromise);
    }

    await Promise.all(txPromises);

    batchCounter++;
    console.log(`✅ Batch ${batchCounter} completed. Waiting ${DELAY_MS} ms before next batch.\n`);

    await delay(DELAY_MS);
  }
}

main();
