import { Response } from "express";
import generateToken from "../helpers/generateToken";
import { RequestWithUser } from "../interfaces/user.interface";
import User from "../models/User";

const createUser = async (req: RequestWithUser, res: Response) => {
  // Prevenir usuarios duplicados
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error("User already registered");
    return res.status(400).json({ msg: error.message });
  }

  // Registrar nuevo usuario
  try {
    const newUser = new User(req.body);
    // Generar token
    newUser.token = generateToken();

    // Almacenar nuevo usuario
    await newUser.save();

    res.json({ msg: "User successfully create, check your email" });
  } catch (error) {
    console.log(error);
  }
};

const authUser = (req: RequestWithUser, res: Response) => {};

const confirmToken = (req: RequestWithUser, res: Response) => {};

const forgetPassword = (req: RequestWithUser, res: Response) => {};

const checkToken = (req: RequestWithUser, res: Response) => {};

const newPassword = (req: RequestWithUser, res: Response) => {};

const getUser = (req: RequestWithUser, res: Response) => {};

export {
  authUser,
  createUser,
  confirmToken,
  forgetPassword,
  checkToken,
  newPassword,
  getUser,
};
