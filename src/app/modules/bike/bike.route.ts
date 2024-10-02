import express, { NextFunction, Request, Response } from "express";
import authCheck from "../../middleware/authCheck";
import requestValidation from "../../middleware/requestValidation";
import { upload } from "../../utils/uploadImageInCloudinary";
import { USER_ROLE } from "../user/user.constant";
import { BikeControllers } from "./bike.controller";
import { BikeValidationSchema } from "./bike.validation";

const router = express.Router();
// Admin only Can create bike
router.post(
  "/",
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
  requestValidation(BikeValidationSchema.bikeValidationSchema),
  BikeControllers.createBike
);

// Get all bike. Access can be user, non user or Admin

router.get("/", BikeControllers.getAllBike);

router.get("/:id", BikeControllers.getSingleBike);
// Admin only can Update bikes
router.put(
  "/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  requestValidation(BikeValidationSchema.bikeUpdateValidationSchema),
  BikeControllers.updateBike
);

router.delete(
  "/:id",
  authCheck(USER_ROLE.admin, USER_ROLE.superAdmin),
  BikeControllers.deleteBike
);

export const BikesRoutes = router;
