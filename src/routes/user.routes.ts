import express, { Router } from "express";
import {
  authUser,
  createUser,
  confirmToken,
  forgetPassword,
  checkToken,
  newPassword,
  getUser,
} from "../controllers/user.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.post("/", createUser);
router.get("/confirm/:token", confirmToken);
router.post("/login", authUser);
router.post("/forget-password", forgetPassword);
router.route("/forget-password/:token").get(checkToken).post(newPassword);
router.get("/perfil", checkAuth, getUser);

export default router;
