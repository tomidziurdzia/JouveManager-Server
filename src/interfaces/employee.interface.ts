import { BusinessProps } from "./business.interface";
import { TravelProps } from "./travel.interface";

export interface EmployeeProps {
  _id?: string;
  name: string;
  lastname: string;
  email: string;
  picture?: string;
  password: string;
  type: "Administrative" | "Driver" | "Assistant" | "";
  business: BusinessProps;
  travels?: TravelProps[];
}
