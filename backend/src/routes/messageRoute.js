import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getUsers,
  getMessage,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);
router.get("/:id", protectRoute, getMessage);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
