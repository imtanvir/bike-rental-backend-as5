import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../middleware/AppError";
import { verifyToken } from "../../utils/verifyToken";
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
  console.log({ refreshToken, accessToken });

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
