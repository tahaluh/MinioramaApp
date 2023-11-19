import { Router } from "express";
import { verifyToken } from "../jwt/jwt";
import CategoryController from "../controllers/category.controller";
import { adminGuard } from "../middlewares/adminGuard";

const control = new CategoryController();

const categoryRouter = Router();

categoryRouter.get("/category", control.get.bind(control));
categoryRouter.post(
  "/category",
  verifyToken,
  adminGuard,
  control.create.bind(control)
);
categoryRouter.patch(
  "/category/:categoryId",
  verifyToken,
  adminGuard,
  control.update.bind(control)
);
categoryRouter.delete(
  "/category/:categoryId",
  verifyToken,
  adminGuard,
  control.delete.bind(control)
);

export default categoryRouter;
