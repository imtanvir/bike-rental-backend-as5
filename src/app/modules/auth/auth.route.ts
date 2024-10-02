import express from "express";
import requestValidation from "../../middleware/requestValidation";
import { AuthController } from "./auth.controller";
import { AuthValidationSchema } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  requestValidation(AuthValidationSchema.signUpValidationSchema),
  AuthController.signUpUser
);
router.post(
  "/login",
  requestValidation(AuthValidationSchema.logInValidationSchema),
  AuthController.logInUser
);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
