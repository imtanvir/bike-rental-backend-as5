import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const signUpUser = catchAsync(async (req, res) => {
  const userData = req.body;
  if (!req.files) {
    throw new Error("User Photo not provided!");
  }
  const result = await AuthService.signUpUserIntoDB(
    // eslint-disable-next-line no-undef
    req?.files as Express.Multer.File[],
    userData
  );
  // remove password field from response due to security purpose even its value now empty.
  const userResponse = { ...result.toObject(), password: undefined };
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully!",
    data: userResponse,
  });
});

const logInUser = catchAsync(async (req, res) => {
  const loginCredential = req.body;
  const result = await AuthService.logInUser(loginCredential);
  const { jwtPayload, accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env !== "development",
    httpOnly: true,
    sameSite: "none",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: accessToken,
    data: jwtPayload,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies;

  const result = await AuthService.refreshToken(refreshToken.refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token retrieve successfully!",
    data: result,
  });
});
export const AuthController = {
  signUpUser,
  logInUser,
  refreshToken,
};
