export interface ShipmentProps {
  id?: string;
  user: Object;
  travel: Object;
  from: string;
  to: string;
  client: string;
  description: string;
  delivered: boolean;
  reason: string;
  picture: string;
}
