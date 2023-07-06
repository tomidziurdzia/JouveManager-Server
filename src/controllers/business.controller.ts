import { Response } from "express";
import {
  BusinessProps,
  RequestBusiness,
} from "../interfaces/business.interface";
import Business from "../models/Business";
import generateToken from "../helpers/generateToken";
import generateJWT from "../helpers/generateJWT";
import { emailForgetPassword, emailRegister } from "../helpers/mailService";

const createBusiness = async (req: RequestBusiness, res: Response) => {
  // Prevenir Business duplicados
  const { businessName, email, password }: BusinessProps = req.body;
  const businessExist = await Business.findOne({ email });

  if (businessExist) {
    const error = new Error("Business already registered");
    return res.status(400).json({ msg: error.message });
  }

  if (businessName === "") {
    const error = new Error("Business name cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (email === "") {
    const error = new Error("Email cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (password === "") {
    const error = new Error("Password cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  // Registrar nuevo usuario
  try {
    const newBusiness = new Business(req.body);

    // Enviar el email de confirmacion

    //Generar Token
    newBusiness.token = generateToken();

    emailRegister({
      businessName: newBusiness.businessName,
      email: newBusiness.email,
      token: newBusiness.token,
    });

    //Almacenar nuevo usuario
    await newBusiness.save();

    res.json({ msg: "Business successfully create, check your email" });
  } catch (error) {
    console.log(error);
  }
};

const confirmToken = async (req: RequestBusiness, res: Response) => {
  const { token } = req.params;
  const businessExist = await Business.findOne({ token });

  if (!businessExist) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }

  try {
    businessExist.confirmed = true;
    businessExist.token = "";
    await businessExist.save();
    res.json({ msg: "Your business has been confirmed, you can sign in" });
  } catch (error) {
    console.log(error);
  }
};

const authenticationBusiness = async (req: RequestBusiness, res: Response) => {
  const { email, password }: BusinessProps = req.body;

  // Comprobar si el usuario existe
  const businessExist = await Business.findOne({ email });

  if (email === "") {
    const error = new Error("Email cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (password === "") {
    const error = new Error("Password cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (!businessExist) {
    const error = new Error("Business doesn't exist");
    return res.status(400).json({ msg: error.message });
  }
  // Comprobar si el usuario esta confirmado
  if (!businessExist.confirmed) {
    const error = new Error("Your business has not been confirmed");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar password
  if (await businessExist.checkPassword(password)) {
    res.json({
      _id: businessExist._id,
      businessName: businessExist.businessName,
      email: businessExist.email,
      token: generateJWT(businessExist._id),
    });
  } else {
    const error = new Error("The password is incorrect");
    return res.status(403).json({ msg: error.message });
  }
};

const forgetPassword = async (req: RequestBusiness, res: Response) => {
  const { email } = req.body;

  // Comprobar si el business existe
  const businessExist = await Business.findOne({ email });
  if (!businessExist) {
    const error = new Error("Business doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    businessExist.token = generateToken();

    // Enviar email con instrucciones
    emailForgetPassword({
      email: businessExist.email,
      businessName: businessExist.businessName,
      token: businessExist.token,
    });
    await businessExist.save();

    res.json({ msg: "We have sent an email with instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req: RequestBusiness, res: Response) => {
  const { token } = req.params;
  const businessExist = await Business.findOne({ token });
  if (!businessExist) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  } else {
    res.json({ msg: "Token valid, business exists" });
  }
};

const newPassword = async (req: RequestBusiness, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const businessExist = await Business.findOne({ token });

  if (!businessExist) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }

  if (businessExist) {
    businessExist.password = password;
    businessExist.token = "";

    try {
      await businessExist.save();
      res.json({ msg: "Password successfully modified" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }
};

const getUser = (req: RequestBusiness, res: Response) => {
  const { business } = req;
  business!.token = generateJWT(business!._id);
  res.json(business);
};

export {
  createBusiness,
  confirmToken,
  authenticationBusiness,
  forgetPassword,
  checkToken,
  newPassword,
  getUser,
};
