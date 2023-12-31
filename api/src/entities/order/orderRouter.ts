import { Router } from "express";
import OrderController from "./order.controller";
import { verifyToken } from "../../jwt/jwt";

const control = new OrderController();

const orderRouter = Router();

orderRouter.get("/order/:userId", verifyToken, control.get.bind(control));
orderRouter.post("/order", verifyToken, control.create.bind(control));
orderRouter.patch(
  "/cancel-order/:orderId",
  verifyToken,
  control.cancel.bind(control)
);

export default orderRouter;
