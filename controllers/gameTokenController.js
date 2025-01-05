import { ethers } from "ethers";
import { gameTokenAbi } from "../models/abi.js";
import dotenv from "dotenv";
dotenv.config();

// Load environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const gameTokenAddress = process.env.CONTRACT_GAME_TOKEN_ADDRESS;

// Set up the provider and wallet with proper URL
const provider = new ethers.JsonRpcProvider(
  `https://holesky.infura.io/v3/${infuraProjectId}`
);
const wallet = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(gameTokenAddress, gameTokenAbi, wallet);

export const getGameTokenBalance = async (req, res) => {
  try {
    const balance = await contract.balanceOf(req.params.address);
    res.json({ balance: balance.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const mintedGameToken = async (req, res) => {
  try {
    const minted = await contract.mint(req.params.address, req.params.amount);
    res.json({ minted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

async function pullTransferEvents() {
  try {
    // Get current block
    const currentBlock = await provider.getBlockNumber();
    console.log("Current block:", currentBlock);

    const chunkSize = 100; // Query 100 blocks at a time
    const results = [];

    // Query in chunks from last 1000 blocks
    for (
      let fromBlock = currentBlock - 1000;
      fromBlock <= currentBlock;
      fromBlock += chunkSize
    ) {
      // Add delay between chunks
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const toBlock = Math.min(fromBlock + chunkSize - 1, currentBlock);
      console.log(`Querying blocks ${fromBlock} to ${toBlock}`);

      const filter = contract.filters.Transfer();
      const events = await contract.queryFilter(filter, fromBlock, toBlock);
      results.push(...events);

      console.log(`Found ${events.length} events in this chunk`);
    }

    return results;
  } catch (error) {
    if (error.code === -32002) {
      console.log("Rate limit hit, waiting 5 seconds before retry...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return pullTransferEvents();
    }
    throw error;
  }
}

// Initialize event listener with better logging
pullTransferEvents()
  .then((events) => {
    if (events.length === 0) {
      console.log("No Transfer events found in the last 1000 blocks");
    } else {
      console.log(`Found ${events.length} total Transfer events`);
      events.forEach((event) => {
        console.log("Transfer Event:");
        console.log("  From:", event.args[0]);
        console.log("  To:", event.args[1]);
        console.log("  Amount:", event.args[2].toString());
        console.log("  Block:", event.blockNumber);
      });
    }
  })
  .catch((error) => {
    console.error("Error pulling Transfer events:", error);
  });

export { contract, provider, wallet };
