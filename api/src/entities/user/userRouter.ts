import { Router } from "express";
import UserController from "./user.controller";
import { verifyToken } from "../../jwt/jwt";
import { adminGuard } from "../../middlewares/adminGuard";

const control = new UserController();

const userRouter = Router();

userRouter.get("/user", verifyToken, adminGuard, control.get.bind(control));
userRouter.post("/user", control.create.bind(control));
userRouter.patch("/user", verifyToken, control.update.bind(control));

userRouter.post("/login", control.login.bind(control));
userRouter.patch(
  "/change-password",
  verifyToken,
  control.changePassword.bind(control)
);

export default userRouter;
