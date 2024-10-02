import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BikesRoutes } from "../modules/bike/bike.route";
import { RentalRoutes } from "../modules/booking/booking.route";
import { CouponRoutes } from "../modules/coupon/coupon.route";
import { PaymentRoute } from "../modules/payment/payment.route";
import { TestimonialRoutes } from "../modules/testimonial/testimonial.route";
import { AdminRoutes } from "../modules/user/admin.route";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/bikes",
    route: BikesRoutes,
  },
  {
    path: "/rentals",
    route: RentalRoutes,
  },
  {
    path: "/testimonial",
    route: TestimonialRoutes,
  },
  {
    path: "/coupon",
    route: CouponRoutes,
  },
  {
    path: "/create-payment-intent",
    route: PaymentRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export const Routers = router;
