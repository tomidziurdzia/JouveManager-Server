import { Response } from "express";
import { VehicleProps } from "../interfaces/vehicle.interface";
import Vehicle from "../models/Vehicle";
import { RequestBusiness } from "../interfaces/business.interface";
import { checkBusiness } from "../helpers/checkBusiness";

const getVehicles = async (req: RequestBusiness, res: Response) => {
  // const vehicles = await Vehicle.find()
  //   .populate({ path: "travels", select: "km" })
  //   .where("business")
  //   .equals(req.business);
  // res.json(vehicles);
  const vehicles = await Vehicle.find().where("business").equals(req.business);

  res.json(vehicles);
};

const newVehicle = async (req: RequestBusiness, res: Response) => {
  const { patent, typeVehicle, model }: VehicleProps = req.body;

  //Comprobar vehiculos duplicados
  const vehicleExist = await Vehicle.findOne({ patent });

  if (vehicleExist) {
    const error = new Error("Patent already registered");
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar campos
  if (patent === "") {
    const error = new Error("Patent cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (!typeVehicle) {
    const error = new Error("Type vehicle cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  if (model === "") {
    const error = new Error("Model cannot be empty");
    return res.status(400).json({ msg: error.message });
  }

  // Guardar vehiculo
  const vehicle = new Vehicle(req.body);
  vehicle.business = req.business!.id;
  try {
    const vehicleStored = await vehicle.save();
    res.json(vehicleStored);
  } catch (error) {
    console.log(error);
  }
};

const getVehicle = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id);
  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  checkBusiness(vehicle, req.business);

  res.json(vehicle);
};

const editVehicle = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  checkBusiness(vehicle, req.business);

  vehicle.model = req.body.model || vehicle.model;
  vehicle.typeVehicle = req.body.typeVehicle || vehicle.typeVehicle;

  try {
    const vehicleStored = await vehicle.save();
    return res.json(vehicleStored);
  } catch (error) {
    console.log(error);
  }
};

const deleteVehicle = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  checkBusiness(vehicle, req.business);

  try {
    await vehicle.deleteOne();
    res.json({ msg: "Vehicle successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getVehicles, newVehicle, getVehicle, editVehicle, deleteVehicle };
