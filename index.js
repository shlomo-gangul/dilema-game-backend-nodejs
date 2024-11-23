import dotenv from "dotenv";
import express from "express";
import { routerDG } from "./routes/dillemaGameRoutes.js";
import { routerGF } from "./routes/gameFactoryRoutes.js";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use("/game-factory", routerGF);
app.use("/dillema-game", routerDG);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
