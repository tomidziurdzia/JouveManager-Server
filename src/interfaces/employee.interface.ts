import { BusinessProps } from "./business.interface";

export interface EmployeeProps {
  id?: string;
  name: string;
  lastname: string;
  email: string;
  picture: string;
  password: string;
  token: string;
  type: "Administrative" | "Driver" | "Assistant" | "";
  business: BusinessProps;
}
