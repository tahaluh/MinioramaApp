import { NextFunction, Request, Response } from "express";
import ProductService from "../services/product.service";

class ProductController {
  private service = new ProductService();

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, message } = await this.service.get();
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

  async wishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const userId = res.locals.user.id;

      const { status, message } = await this.service.wishlist(
        +productId,
        userId
      );
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
