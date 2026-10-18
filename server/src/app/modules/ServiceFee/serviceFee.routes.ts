import express from "express";
import { ServiceFeeControllers } from "./serviceFee.controllers";
import auth from "../../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.get("/:serviceId", ServiceFeeControllers.getServiceFees);
router.post("/", auth("ADMIN"), ServiceFeeControllers.createServiceFee);
router.patch("/:fee_id", auth("ADMIN"), ServiceFeeControllers.updateServiceFee);
router.delete("/:fee_id", auth("ADMIN"), ServiceFeeControllers.deleteServiceFee);

export const ServiceFeeRoutes = router;