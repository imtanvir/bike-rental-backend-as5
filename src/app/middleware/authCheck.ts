import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";
import AppError from "./AppError";

const authCheck = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization as string;
    // Exclude the Bearer from token
    const token = bearerToken?.split(" ")[1];
    if (token === "" || !token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This user is not authorized !"
      );
    }

    // check if token hacked or invalid by refresh token
    const refreshToken = req.cookies;
    const refreshTokenDecoded = jwt.verify(
      refreshToken.refreshToken,
      config.jwt_refresh_secret as string
    ) as JwtPayload;
    console.log({
      refreshTokenDecoded,
    });
    // Verify Token and retrieve data from it
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized user request!");
    }

    const isUserExist = await UserModel.isUserExist(decoded?.email);
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (
      !refreshTokenDecoded?.exp ||
      currentTime > refreshTokenDecoded.exp ||
      !decoded?.exp ||
      currentTime > decoded.exp
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token session expired!");
    }
    console.log(decoded.role, requiredRole);
    if (requiredRole && !requiredRole.includes(decoded.role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User don't have access to this route!"
      );
    }

    req.user = decoded;
    next();
  });
};

export default authCheck;
