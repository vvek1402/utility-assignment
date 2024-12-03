import express from "express";
import { googleLogin } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/google", googleLogin);

export default authRoutes;