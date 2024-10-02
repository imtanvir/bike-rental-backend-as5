import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  // const atoken = req.headers.authorization;
  const result = await UserService.getProfile(user.email);
  if (!result) {
    return sendResponse(res, {
      success: false,
      message: "User profile data not found!",
      statusCode: httpStatus.NOT_FOUND,
      data: result,
    });
  }
  sendResponse(res, {
    success: true,
    message: "User profile retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const { _id } = user;
  const payload = req.body;
  const result = await UserService.updateProfile(_id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

// Admin access and task for updating user management
const getAdmins = catchAsync(async (req, res) => {
  const result = await UserService.getAdmins();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Admin are retrieved successfully",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserService.updateRole(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User role updated successfully",
    data: result,
  });
});

export const UserController = {
  getProfile,
  updateProfile,
  updateUserRole,
  getAllUsers,
  getAdmins,
};
