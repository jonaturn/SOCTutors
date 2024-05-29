import express from 'express';
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login); // will be prefixed with auth/ so it becomes auth/login later

export default router;