import { ethers } from "ethers";
import { gameTokenAbi } from "../models/abi.js";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const gameTokenAddress = process.env.CONTRACT_GAME_TOKEN_ADDRESS;

// Set up the provider and wallet
const provider = new ethers.JsonRpcProvider(infuraProjectId);
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

async function pullEvents() {
  try {
    const filter = contract.filters.Transfer();

    // Add delay before querying
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const events = await contract.queryFilter(filter);
    return events;
  } catch (error) {
    if (error.code === -32002) {
      // If rate limited, wait 2 seconds and try again
      console.log("Rate limit hit, retrying after delay...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return pullEvents(); // Retry recursively
    }
    throw error; // Throw other errors
  }
}

// Using the function
pullEvents()
  .then((events) => {
    events.forEach((event) => {
      console.log("Transfer:", event.args);
    });
  })
  .catch((error) => {
    console.error("Error pulling events:", error);
  });
