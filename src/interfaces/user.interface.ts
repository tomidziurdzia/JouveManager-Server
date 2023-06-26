import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserProps {
  id?: string;
  name: string;
  lastname: string;
  email: string;
  picture: string;
  password: string;
  confirmed: boolean;
  googleAccount: boolean;
  token: string;
  checkPassword(password: string): boolean;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload | { id: string; token: string };
  id?: string;
}
