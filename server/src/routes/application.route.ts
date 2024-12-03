import express from "express";
import {
  getApplications,
} from "../controllers/application.controller";
import verifyToken from "../middleware/verifyToken";

const applicationRoutes = express.Router();

applicationRoutes.get("/", getApplications);

export default applicationRoutes;
