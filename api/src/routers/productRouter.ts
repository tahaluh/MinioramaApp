import { Router } from "express";
import ProductController from "../controller/product.controller";
import { verifyToken } from "../jwt/jwt";

const control = new ProductController();

const productRouter = Router();

productRouter.get("/product", control.get.bind(control));
productRouter.post("/product", control.create.bind(control));
productRouter.patch(
  "/wishlist/:productId",
  verifyToken,
  control.wishlist.bind(control)
);

export default productRouter;
