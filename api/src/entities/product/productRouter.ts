import { Router } from "express";
import ProductController from "./product.controller";
import { verifyToken } from "../../jwt/jwt";
import { adminGuard } from "../../middlewares/adminGuard";

const control = new ProductController();

const productRouter = Router();

productRouter.get("/product", control.get.bind(control));
productRouter.post(
  "/product",
  verifyToken,
  adminGuard,
  control.create.bind(control)
);
productRouter.patch(
  "/product/:productId",
  verifyToken,
  adminGuard,
  control.update.bind(control)
);
productRouter.delete(
  "/product/:productId",
  verifyToken,
  adminGuard,
  control.delete.bind(control)
);

productRouter.patch(
  "/wishlist/:productId",
  verifyToken,
  adminGuard,
  control.wishlist.bind(control)
);

export default productRouter;
