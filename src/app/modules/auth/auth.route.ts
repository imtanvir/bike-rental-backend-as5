import express, { NextFunction, Request, Response } from "express";

import requestValidation from "../../middleware/requestValidation";
import { upload } from "../../utils/uploadImageInCloudinary";
import { AuthController } from "./auth.controller";
import { AuthValidationSchema } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  upload.array("file", 1),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
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
