import { Router } from "express";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";
import cartRouter from "./cartRouter";

const router = Router();

router.use(userRouter);
router.use(productRouter);
router.use(orderRouter);
router.use(cartRouter);

export default router;
