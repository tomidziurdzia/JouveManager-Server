import { Response } from "express";
import { VehicleProps } from "../interfaces/vehicle.interface";
import Vehicle from "../models/Vehicle";
import { RequestWithUser } from "../interfaces/user.interface";

const getVehicles = async (req: RequestWithUser, res: Response) => {
  // const vehicles = await Vehicle.find()
  //   .populate({ path: "travels", select: "km" })
  //   .where("user")
  //   .equals(req.user);
  // res.json(vehicles);
  const vehicles = await Vehicle.find().where("user").equals(req.user);

  res.json(vehicles);
};

const newVehicle = async (req: RequestWithUser, res: Response) => {
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
  vehicle.user = req.user!.id;
  try {
    const vehicleStored = await vehicle.save();
    res.json(vehicleStored);
  } catch (error) {
    console.log(error);
  }
};

const getVehicle = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  if (vehicle.user.toString() !== req.user!.id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  res.json(vehicle);
};

const editVehicle = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  if (vehicle.user.toString() !== req.user!.id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  vehicle.model = req.body.model || vehicle.model;
  vehicle.typeVehicle = req.body.typeVehicle || vehicle.typeVehicle;

  try {
    const vehicleStored = await vehicle.save();
    return res.json(vehicleStored);
  } catch (error) {
    console.log(error);
  }
};

const deleteVehicle = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  if (vehicle.user.toString() !== req.user!.id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await vehicle.deleteOne();
    res.json({ msg: "Vehicle successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getVehicles, newVehicle, getVehicle, editVehicle, deleteVehicle };
