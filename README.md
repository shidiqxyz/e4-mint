# e4 mint

Fck megaeth rpc


## Setup
1. Clone repository:
```bash
git clone https://github.com/shidiqxyz/e4-mint.git
cd e4-mint
```

2. Install dependencies:
```bash
npm install ethers dotenv
```

3. Create `.env` file:
```env
PRIVATE_KEY="YOUR_PRIVATE_KEY"
RPC_URL=https://carrot.megaeth.com/rpc
```

## Usage
```bash
node claimLoop.js
```

Sample output:
```
 Starting to send multicall transaction batches...
Batch 1, transaction #1: sending multicall with 125 calls
✅ Tx sent (attempt 1): 0x8e78....
🎉 Tx confirmed in block 7562072
✅ Batch 1 completed. Waiting 1 ms before next batch.

Batch 2, transaction #1: sending multicall with 125 calls
✅ Tx sent (attempt 1): 0x4302a....
🎉 Tx confirmed in block 7562079
✅ Batch 2 completed. Waiting 1 ms before next batch.

Batch 3, transaction #1: sending multicall with 125 calls
✅ Tx sent (attempt 1): 0x07f10....
🎉 Tx confirmed in block 7562082
✅ Batch 3 completed. Waiting 1 ms before next batch.
```

## Configuration
Adjust in code:
```javascript
const BATCH_SIZE = 1;        // send 1 multicall transaction per batch
const CALLS_PER_TX = 125;    // each transaction contains 125 claim() calls
const GAS_LIMIT = 8_000_000; // gas limit per transaction
const DELAY_MS = 1;          // delay between batches (1 ms)
const MAX_RETRY = 0;         // max retry attempts on error```
