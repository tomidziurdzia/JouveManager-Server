import express, { Router } from "express";
import {
  getTravels,
  newTravel,
  getTravel,
  editTravel,
  deleteTravels,
} from "../controllers/travel.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.route("/").get(checkAuth, getTravels).post(checkAuth, newTravel);

router
  .route("/:id")
  .get(checkAuth, getTravel)
  .put(checkAuth, editTravel)
  .delete(checkAuth, deleteTravels);

export default router;
