import validateBody from "../decorators/validateBody.js";
import {
  authRegisterUserSchema,
  authLoginUserSchema,
} from "../schemas/authSchemas.js";

export const authRegisterUserReqBodyValidationMiddleware = validateBody(
  authRegisterUserSchema
);

export const authLoginUserReqBodyValidationMiddleware =
  validateBody(authLoginUserSchema);
