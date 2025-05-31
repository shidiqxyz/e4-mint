# e4 mint

Automated script for repeatedly calling the `claim()` function on an EVM smart contract with manual nonce management.


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
CONTRACT_ADDRESS=0xbe43d66327ca5b77e7f14870a94a3058511103d3
```

## Usage
```bash
node claimLoop.js
```

Sample output:
```
Starting claim loop...
Wallet: 0xYourAddress
Starting nonce: 42
[1] Tx sent: 0xhash1 | Nonce: 42
[2] Tx sent: 0xhash2 | Nonce: 43
[3] ❌ Error on nonce 44: insufficient funds...
```

## Configuration
Adjust in code:
```javascript
const GAS_LIMIT = 100000;  // Modify as needed
const TX_DELAY = 100;      // Delay between tx in ms
```
