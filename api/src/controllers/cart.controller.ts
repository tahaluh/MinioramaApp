import { NextFunction, Request, Response } from "express";
import CartService from "../services/cart.service";

class CartController {
  private service = new CartService();

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.id;

      const { status, message } = await this.service.get(userId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async cart(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const userId = res.locals.user.id;

      const { status, message } = await this.service.cart(+productId, userId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const userId = res.locals.user.id;
      const { quantity } = req.body;

      const { status, message } = await this.service.update(
        +productId,
        userId,
        quantity
      );
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const userId = res.locals.user.id;

      const { status, message } = await this.service.delete(+productId, userId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default CartController;
