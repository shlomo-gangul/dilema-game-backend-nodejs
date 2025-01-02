import { ethers } from "ethers";
import { gameFactoryAbi } from "../models/abi.js";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const gameFactoryAddress = process.env.CONTRACT_GAME_FACTORY_ADDRESS;

// Set up the provider and wallet
const provider = new ethers.JsonRpcProvider(infuraProjectId);
const wallet = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(
  gameFactoryAddress,
  gameFactoryAbi,
  wallet
);

// Utility function for rate limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Endpoint to get the game count
export const getGameCount = async (req, res) => {
  try {
    const gameCount = await contract.getGameCount();
    res.json({ gameCount: gameCount.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Endpoint to get a game address by index
export const getGameAtIndex = async (req, res) => {
  try {
    const gameAddress = await contract.getGame(req.params.index);
    res.json({ gameAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

async function pullEvents() {
  try {
    const filter = contract.filters.GameCreated();

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
      console.log("Game Created:", event.args);
    });
  })
  .catch((error) => {
    console.error("Error pulling events:", error);
  });

// export const getGameState = async (req, res) => {
//   try {
//     const player1 = await contract.player1();
//     const player2 = await contract.player2();
//     const player1Points = await contract.player1Points();
//     const player2Points = await contract.player2Points();
//     const isGameOver = await contract.getIsGameOver();

//     res.json({
//       player1,
//       player2,
//       player1Points: player1Points.toString(),
//       player2Points: player2Points.toString(),
//       isGameOver,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };
