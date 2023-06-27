import { Schema, model } from "mongoose";
import { VehicleProps } from "../interfaces/vehicle.interface";

const vehicleSchema: Schema = new Schema<VehicleProps>(
  {
    patent: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    typeVehicle: {
      type: String,
      required: true,
      enum: ["Chasis Truck", "Balancin Truck", "Semirremolque"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    travels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Travel",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Vehicle = model<VehicleProps>("Vehicle", vehicleSchema);

export default Vehicle;
