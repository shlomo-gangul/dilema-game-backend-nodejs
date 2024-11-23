import { ethers } from "ethers";
import { dillemaGameAbi } from "../models/abi.js";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const dilemaGameAddress = process.env.CONTRACT_DILLEMA_GAME_ADDRESS;

// Set up the provider and wallet
//const provider = new InfuraProvider("holesky", infuraProjectId);
const provider = new ethers.JsonRpcProvider(infuraProjectId);
const wallet = new ethers.Wallet(privateKey, provider);

// ABI of the DillemaGame contract

// Create a contract instance
const contract = new ethers.Contract(dilemaGameAddress, dillemaGameAbi, wallet);

export const getGameState = async (req, res) => {
  try {
    const player1 = await contract.player1();
    const player2 = await contract.player2();
    const player1Points = await contract.player1Points();
    const player2Points = await contract.player2Points();
    const isGameOver = await contract.getIsGameOver();

    res.json({
      player1,
      player2,
      player1Points: player1Points.toString(),
      player2Points: player2Points.toString(),
      isGameOver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Example endpoint to join the game
export const postJoinGmae = async (req, res) => {
  try {
    const { player } = req.body;
    const tx = await contract.connect(wallet).joinGame({ from: player });
    await tx.wait();
    res.json({ message: "Player joined the game" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Example endpoint to commit a choice
export const postCommitChoice = async (req, res) => {
  try {
    const { player, commitment } = req.body;
    const tx = await contract
      .connect(wallet)
      .commitChoice(commitment, { from: player });
    await tx.wait();
    res.json({ message: "Choice committed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Example endpoint to reveal a choice
export const postRevealChoce = async (req, res) => {
  try {
    const { player, choice, nonce } = req.body;
    const tx = await contract
      .connect(wallet)
      .revealChoice(choice, nonce, { from: player });
    await tx.wait();
    res.json({ message: "Choice revealed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
