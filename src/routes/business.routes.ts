import express, { Router } from "express";
import {
  confirmToken,
  createBusiness,
} from "../controllers/business.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.post("/", createBusiness);
router.get("/confirm/:token", confirmToken);

export default router;
