import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";

const secret = process.env.JWT_SECRET as string;

const sign = (
  payload: { id: number; email: string; name: string; role: string },
  expiresIn = "1d"
) => {
  const jwtConfig: SignOptions = {
    algorithm: "HS256",
    expiresIn,
  };
  return jwt.sign(payload, secret, jwtConfig);
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, secret);
    res.locals.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export { sign, verifyToken };
