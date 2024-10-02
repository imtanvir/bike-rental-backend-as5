import express from "express";
import authCheck from "../../middleware/authCheck";
import { USER_ROLE } from "../user/user.constant";
import { TestimonialController } from "./testimonial.controller";

const router = express.Router();

router.post(
  "/create",
  authCheck(USER_ROLE.user),
  TestimonialController.createTestimonial
);

export const TestimonialRoutes = router;
