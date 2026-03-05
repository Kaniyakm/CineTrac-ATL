import express from "express";
import {
  getStudios,
  getMapPins,
  getStudioById,
  getStudiosNear,
  createStudio,
  updateStudio
} from "../controllers/studioController.js";

const router = express.Router();

router.get("/", getStudios);
router.get("/map-pins", getMapPins);
router.get("/near", getStudiosNear);
router.get("/:id", getStudioById);
router.post("/", createStudio);
router.put("/:id", updateStudio);

export default router;
