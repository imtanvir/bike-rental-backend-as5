import express, { NextFunction, Request, Response } from "express";

import authCheck from "../../middleware/authCheck";
import requestValidation from "../../middleware/requestValidation";
import { upload } from "../../utils/uploadImageInCloudinary";
import { USER_ROLE } from "./user.constant";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

// update user by admin
router.put(
  "/user/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
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
router.get(
  "/users",
  authCheck(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserController.getAllUsers
);

router.get(
  "/admins",
  authCheck(USER_ROLE.superAdmin),
  UserController.getAdmins
);
router.delete(
  "/delete-user/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.deleteUser
);
export const AdminRoutes = router;
