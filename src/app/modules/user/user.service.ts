import httpStatus from "http-status";
import AppError from "../../middleware/AppError";
import { TUser } from "./user.interface";
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

export const UserService = { getProfile, updateProfile };
