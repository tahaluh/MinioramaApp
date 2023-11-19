import { Router } from "express";
import userRouter from "../entities/user/userRouter";
import productRouter from "../entities/product/productRouter";
import orderRouter from "../entities/order/orderRouter";
import cartRouter from "../entities/cart/cartRouter";
import categoryRouter from "../entities/category/categoryRouter";

const router = Router();

router.use(userRouter);
router.use(productRouter);
router.use(orderRouter);
router.use(cartRouter);
router.use(categoryRouter);

export default router;
