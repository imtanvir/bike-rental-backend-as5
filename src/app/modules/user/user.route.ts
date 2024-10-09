import express, { NextFunction, Request, Response } from "express";

import authCheck from "../../middleware/authCheck";
import requestValidation from "../../middleware/requestValidation";
import { upload } from "../../utils/uploadImageInCloudinary";
import { USER_ROLE } from "./user.constant";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get(
  "/me",
  authCheck(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  UserController.getProfile
);

router.get(
  "/all-users",
  authCheck(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserController.getAllUsers
);

router.put(
  "/me/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  upload.array("file", 1),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  requestValidation(UserValidation.profileUpdateValidationSchema),
  UserController.updateProfile
);
export const UserRoutes = router;
