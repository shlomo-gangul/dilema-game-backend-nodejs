import express from "express";
import {
  getGameCount,
  getGameAtIndex,
} from "../controllers/gameFactoryController.js";

const routerGF = express.Router();

routerGF.get("/game-count", getGameCount);
routerGF.get("/game-at-index/:index", getGameAtIndex);

export { routerGF };
