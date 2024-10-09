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

// accept bike and calculate total cost of ride by Admin
const rentBikeReturnAcceptAndCostCalculate = catchAsync(async (req, res) => {
  const { id: rentedBikeId } = req.params;
  const result = await rentBikeServices.rentBikeReturnAcceptAndCostCalculate(
    rentedBikeId
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rental Bike return successfully",
    data: result,
  });
});

// After End riding and submit estimated time by user who booked
const rentEndSubmitByUser = catchAsync(async (req, res) => {
  const { id: rentalId } = req.params;
  const payload = req.body;
  const result = await rentBikeServices.rentEndSubmitByUser(rentalId, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rental end submitted by user successfully",
    data: result,
  });
});

// after admin accept bike and calculate total cost of ride, paid rental cost by user
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

  // convert boolean string to boolean
  const result = await rentBikeServices.userRentals(user);

  sendResponse(res, {
    success: result.length > 0 ? true : false,
    statusCode: result.length > 0 ? 200 : httpStatus.NOT_FOUND,
    message:
      result.length > 0 ? "Rentals retrieved successfully" : "No Data Found",
    data: result,
  });
});

// get single rental
const userSingleRental = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await rentBikeServices.userSingleRental(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single Rental retrieved successfully",
    data: result,
  });
});

// all rentals get
const allRental = catchAsync(async (req, res) => {
  const result = await rentBikeServices.allRentals();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Rentals retrieved successfully",
    data: result,
  });
});

const rentalDiscountCostApply = catchAsync(async (req, res) => {
  const { totalCost, id }: { totalCost: number; id: string } = req.body;
  const result = await rentBikeServices.rentalDiscountCostApply(totalCost, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Rentals retrieved successfully",
    data: result,
  });
});

export const rentBikeController = {
  rentBike,
  rentBikeReturnAcceptAndCostCalculate,
  userRentals,
  rentCostPayment,
  rentEndSubmitByUser,
  userSingleRental,
  allRental,
  rentalDiscountCostApply,
};
