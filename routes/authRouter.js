import { Router } from "express";

import authenticate from "../middlewares/authenticateMiddleware.js";
import {
  authRegisterUserReqBodyValidationMiddleware,
  authLoginUserReqBodyValidationMiddleware,
} from "../middlewares/authRequestValidationMiddleware.js";
import {
  loginUserServiceMiddleware,
  registerUserServiceMiddleware,
} from "../middlewares/authServiceCallMiddleware.js";
import { replyValidationMiddleware } from "../middlewares/replyValidationMiddleware.js";
import uploadImageMiddleware from "../middlewares/uploadImageMiddleware.js";

import fileUploadValidationMiddleware from "../middlewares/fileUploadValidationMiddleware.js";
import multerErrorHandlingMiddleware from "../middlewares/multerErrorHandlingMiddleware.js";
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

authRouter.post("/logout", authenticate, authControllers.logoutUser);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.patch(
  "/avatars",
  authenticate,
  uploadImageMiddleware.single("avatar"),
  multerErrorHandlingMiddleware,
  fileUploadValidationMiddleware,
  authControllers.updateAvatar
);

export default authRouter;
