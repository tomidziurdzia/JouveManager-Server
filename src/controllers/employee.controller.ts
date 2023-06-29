import { Response } from "express";
import { RequestBusiness } from "../interfaces/business.interface";
import Employee from "../models/Employee";
import { EmployeeProps } from "../interfaces/employee.interface";

//   id?: string;
//   name: string;
//   lastname: string;
//   email: string;
//   picture: string;
//   password: string;
//   type: "Administrative" | "Driver" | "Assistant" | "";
//   business: BusinessProps;

const getEmployees = async (req: RequestBusiness, res: Response) => {
  const employees = await Employee.find()
    .where("business")
    .equals(req.business);

  res.json(employees);
};

const createEmployee = async (req: RequestBusiness, res: Response) => {
  const { name, lastname, email, password, type } = req.body;

  if (!name) {
    const error = new Error("Name is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!lastname) {
    const error = new Error("Lastname is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!email) {
    const error = new Error("Email is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!password) {
    const error = new Error("Password is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!type) {
    const error = new Error("Type is required");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const newEmployee = new Employee(req.body);
    newEmployee.business = req.business?.id;

    await newEmployee.save();
    res.json(newEmployee);
  } catch (error) {
    console.log(error);
  }
};

const getEmployee = async (req: RequestBusiness, res: Response) => {};

const editEmployee = async (req: RequestBusiness, res: Response) => {};

const deleteEmployee = async (req: RequestBusiness, res: Response) => {};

export {
  getEmployees,
  createEmployee,
  getEmployee,
  editEmployee,
  deleteEmployee,
};
