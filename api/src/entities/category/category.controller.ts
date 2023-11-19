import { NextFunction, Request, Response } from "express";
import CategoryService from "./category.service";

class CategoryController {
  private service = new CategoryService();

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
      const { name } = req.body;
      const { status, message } = await this.service.create(name);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const { categoryId } = req.params;
      const { status, message } = await this.service.update(+categoryId, name);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const { status, message } = await this.service.delete(+categoryId);
      res.status(status).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default CategoryController;
