import { Router } from "express";
import UserController from "../controllers/user.controller";

const control = new UserController();

const userRouter = Router();

userRouter.get("/user", control.get.bind(control));
userRouter.post("/login", control.login.bind(control));
userRouter.post("/user", control.create.bind(control));

export default userRouter;
