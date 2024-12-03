import { Request, Response } from "express";
import { applications } from "../utils/constant";

export const getApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.json(applications);
};


