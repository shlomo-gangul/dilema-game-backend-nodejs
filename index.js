import dotenv from "dotenv";
import express from "express";
import { routerGT } from "./routes/gameTokenRoutes.js";
import { routerGF } from "./routes/gameFactoryRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/game-factory", routerGF);
app.use("/game-token", routerGT);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
