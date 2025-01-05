import express from "express";
import {
  getGameTokenBalance,
  mintedGameToken,
} from "../controllers/gameTokenController.js";

const routerGT = express.Router();

routerGT.get("/game-token-balance", getGameTokenBalance);
routerGT.get("/minted-game-token", mintedGameToken);

export { routerGT };
