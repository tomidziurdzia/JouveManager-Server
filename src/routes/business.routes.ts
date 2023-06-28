import express, { Router } from "express";
import {
  confirmToken,
  createBusiness,
  authenticationBusiness,
  forgetPassword,
  checkToken,
  newPassword,
  getUser,
} from "../controllers/business.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.post("/", createBusiness);
router.get("/confirm/:token", confirmToken);
router.post("/login", authenticationBusiness);
router.post("/forget-password", forgetPassword);
router.route("/forget-password/:token").get(checkToken).post(newPassword);
router.get("/perfil", checkAuth, getUser);

export default router;
