import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../middleware/AppError";
import {
  deleteImageFromCloudinary,
  sendImageToCloudinary,
} from "../../utils/uploadImageInCloudinary";
import { TImage, TUser, TUserRoleUpdate } from "./user.interface";
import { UserModel } from "./user.model";

const getProfile = async (email: string) => {
  // const result = await UserModel.isUserExist(email);
  const result = await UserModel.findOne({ email });
  return result;
};

const updateProfile = async (
  _id: string,
  payload: Partial<TUser>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any[]
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const images: TImage[] = [];

    const isUserExist = await UserModel.isUserExist(payload.email as string);

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
    }

    if (
      isUserExist?.image &&
      payload?.image &&
      payload.image !== undefined &&
      isUserExist?.image?.[0].isRemove !== payload?.image?.[0].isRemove
    ) {
      for (const img of payload.image) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const removeFromCloud = await deleteImageFromCloudinary(img.id);
      }
    }

    if (files.length > 0) {
      for (const file of files) {
        const imageName = `${Math.floor(Math.random() * 9000) + 100000}`;

        // send image to Cloudinary using buffer
        const { secure_url } = await sendImageToCloudinary(
          imageName,
          file.buffer
        );
        images.push({
          id: imageName,
          url: secure_url as string,
          isRemove: false,
        });
      }

      payload.image = [...images];
    }

    const result = await UserModel.findByIdAndUpdate({ _id }, payload, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// Admin user services

const getAllUsers = async () => {
  const result = await UserModel.find();
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

const userDelete = async (_id: string) => {
  const isUserExist = await UserModel.findById({ _id });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }

  const userImage = isUserExist?.image ?? [];
  for (const img of userImage) {
    await deleteImageFromCloudinary(img.id);
  }
  const result = await UserModel.findByIdAndDelete({ _id });

  return result;
};

const getSingleUser = async (_id: string) => {
  const result = await UserModel.findById({ _id });
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
  userDelete,
  getSingleUser,
};
