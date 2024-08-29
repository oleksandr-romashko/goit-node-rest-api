import { Router } from "express";

import {
  authRegisterUserReqBodyValidationMiddleware,
  authLoginUserReqBodyValidationMiddleware,
} from "../middlewares/authRequestValidationMiddleware.js";
import {
  loginUserServiceMiddleware,
  registerUserServiceMiddleware,
} from "../middlewares/authServiceCallMiddleware.js";
import { replyValidationMiddleware } from "../middlewares/replyValidationMiddleware.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post(
  "/register",
  authRegisterUserReqBodyValidationMiddleware,
  registerUserServiceMiddleware,
  authControllers.registerUser
);

authRouter.post(
  "/login",
  authLoginUserReqBodyValidationMiddleware,
  loginUserServiceMiddleware,
  replyValidationMiddleware("User"),
  authControllers.loginUser
);

export default authRouter;
