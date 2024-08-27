import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../middleware/AppError";
import { TUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { TAuthSignUp } from "./auth.interface";
import { createToken } from "./auth.utils";

const signUpUserIntoDB = async (payload: TAuthSignUp) => {
  const isUserExist = await UserModel.isUserExist(payload.email);
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already Exist!");
  }
  const result = await UserModel.create(payload);
  return result;
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

  const jwtPayload: TUser = { ...user.toObject(), password: "" };
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
    user,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  signUpUserIntoDB,
  logInUser,
};
