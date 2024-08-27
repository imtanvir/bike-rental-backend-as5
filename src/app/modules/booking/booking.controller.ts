import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { rentBikeServices } from "./booking.service";

const rentBike = catchAsync(async (req, res) => {
  const rentalData = req.body;
  const user = req.user;

  const result = await rentBikeServices.rentBike(user?._id, rentalData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rental created successfully",
    data: result,
  });
});

const rentBikeReturn = catchAsync(async (req, res) => {
  const { id: rentedBikeId } = req.params;
  const result = await rentBikeServices.rentBikeReturn(rentedBikeId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rental Bike return successfully",
    data: result,
  });
});

const userRentals = catchAsync(async (req, res) => {
  const user: JwtPayload = req.user;
  const result = await rentBikeServices.userRentals(user);

  sendResponse(res, {
    success: result.length > 0 ? true : false,
    statusCode: result.length > 0 ? 200 : httpStatus.NOT_FOUND,
    message:
      result.length > 0 ? "Rentals retrieved successfully" : "No Data Found",
    data: result,
  });
});
export const rentBikeController = {
  rentBike,
  rentBikeReturn,
  userRentals,
};
