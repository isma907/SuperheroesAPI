import express from "express";
import {
  addItem as addHero,
  deleteItem,
  getHeroById,
  filterUserByObj as searchHero,
  updateItem as updateHero,
} from "../controllers/superheroes.controller";

const router = express.Router();
router.get("/", searchHero);
router.post("/add", addHero);
router.put("/update", updateHero);
router.delete("/deleteHero/:id", deleteItem);
router.get("/getHeroById/:id", getHeroById);

export default router;
