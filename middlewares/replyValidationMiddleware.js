import validateResult from "../decorators/validateResult.js";

export const replyValidationMiddleware = instanceName =>
  validateResult(instanceName);
