import { EmployeeProps } from "../interfaces/employee.interface";
import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";
import { VehicleProps } from "../interfaces/vehicle.interface";
import { TravelProps } from "../interfaces/travel.interface";
import { ShipmentProps } from "../interfaces/shipment.interface";

export const checkBusiness = (
  type:
    | (Document<unknown, {}, EmployeeProps> &
        Omit<EmployeeProps & Required<{ _id: string }>, never>)
    | (Document<unknown, {}, ShipmentProps> &
        Omit<ShipmentProps & Required<{ _id: string }>, never>)
    | (Document<unknown, {}, VehicleProps> &
        Omit<VehicleProps & Required<{ _id: string }>, never>)
    | (Document<unknown, {}, TravelProps> &
        Omit<TravelProps & Required<{ _id: string }>, never>)
    | null,
  business: JwtPayload | { id: string; token: string } | undefined
) => {
  if (type!.business?.toString() !== business?.id.toString()) {
    throw new Error("Does not belong to the business logged in");
  }
};
