import { NextFunction, Request, Response } from "express";
import OrderService from "../services/order.service";

class OrderController {
  private service = new OrderService();

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const userIdTk = res.locals.user.id;
      const userRole = res.locals.user.role;

      const { status, message } = await this.service.get(
        userIdTk,
        userRole,
        +userId
      );
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.id;
      const { status, message } = await this.service.create(userId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = res.locals.user.id;
      const { status, message } = await this.service.cancel(+orderId, userId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
