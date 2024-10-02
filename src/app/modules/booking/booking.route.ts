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

// End riding and submit estimated time
router.put(
  "/end_ride/:id",
  authCheck(USER_ROLE.user),
  rentBikeController.rentEndSubmit
);

// accept bike and calculate total cost of ride by Admin only
router.put(
  "/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  rentBikeController.rentBikeReturn
);

// paid rental
router.put(
  "/paid/:id",
  authCheck(USER_ROLE.user),
  rentBikeController.rentCostPayment
);

router.get("/", authCheck(USER_ROLE.user), rentBikeController.userRentals);

export const RentalRoutes = router;
