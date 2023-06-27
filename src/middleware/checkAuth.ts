import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";
import User from "../models/User";

const checkAuth = async (
  req: RequestWithUser,
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

      const checkUser = await User.findById(decodedId).select(
        "-password -token -confirmed -createdAt -updatedAt"
      );

      if (checkUser) {
        req.user = checkUser;
      }
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "There was an error" });
    }
  }
};

export default checkAuth;
