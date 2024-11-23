import express from "express";
import {
  postCreateGame,
  getGameCount,
  getGameAtIndex,
} from "../controllers/gameFactoryController.js";

const routerGF = express.Router();

routerGF.get("/game-count", getGameCount);
routerGF.post("/create-game", postCreateGame);
routerGF.get("/game-at-index/:index", getGameAtIndex);

export { routerGF };
