import { Request, Response } from "express";
import { applications } from "../utils/constant";
import NodeCache from "node-cache";

interface CustomRequest extends Request {
  userid?: string;
}
const sessionCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
export const getApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.json(applications);
};

interface CustomRequest extends Request {
  userId?: string;
}

export const heartBeat = (req: CustomRequest, res: Response): void => {
  const { userId, applicationId, tabId } = req.body;

  const sessionKey = `${userId}-${applicationId}`;
  const activeTabs = sessionCache.get<string[]>(sessionKey) || [];

  if (activeTabs.includes(tabId)) {
    res.status(200).json({ conflict: false });
  } else if (activeTabs.length > 0) {
    res.status(200).json({ conflict: true });
  } else {
    activeTabs.push(tabId);
    sessionCache.set(sessionKey, activeTabs);
    res.status(200).json({ conflict: false });
  }
};

export const closeTab = (req: CustomRequest, res: Response): void => {
  const { userId, applicationId, tabId } = req.body;

  const sessionKey = `${userId}-${applicationId}`;
  const activeTabs = sessionCache.get<string[]>(sessionKey);

  if (activeTabs) {
    const updatedTabs = activeTabs.filter((id) => id !== tabId);

    if (updatedTabs.length === 0) {
      sessionCache.del(sessionKey);
    } else {
      sessionCache.set(sessionKey, updatedTabs);
    }
  }

  res.status(200).json({ message: "Tab closed successfully" });
};

export const closeOtherTab = (req: CustomRequest, res: Response): void => {
  const { userId, applicationId, tabId } = req.body;
  const sessionKey = `${userId}-${applicationId}`;

  sessionCache.set(sessionKey, [tabId]);

  res.status(200).json({ message: "Other tabs logged out" });
};
