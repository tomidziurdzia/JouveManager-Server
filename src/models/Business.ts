import { Schema, model } from "mongoose";
import { BusinessProps } from "../interfaces/business.interface";
import bcrypt from "bcrypt";

const businessSchema: Schema = new Schema<BusinessProps>(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      default: "",
    },
    // employees: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Employee",
    //   },
    // ],
    // trucks: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Vehicle",
    //   },
    // ],
    // travels: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Travel",
    //   },
    // ],
    // shipment: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Shipment",
    //   },
    // ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

businessSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

businessSchema.methods.checkPassword = async function (passwordForm: string) {
  return await bcrypt.compare(passwordForm, this.password);
};

const Business = model<BusinessProps>("Business", businessSchema);

export default Business;
