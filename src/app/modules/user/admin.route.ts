import express from "express";
import authCheck from "../../middleware/authCheck";
import { USER_ROLE } from "./user.constant";
import { UserController } from "./user.controller";

const router = express.Router();

router.put(
  "/user/:id",
  authCheck(USER_ROLE.superAdmin),
  //   requestValidation(UserValidation.userRoleUpdateSchema),
  UserController.updateUserRole
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
export const AdminRoutes = router;
