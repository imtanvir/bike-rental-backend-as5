import express from "express";
import authCheck from "../../middleware/authCheck";
import requestValidation from "../../middleware/requestValidation";
import { USER_ROLE } from "../user/user.constant";
import { rentBikeController } from "./booking.controller";
import { bookingValidationSchema } from "./booking.validation";

const router = express.Router();
// Logically user only can Rant a bike. Thats why we give only access this route to user
router.post(
  "/",
  authCheck(USER_ROLE.user),
  requestValidation(bookingValidationSchema.rentalBikeSchema),
  rentBikeController.rentBike
);

router.put(
  "/:id/return",
  authCheck(USER_ROLE.admin),
  rentBikeController.rentBikeReturn
);

router.get("/", authCheck(USER_ROLE.user), rentBikeController.userRentals);

export const RentalRoutes = router;
