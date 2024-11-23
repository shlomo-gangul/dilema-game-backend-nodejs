import { ethers } from "ethers";
import { gameFactoryAbi } from "../models/abi.js";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const gameFactoryAddress = process.env.CONTRACT_GAME_FACTORY_ADDRESS;

// Set up the provider and wallet
//const provider = new InfuraProvider("holesky", infuraProjectId);
const provider = new ethers.JsonRpcProvider(infuraProjectId);
const wallet = new ethers.Wallet(privateKey, provider);

// ABI of the DillemaGame contract

// Create a contract instance
const contract = new ethers.Contract(
  gameFactoryAddress,
  gameFactoryAbi,
  wallet
);

export const postCreateGame = async (req, res) => {
  try {
    const tx = await contract.createNewGame();
    await tx.wait();
    res.json({ message: "New game created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

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
