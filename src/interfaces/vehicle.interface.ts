import { BusinessProps } from "./business.interface";
import { TravelProps } from "./travel.interface";

export interface VehicleProps {
  id?: string;
  patent: string;
  model: string;
  typeVehicle: "Chasis Truck" | "Balancin Truck" | "Semirremolque" | "Tractor";
  business: BusinessProps;
  travels: TravelProps[];
  picture?: string;
}
