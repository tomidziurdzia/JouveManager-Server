import { Document } from "mongoose";
import { BusinessProps } from "./business.interface";
import { TravelProps } from "./travel.interface";

export interface VehicleProps extends Document {
  _id?: string;
  patent: string;
  model: string;
  typeVehicle: "chasis truck" | "balancin truck" | "semirremolque" | "tractor";
  business: BusinessProps;
  travels: TravelProps[];
  picture?: string;
}
