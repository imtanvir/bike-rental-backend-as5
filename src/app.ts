import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import { Routers } from "./app/routes";
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.get("/api/v1", Routers);
app.use("/api", Routers);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
