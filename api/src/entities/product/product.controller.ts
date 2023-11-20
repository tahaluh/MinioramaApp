import { NextFunction, Request, Response } from "express";
import ProductService from "./product.service";

class ProductController {
  private service = new ProductService();

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, page = 0, limit = 10, search } = req.query;

      let categories: string[] = [];

      if (typeof category === "string") {
        categories = category.split(",");
      } else if (Array.isArray(category)) {
        categories = category.map(String);
      }
      const { status, message } = await this.service.get(
        +page,
        +limit,
        categories,
        search as string
      );
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
      const { productId } = req.params;
      const { status, message } = await this.service.update(
        req.body,
        productId
      );
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { status, message } = await this.service.delete(productId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 0, limit = 10, search } = req.query;

      const userId = res.locals.user.id;
      const { status, message } = await this.service.getWishlist(
        userId,
        +page,
        +limit,
        search as string
      );
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
