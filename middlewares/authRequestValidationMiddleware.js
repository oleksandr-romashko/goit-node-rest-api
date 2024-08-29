import validateBody from "../decorators/validateBody.js";
import { authRegisterUserSchema } from "../schemas/authSchemas.js";

export const registerUserReqBodyValidationMiddleware = validateBody(
  authRegisterUserSchema
);
