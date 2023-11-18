import { Router } from "express";
import ProductController from "../controller/product.controller";

const control = new ProductController();

const productRouter = Router();

productRouter.get("/product", control.get.bind(control));
productRouter.post("/product", control.create.bind(control));

export default productRouter;
