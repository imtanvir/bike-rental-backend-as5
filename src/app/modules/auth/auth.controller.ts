import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const signUpUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await AuthService.signUpUserIntoDB(userData);
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
  const { user, accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: accessToken,
    data: user,
  });
});
export const AuthController = {
  signUpUser,
  logInUser,
};
