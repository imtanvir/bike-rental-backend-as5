import express from "express";
import authCheck from "../../middleware/authCheck";
import { USER_ROLE } from "../user/user.constant";
import { PaymentController } from "./payment.controller";
const router = express.Router();

router.post(
  "/advance",
  authCheck(USER_ROLE.user),
  PaymentController.advancePayment
);

export const PaymentRoute = router;
