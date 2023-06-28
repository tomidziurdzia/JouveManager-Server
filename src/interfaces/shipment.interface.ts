import { BusinessProps } from "./business.interface";
import { TravelProps } from "./travel.interface";

export interface ShipmentProps {
  id?: string;
  business: BusinessProps;
  travel: TravelProps;
  from: string;
  to: string;
  client: string;
  description: string;
  delivered: boolean;
  reason?: string;
  picture?: string;
}
