import { NextFunction, Request, Response } from "express";
import UserService from "./user.service";

class UserController {
  private service = new UserService();

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, message } = await this.service.get();
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, message } = await this.service.login(req.body);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, message } = await this.service.create(req.body);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.id;
      const { status, message } = await this.service.update(req.body, userId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.id;
      const { status, message } = await this.service.changePassword(
        req.body,
        userId
      );
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
