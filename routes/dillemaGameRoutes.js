import express from "express";
import {
  getGameState,
  postJoinGmae,
  postCommitChoice,
  postRevealChoce,
} from "../controllers/dillemaGameController.js";

const routerDG = express.Router();

routerDG.get("/game-state", getGameState);
routerDG.post("/join-game", postJoinGmae);
routerDG.post("/commit-choice", postCommitChoice);
routerDG.post("/reveal-choice", postRevealChoce);

export { routerDG };
