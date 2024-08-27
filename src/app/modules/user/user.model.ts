import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../config";
import { ExtendModel, TUser } from "./user.interface";
const userSchema = new Schema<TUser, ExtendModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Hash the password to secure
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.dcrypt_salt_round)
  );
  next();
});

// Not sending password field in document

userSchema.post("save", function (doc, next) {
  // set empty value for password and it will not send value in client
  doc.password = "";
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await UserModel.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashPassword: string
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

// userSchema.statics.isUserExist = async function(plainPassword:string, hashPassword:string) {
//   return await UserModel.findOne()
// }
export const UserModel = model<TUser, ExtendModel>("user", userSchema);
