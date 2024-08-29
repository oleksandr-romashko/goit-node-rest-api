import { Router } from "express";

import { registerUserReqBodyValidationMiddleware } from "../middlewares/authRequestValidationMiddleware.js";
import { registerUserServiceMiddleware } from "../middlewares/authServiceCallMiddleware copy.js";
import { authReplyValidationMiddleware } from "../middlewares/authReplyValidationMiddleware.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post(
  "/register",
  registerUserReqBodyValidationMiddleware,
  registerUserServiceMiddleware,
  authReplyValidationMiddleware,
  authControllers.registerUser
);

export default authRouter;
