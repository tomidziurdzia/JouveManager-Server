import { Schema, model } from "mongoose";
import { TravelProps } from "../interfaces/travel.interface";

const travelSchema: Schema = new Schema<TravelProps>(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    assistant: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    semirremolque: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      default:null
    },
    shipments: [
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
