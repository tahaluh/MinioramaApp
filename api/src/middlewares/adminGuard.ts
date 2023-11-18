import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../database/models/User";

const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = res.locals.user.role == UserRoles.ADMIN;

    if (!isAdmin) return res.status(401).json({ message: "Unauthorized" });

    next();
  } catch (error) {
    next(error);
  }
};

export { adminGuard };
