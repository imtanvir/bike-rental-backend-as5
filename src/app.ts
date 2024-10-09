import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import Stripe from "stripe";
import config from "./app/config";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import { Routers } from "./app/routes";
const app: Application = express();
export const stripe = new Stripe(config.stripe_sk ?? "");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bike-rental-frontend-as5-gx.vercel.app",
    ],
    credentials: true,
  })
);

// app.get("/api/v1", Routers);
app.use("/api", Routers);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
