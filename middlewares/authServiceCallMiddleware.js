import serviceWrapper from "../decorators/serviceWrapper.js";
import authServices from "../services/authServices.js";

export const registerUserServiceMiddleware = serviceWrapper(
  authServices.registerUser
);

export const loginUserServiceMiddleware = serviceWrapper(
  authServices.loginUser
);
