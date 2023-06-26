import { Response } from "express";
import { RequestWithUser } from "interfaces/user.interface";

const authUser = (req: RequestWithUser, res: Response) => {};
const createUser = (req: RequestWithUser, res: Response) => {};
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
