import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { EmployeeProps } from "../interfaces/employee.interface";

const employeeSchema: Schema = new Schema<EmployeeProps>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
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
    picture: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["administrative", "worker", "assistant"],
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.checkPassword = async function (passwordForm: string) {
  return await bcrypt.compare(passwordForm, this.password);
};

const Employee = model<EmployeeProps>("Employee", employeeSchema);

export default Employee;
