import { NextFunction, Request, Response } from "express";

const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = res.locals.user.role == "ADMIN";

    if (!isAdmin) return res.status(401).json({ message: "Unauthorized" });

    next();
  } catch (error) {
    next(error);
  }
};

export { adminGuard };
