import Travel from "../models/Travel";
import { TravelProps } from "../interfaces/travel.interface";
import { RequestBusiness } from "../interfaces/business.interface";
import { Response } from "express";
import Business from "../models/Business";
import Vehicle from "../models/Vehicle";
import { checkBusiness } from "../helpers/checkBusiness";
import Employee from "../models/Employee";
import mongoose from "mongoose";
import { VehicleProps } from "../interfaces/vehicle.interface";

const getTravels = async (req: RequestBusiness, res: Response) => {
  const travel = await Travel.find()
    .populate({
      path: "driver",
      select: "name lastname type picture",
    })
    .populate({ path: "assistant", select: "name lastname type picture" })
    .populate({ path: "vehicle", select: "patent model typeVehicle" })
    .where("business")
    .equals(req.business);

  res.json(travel);
};

const newTravel = async (req: RequestBusiness, res: Response) => {
  const { date, driver, assistant, vehicle }: TravelProps = req.body;

  const driverExist = await Employee.findById(driver);
  const assistantExist = await Employee.findById(assistant);
  const vehicleExist = await Vehicle.findById(vehicle);

  // Verifico que exista el chofer donde se ingresa el travel
  if (!driverExist) {
    const error = new Error("Driver does't exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!assistantExist) {
    const error = new Error("Assistant does't exist");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo, assistente y driver pertenezca al usuario logueado
  checkBusiness(driverExist, req.business);

  // Verifico los campos obligatorios
  if (!date) {
    const error = new Error("Date is required");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const newTravel = new Travel(req.body);
    newTravel.business = req.business!._id;

    vehicleExist?.travels.push(newTravel._id as any);
    await vehicleExist?.save();

    await newTravel.save();

    res.json(newTravel);
  } catch (error) {
    console.log(error);
  }
};

const getTravel = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;
  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const travel = await Travel.findById(id)
    .populate({
      path: "driver",
      select: "name lastname type picture",
    })
    .populate({ path: "assistant", select: "name lastname type picture" })
    .populate({ path: "vehicle", select: "patent model typeVehicle" });
  //TODO: Falta relacionar la tabla con los shipment

  if (!travel) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el travel pertenezca al usuario logueado
  if (travel.business.toString() !== req.business!._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  res.json(travel);
};

const editTravel = async (req: RequestBusiness, res: Response) => {
  const { date, driver, assistant, vehicle }: TravelProps = req.body;
  const { id } = req.params;
  const travel = await Travel.findById(id);
  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el travel pertenezca al usuario logueado
  if (travel?.business.toString() !== req.business!._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  travel!.date = date || travel?.date;
  travel!.driver = driver || travel?.driver;
  travel!.assistant = assistant || travel?.assistant;
  travel!.vehicle = vehicle || travel?.vehicle;

  try {
    const travelStored = await travel?.save();
    res.json(travelStored);
  } catch (error) {
    console.log(error);
  }
};

const deleteTravels = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const travel = await Travel.findById(id).populate("vehicle");
  const vehicle = await Vehicle.findById(travel?.vehicle);

  // Compruebo que exista la travel
  if (!travel) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que la plataforma pertenezca al usuario logueado
  if (travel.business.toString() !== req.business!._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  //TODO: No se puede eliminar un viaje que tiene shipment o ver como corregir eso para que al eliminar tambien se elimine los shipments

  try {
    await Promise.allSettled([
      await vehicle!.updateOne(
        { _id: vehicle?._id },
        { $pull: { travels: id } }
      ),
      await travel.deleteOne(),
    ]);
    res.json({ msg: "Travel successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getTravels, newTravel, getTravel, editTravel, deleteTravels };
