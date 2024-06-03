import express from "express";
import { 
    getUser, 
    getUserFriends, 
    addRemoveFriend 
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); //this is a query string
router.get("/:id/friends", verifyToken, getUserFriends); //this is a query string to get list of friends

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); //this is a query string

export default router;