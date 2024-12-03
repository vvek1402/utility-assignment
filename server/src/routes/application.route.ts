import express from "express";
import {
  closeOtherTab,
  closeTab,
  getApplications,
  heartBeat,
} from "../controllers/application.controller";
import verifyToken from "../middleware/verifyToken";

const applicationRoutes = express.Router();

applicationRoutes.get("/", getApplications);
applicationRoutes.post("/heartbeat", verifyToken, heartBeat);
applicationRoutes.post("/close-tab", verifyToken, closeTab);
applicationRoutes.post("/close-other-tab", verifyToken, closeOtherTab);

export default applicationRoutes;
