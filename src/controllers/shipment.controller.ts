import { Response } from "express";
import Shipment from "../models/Shipment";
import Travel from "../models/Travel";
import { RequestBusiness } from "../interfaces/business.interface";
import { checkBusiness } from "../helpers/checkBusiness";

const getShipments = async (req: RequestBusiness, res: Response) => {
  const shipments = await Shipment.find()
    .populate({
      path: "travel",
      select:'date',
      populate: [{
        path: "driver",
        select: "name lastname email picture",
      },
      {
        path: "assistant",
          select: "name lastname email picture",
      },
      {
        path:'vehicle',
        select:'model patent picture typeVehicle'
      },
      {
        path:'semirremolque',
        select:'model patent picture typeVehicle'
      }
    ]
    })
    .where("business")
    .equals(req.business);

  res.json(shipments);
};

const newShipment = async (req: RequestBusiness, res: Response) => {
  const { from, to, client, description, travel } = req.body;

  const travelExist = await Travel.findById(travel);

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
    newShipment.business = req.business?._id;

    travelExist!.shipments.push(newShipment._id as any);
    await travelExist?.save();

    await newShipment.save();
    res.json(newShipment);
  } catch (error) {
    console.log(error);
  }
};

const getShipment = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const shipment = await Shipment.findById(id).populate("travel");

  // Verifico que el shipment pertenezca al usuario logueado
  checkBusiness(shipment, req.business);

  if (shipment?.business.toString() !== req.business!._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  if (!shipment) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  res.json(shipment);
};

const editShipment = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const shipment = await Shipment.findById(id);

  // Verifico que el shipment pertenezca al usuario logueado
  checkBusiness(shipment, req.business);

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

const deleteShipment = async (req: RequestBusiness, res: Response) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const shipment = await Shipment.findById(id).populate("travel");
  const travel = await Travel.findById(shipment?.travel._id);

  // Compruebo que exista la travel
  if (!shipment) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el shipment pertenezca al usuario logueado
  checkBusiness(shipment, req.business);
  checkBusiness(travel, req.business);

  //TODO: No puedo corregir esto
  try {
    await Promise.all([
      await travel!.updateOne({ $pull: { shipments: id } }),
      await shipment.deleteOne(),
    ]);
    res.json({ msg: "Shipment successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getShipments, newShipment, getShipment, editShipment, deleteShipment };
