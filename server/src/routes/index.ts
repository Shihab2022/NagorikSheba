import express from "express";
import { AuthRouter } from "../modules/auth/auth.routes";
import { GovernmentOfficesRouter } from "../modules/government-offices/government-offices.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    endPoint: AuthRouter,
  },
  {
    path: "/government-offices",
    endPoint: GovernmentOfficesRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.endPoint));
export const rootRouter = router;
