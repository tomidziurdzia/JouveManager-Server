import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestBusiness } from "../interfaces/business.interface";
import Business from "../models/Business";

const checkAuth = async (
  req: RequestBusiness,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const decodedId = Object.values(decoded)[0];

      const checkBusiness = await Business.findById(decodedId).select(
        "-password -token -confirmed -createdAt -updatedAt"
      );

      if (checkBusiness) {
        req.business = checkBusiness;
      }
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "There was an error" });
    }
  }
};

export default checkAuth;
