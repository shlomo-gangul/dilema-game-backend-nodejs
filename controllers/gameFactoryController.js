import { ethers } from "ethers";
import { gameFactoryAbi } from "../models/abi.js";
import dotenv from "dotenv";
dotenv.config();

// Load environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const gameFactoryAddress = process.env.CONTRACT_GAME_FACTORY_ADDRESS;

// Set up the provider and wallet with proper URL
const provider = new ethers.JsonRpcProvider(
  `https://holesky.infura.io/v3/${infuraProjectId}`
);
const wallet = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(
  gameFactoryAddress,
  gameFactoryAbi,
  wallet
);

// Utility function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Endpoints
export const getGameCount = async (req, res) => {
  try {
    const gameCount = await contract.getGameCount();
    res.json({ gameCount: gameCount.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getGameAtIndex = async (req, res) => {
  try {
    const gameAddress = await contract.getGame(req.params.index);
    res.json({ gameAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

async function pullGameCreatedEvents() {
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
      await delay(1000);

      const toBlock = Math.min(fromBlock + chunkSize - 1, currentBlock);
      console.log(`Querying blocks ${fromBlock} to ${toBlock}`);

      const filter = contract.filters.GameCreated();
      const events = await contract.queryFilter(filter, fromBlock, toBlock);
      results.push(...events);

      console.log(`Found ${events.length} events in this chunk`);
    }

    return results;
  } catch (error) {
    if (error.code === -32002) {
      console.log("Rate limit hit, waiting 5 seconds before retry...");
      await delay(5000);
      return pullGameCreatedEvents();
    }
    throw error;
  }
}

// Initialize event listener with better logging
pullGameCreatedEvents()
  .then((events) => {
    if (events.length === 0) {
      console.log("No GameCreated events found in the last 1000 blocks");
    } else {
      console.log(`Found ${events.length} total GameCreated events`);
      events.forEach((event) => {
        console.log("Game Created Event:");
        console.log("  Game Address:", event.args[0]);
        console.log("  Block:", event.blockNumber);
        console.log("  Transaction:", event.transactionHash);
      });
    }
  })
  .catch((error) => {
    console.error("Error pulling GameCreated events:", error);
  });

export { contract, provider, wallet };
