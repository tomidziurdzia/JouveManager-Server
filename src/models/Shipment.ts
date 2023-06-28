import { Schema, model } from "mongoose";
import { ShipmentProps } from "../interfaces/shipment.interface";

const shipmentSchema: Schema = new Schema<ShipmentProps>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },
    travel: {
      type: Schema.Types.ObjectId,
      ref: "Travel",
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Shipment = model<ShipmentProps>("Shipment", shipmentSchema);

export default Shipment;
