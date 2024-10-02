import httpStatus from "http-status";
import AppError from "../../middleware/AppError";
import { TUser, TUserRoleUpdate } from "./user.interface";
import { UserModel } from "./user.model";

const getProfile = async (email: string) => {
  // const result = await UserModel.isUserExist(email);
  const result = await UserModel.findOne({ email });
  return result;
};

const updateProfile = async (_id: string, payload: Partial<TUser>) => {
  const result = await UserModel.findByIdAndUpdate({ _id }, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist");
  }

  return result;
};

// Admin user services

const getAllUsers = async () => {
  const result = await UserModel.find({ role: "user" });
  return result;
};

const getAdmins = async () => {
  const result = await UserModel.find({
    role: { $in: ["admin", "superAdmin"] },
  });
  return result;
};

const updateRole = async (_id: string, payload: TUserRoleUpdate) => {
  const result = await UserModel.findByIdAndUpdate({ _id }, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist");
  }

  return result;
};

export const UserService = {
  getProfile,
  updateProfile,
  updateRole,
  getAllUsers,
  getAdmins,
};
