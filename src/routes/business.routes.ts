import express, { Router } from "express";
import {
  confirmToken,
  createBusiness,
  authenticationBusiness,
} from "../controllers/business.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.post("/", createBusiness);
router.get("/confirm/:token", confirmToken);
router.post("/login", authenticationBusiness);

export default router;
