import express from "express";
import authCheck from "../../middleware/authCheck";
import requestValidation from "../../middleware/requestValidation";
import { USER_ROLE } from "../user/user.constant";
import { BikeControllers } from "./bike.controller";
import { BikeValidationSchema } from "./bike.validation";

const router = express.Router();
// Admin only Can create bike
router.post(
  "/",
  authCheck(USER_ROLE.admin),
  requestValidation(BikeValidationSchema.bikeValidationSchema),
  BikeControllers.createBike
);

// Get all bike. Access can be user, non user or Admin

router.get("/", BikeControllers.getAllBike);
// Update bike
router.put(
  "/:id",
  authCheck(USER_ROLE.admin),
  requestValidation(BikeValidationSchema.bikeUpdateValidationSchema),
  BikeControllers.updateBike
);

router.delete("/:id", authCheck(USER_ROLE.admin), BikeControllers.deleteBike);

export const BikesRoutes = router;
