import { EmployeeProps } from "../interfaces/employee.interface";
import { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";
import { VehicleProps } from "../interfaces/vehicle.interface";

export const checkBusiness = (
  type:
    | (Document<unknown, {}, EmployeeProps> &
        Omit<EmployeeProps & { _id: Types.ObjectId }, never>)
    | null
    | (Document<unknown, {}, VehicleProps> &
        Omit<VehicleProps & { _id: Types.ObjectId }, never>)
    | null,
  business: JwtPayload | { id: string; token: string } | undefined
) => {
  if (type!.business?.toString() !== business?.id.toString()) {
    throw new Error("Employee does not belong to business");
  }
};
