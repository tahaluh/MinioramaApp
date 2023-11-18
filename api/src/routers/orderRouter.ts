import { Router } from "express";
import OrderController from "../controller/order.controller";
import { verifyToken } from "../jwt/jwt";

const control = new OrderController();

const orderRouter = Router();

orderRouter.get("/order/:userId", verifyToken, control.get.bind(control));
orderRouter.post("/order", verifyToken, control.create.bind(control));

export default orderRouter;
