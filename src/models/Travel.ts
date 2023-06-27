import { Schema, model } from "mongoose";
import { TravelProps } from "../interfaces/travel.interface";

const travelSchema: Schema = new Schema<TravelProps>(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assistant: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    shipment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Shipment",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Travel = model<TravelProps>("Travel", travelSchema);

export default Travel;
