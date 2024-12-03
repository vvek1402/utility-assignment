import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends Request {
  userid?: string;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): any => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      req.userid = (decoded as JwtPayload).id;

      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
  }
};

export default verifyToken;
