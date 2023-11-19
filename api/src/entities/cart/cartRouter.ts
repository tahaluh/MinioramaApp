import { Router } from "express";
import { verifyToken } from "../../jwt/jwt";
import CartController from "./cart.controller";

const control = new CartController();

const cartRouter = Router();

cartRouter.get("/cart", verifyToken, control.get.bind(control));
cartRouter.put("/cart/:productId", verifyToken, control.cart.bind(control));
cartRouter.patch(
  "/cart/:productId",
  verifyToken,
  control.update.bind(control)
);
cartRouter.delete(
  "/cart/:productId",
  verifyToken,
  control.delete.bind(control)
);

export default cartRouter;
