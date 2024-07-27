import express from "express";
import {accessChat, fetchChats} from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// For 1-to-1 chat only
router.post("/", verifyToken, accessChat);
router.get("/", verifyToken, fetchChats);

export default router;
