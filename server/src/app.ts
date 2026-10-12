import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound, testingRoute } from "./constant/notFound";
import { rootRouter } from "./routes";
import { corsAllowOrigin } from "./constant";
import globalErrorHandler from "./helpars/globalErrorHandler";
const app = express();

app.use(cors(corsAllowOrigin));
app.use(express.json());
app.use(cookieParser());

app.get("/", testingRoute);
app.use("/api", rootRouter);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
