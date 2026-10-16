import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { ServiceRoutes } from "../modules/Service/service.routes";
import { ServiceRequirementRoutes } from "../modules/ServiceRequirement/serviceRequirement.routes";
import { ServiceStepRoutes } from "../modules/ServiceStep/serviceStep.routes";
import { ServiceFeeRoutes } from "../modules/ServiceFee/serviceFee.routes";
import { ServiceSourceRoutes } from "../modules/ServiceSource/serviceSource.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/category", route: CategoryRoutes },
  { path: "/service", route: ServiceRoutes },
  { path: "/service-requirement", route: ServiceRequirementRoutes },
  { path: "/service-step", route: ServiceStepRoutes },
  { path: "/service-fee", route: ServiceFeeRoutes },
  { path: "/service-source", route: ServiceSourceRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
