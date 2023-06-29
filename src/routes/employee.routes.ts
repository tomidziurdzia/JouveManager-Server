import express, { Router } from "express";
import {
  getEmployees,
  createEmployee,
  getEmployee,
  editEmployee,
  deleteEmployee,
} from "../controllers/employee.controller";
import checkAuth from "../middleware/checkAuth";

const router: Router = express.Router();

router.route("/").get(checkAuth, getEmployees).post(checkAuth, createEmployee);

router
  .route("/:id")
  .get(checkAuth, getEmployee)
  .put(checkAuth, editEmployee)
  .delete(checkAuth, deleteEmployee);

export default router;
