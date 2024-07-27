import express from "express";
import { allMessages, sendMessage } from "../controllers/message.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Routes for messages
router.get("/:chatId", verifyToken, allMessages);
router.post("/", verifyToken, sendMessage);

export default router;