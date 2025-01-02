import express from "express";
import {
  getGameTokenBalance,
  mintedGameToken,
} from "../controllers/dillemaGameController.js";

const routerDG = express.Router();

routerDG.get("/game-token-balance", getGameTokenBalance);
routerDG.get("/minted-game-token", mintedGameToken);

export { routerDG };
