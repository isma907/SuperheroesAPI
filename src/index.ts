import express from "express";
import cors from "cors";

import superHeroesRoute from "./routes/superheroes";
const PORT = 4000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/superheroes", superHeroesRoute);

async function main() {
  try {
    app.listen(PORT);
    console.log(`Server Running at port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}

main();
