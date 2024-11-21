require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const app = express();
const port = 3000;

// Load environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

// Set up the provider and wallet
const provider = new ethers.providers.InfuraProvider(
  "holesky",
  infuraProjectId
);
const wallet = new ethers.Wallet(privateKey, provider);

// ABI of the DillemaGame contract
const abi = [
  // Add the ABI of your DillemaGame contract here
];

// Create a contract instance
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Middleware to parse JSON requests
app.use(express.json());

// Example endpoint to get the game state
app.get("/game-state", async (req, res) => {
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
});

// Example endpoint to join the game
app.post("/join-game", async (req, res) => {
  try {
    const { player } = req.body;
    const tx = await contract.connect(wallet).joinGame({ from: player });
    await tx.wait();
    res.json({ message: "Player joined the game" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Example endpoint to commit a choice
app.post("/commit-choice", async (req, res) => {
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
});

// Example endpoint to reveal a choice
app.post("/reveal-choice", async (req, res) => {
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
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
