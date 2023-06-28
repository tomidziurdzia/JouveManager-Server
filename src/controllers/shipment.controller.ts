import { RequestWithUser } from "../interfaces/user.interface";
import { Response } from "express";
import Shipment from "../models/Shipment";
import User from "../models/Employee";
import Travel from "../models/Travel";

const getShipments = async (req: RequestWithUser, res: Response) => {};

const newShipment = async (req: RequestWithUser, res: Response) => {
  const { from, to, client, description, travel } = req.body;

  const travelExist = await Travel.findById(travel);

  console.log(travelExist);

  // Campos obligatorios
  if (!from) {
    const error = new Error("From is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!to) {
    const error = new Error("To is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!client) {
    const error = new Error("Client is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!description) {
    const error = new Error("Description is required");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const newShipment = new Shipment(req.body);
    newShipment.user = req.user?.id;

    travelExist!.shipment.push(newShipment.id);
    await travelExist?.save();

    await newShipment.save();
    res.json(newShipment);
  } catch (error) {
    console.log(error);
  }
};

const getShipment = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const shipment = await Shipment.findById(id);

  // Verifico que el shipment pertenezca al usuario logueado
  if (shipment?.user.toString() !== req.user!.id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  if (!shipment) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  res.json(shipment);
};

const editShipment = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const shipment = await Shipment.findById(id);

  // Verifico que el shipment pertenezca al usuario logueado
  if (shipment?.user.toString() !== req.user!.id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  if (!shipment) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  shipment.from = req.body.from || shipment.from;
  shipment.to = req.body.to || shipment.to;
  shipment.client = req.body.client || shipment.client;
  shipment.description = req.body.description || shipment.description;
  shipment.delivered = req.body.delivered || shipment.delivered;
  shipment.reason = req.body.reason || shipment.reason;
  shipment.picture = req.body.picture || shipment.picture;

  try {
    const shipmentStored = await shipment.save();
    res.json(shipmentStored);
  } catch (error) {
    console.log(error);
  }
};

const deleteShipment = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const shipment = await Shipment.findById(id);

  // Verifico que el shipment pertenezca al usuario logueado
  if (shipment?.user.toString() !== req.user!.id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  if (!shipment) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await shipment.deleteOne();
    res.json({ msg: "Shipment successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getShipments, newShipment, getShipment, editShipment, deleteShipment };
