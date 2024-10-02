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

const rentEndSubmit = catchAsync(async (req, res) => {
  const { id: rentalId } = req.params;
  const payload = req.body;
  const result = await rentBikeServices.rentEndSubmit(rentalId, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rental end submitted by user successfully",
    data: result,
  });
});

const rentCostPayment = catchAsync(async (req, res) => {
  const { id: rentalId } = req.params;
  const result = await rentBikeServices.rentCostPayment(rentalId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rental Bike payment successful",
    data: result,
  });
});

const userRentals = catchAsync(async (req, res) => {
  const user: JwtPayload = req.user;
  const { isReturned } = req.query;

  // convert boolean string to boolean
  const isReturnedBoolean: boolean = isReturned === "true";
  const result = await rentBikeServices.userRentals(user, isReturnedBoolean);

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
  rentCostPayment,
  rentEndSubmit,
};
