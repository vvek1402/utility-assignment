import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../utils/verifyGoogleToken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "";
export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.body;

  try {
    const payload = await verifyGoogleToken(token);
    const { sub, email, name, picture } = payload;

    const userToken = jwt.sign({ id: sub, email, name, picture }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token: userToken,
      user: { id: sub, email, name, picture },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid Google Token", error });
  }
};
