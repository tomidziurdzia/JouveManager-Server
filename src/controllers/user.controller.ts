import { Response } from "express";
import generateToken from "../helpers/generateToken";
import { RequestWithUser, UserProps } from "../interfaces/user.interface";
import User from "../models/Employee";
import generateJWT from "../helpers/generateJWT";

const createUser = async (req: RequestWithUser, res: Response) => {
  // Prevenir usuarios duplicados
  const { email, name, lastname, password, type }: UserProps = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error("User already registered");
    return res.status(400).json({ msg: error.message });
  }

  if (email === "") {
    const error = new Error("Email cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (name === "") {
    const error = new Error("Name cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (lastname === "") {
    const error = new Error("Lastname cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (password === "") {
    const error = new Error("Password cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (!type) {
    const error = new Error("Type cannot be empty");
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

const confirmToken = async (req: RequestWithUser, res: Response) => {
  const { token } = req.params;
  const userExist = await User.findOne({ token });

  if (!userExist) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userExist.confirmed = true;
    userExist.token = "";
    await userExist.save();
    res.json({ msg: "Your account has been confirmed, you can sign in" });
  } catch (error) {
    console.log(error);
  }
};

const authUser = async (req: RequestWithUser, res: Response) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const userExist = await User.findOne({ email });
  if (!userExist) {
    const error = new Error("User doesn't exist");
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!userExist.confirmed) {
    const error = new Error("Your account has not been confirmed");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar password
  if (await userExist.checkPassword(password)) {
    res.json({
      id: userExist.id,
      name: userExist.name,
      lastname: userExist.lastname,
      email: userExist.email,
      token: generateJWT(userExist.id),
    });
  } else {
    const error = new Error("The password is incorrect");
    return res.status(403).json({ msg: error.message });
  }
};

const forgetPassword = async (req: RequestWithUser, res: Response) => {
  const { email } = req.body;

  // Comprobar si el usuario existe
  const userExist = await User.findOne({ email });
  if (!userExist) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    userExist.token = generateToken();
    await userExist.save();

    res.json({ msg: "We have sent an email with instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req: RequestWithUser, res: Response) => {
  const { token } = req.params;

  const userExist = await User.findOne({ token });

  if (!userExist) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  } else {
    res.json({ msg: "Token valid, user exists" });
  }
};

const newPassword = async (req: RequestWithUser, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const userExist = await User.findOne({ token });

  if (userExist) {
    userExist.password = password;
    userExist.token = "";

    try {
      await userExist.save();
      res.json({ msg: "Password successfully modified" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }
};

const getUser = (req: RequestWithUser, res: Response) => {
  const { user } = req;
  user!.token = generateJWT(user!.id);
  res.json(user);
};

export {
  authUser,
  createUser,
  confirmToken,
  forgetPassword,
  checkToken,
  newPassword,
  getUser,
};
