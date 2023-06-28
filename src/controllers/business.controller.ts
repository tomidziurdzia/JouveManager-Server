import { Response } from "express";
import {
  BusinessProps,
  RequestBusiness,
} from "../interfaces/business.interface";
import Business from "../models/Business";
import generateToken from "../helpers/generateToken";

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

    //Generar Token
    newBusiness.token = generateToken();

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
export { createBusiness, confirmToken };
