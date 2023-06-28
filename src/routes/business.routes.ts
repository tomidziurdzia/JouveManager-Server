import express, { Router } from "express";
import { createBusiness } from "../controllers/business.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.route("/").post(createBusiness);

export default router;
