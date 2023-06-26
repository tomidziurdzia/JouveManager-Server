import { UserProps } from "../interfaces/user.interface";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema: Schema = new Schema<UserProps>(
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
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    googleAccount: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["administrative", "worker"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (passwordForm: string) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = model<UserProps>("User", userSchema);

export default User;
