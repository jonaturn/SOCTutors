import express from "express";
import { getFeedPosts, getUserPosts, likePost, commentPost, solutionPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/*UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
//router.patch("/:id/solution", verifyToken, solutionPost);
router.patch("/:id/solution", solutionPost);

export default router;