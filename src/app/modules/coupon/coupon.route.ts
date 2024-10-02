import express from "express";
import authCheck from "../../middleware/authCheck";
import { USER_ROLE } from "../user/user.constant";
import { CouponController } from "./coupon.controller";
const router = express.Router();

router.post(
  "/create",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  CouponController.createCoupon
);

router.get(
  "/",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  CouponController.getAllCoupons
);

router.put(
  "/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  CouponController.updateCoupon
);

export const CouponRoutes = router;
