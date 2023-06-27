export interface VehicleProps {
  id?: string;
  patent: string;
  model: string;
  typeVehicle: "Chasis Truck" | "Balancin Truck" | "Semirremolque";
  user: Object;
  travels: string[];
}

//TODO: Agregar una imagen
