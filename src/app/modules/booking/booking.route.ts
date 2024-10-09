import express from "express";
import authCheck from "../../middleware/authCheck";
import requestValidation from "../../middleware/requestValidation";
import { USER_ROLE } from "../user/user.constant";
import { rentBikeController } from "./booking.controller";
import { bookingValidationSchema } from "./booking.validation";

const router = express.Router();

// Get all rental
router.get(
  "/getAll",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  rentBikeController.allRental
);

router.put(
  "/discount-total-cost-update",
  authCheck(USER_ROLE.user),
  rentBikeController.rentalDiscountCostApply
);

// Logically user only can Rant a bike. Thats why we give only access this route to user
router.post(
  "/",
  authCheck(USER_ROLE.user),
  requestValidation(bookingValidationSchema.rentalBikeSchema),
  rentBikeController.rentBike
);

// End riding and submit estimated time by user who booked
router.put(
  "/end_ride/:id",
  authCheck(USER_ROLE.user),
  rentBikeController.rentEndSubmitByUser
);

// accept bike and calculate total cost of ride by Admin
router.put(
  "/rent-calculate/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  rentBikeController.rentBikeReturnAcceptAndCostCalculate
);

/* after admin accept bike and calculate total cost of ride, 

paid rental cost by - user */

router.put(
  "/paid/:id",
  authCheck(USER_ROLE.user),
  rentBikeController.rentCostPayment
);

// get single rental
router.get(
  "/:id",
  authCheck(USER_ROLE.user),
  rentBikeController.userSingleRental
);

router.get("/", authCheck(USER_ROLE.user), rentBikeController.userRentals);

// router.get("/", BikeControllers.getAllBike);

export const BookingRoutes = router;
