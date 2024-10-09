import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../middleware/AppError";
import { sendImageToCloudinary } from "../../utils/uploadImageInCloudinary";
import { verifyToken } from "../../utils/verifyToken";
import { TImage, TUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { TAuthSignUp } from "./auth.interface";
import { createToken } from "./auth.utils";

const signUpUserIntoDB = async (
  // eslint-disable-next-line no-undef
  files: Express.Multer.File[],
  payload: TAuthSignUp
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const isUserExist = await UserModel.isUserExist(payload.email);
    if (isUserExist) {
      throw new AppError(httpStatus.CONFLICT, "User already Exist!");
    }

    if (files) {
      const images: TImage[] = [];
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
      payload.image = images;
    }
    const result = await UserModel.create(payload);

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

const logInUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }
  const checkPass = await UserModel.isPasswordMatched(
    password,
    user?.password as string
  );
  if (!checkPass) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password!");
  }

  const updateLastLogin = await UserModel.findByIdAndUpdate(
    user._id,
    { lastLogin: new Date() },
    { new: true }
  );

  const jwtPayload: TUser = {
    ...user.toObject(),
    password: "",
    lastLogin: updateLastLogin?.lastLogin as string,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    jwtPayload,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (payload: string) => {
  const decode = verifyToken(
    payload,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decode;

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }

  const jwtPayload: TUser = {
    ...user.toObject(),
    password: "",
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_access_expires_in as string
  );

  return accessToken;
};

export const AuthService = {
  signUpUserIntoDB,
  logInUser,
  refreshToken,
};
