import express, { Router } from "express";
import {
  getVehicles,
  newVehicle,
  getVehicle,
  editVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.route("/").get(checkAuth, getVehicles).post(checkAuth, newVehicle);

router
  .route("/:id")
  .get(checkAuth, getVehicle)
  .put(checkAuth, editVehicle)
  .delete(checkAuth, deleteVehicle);

export default router;
