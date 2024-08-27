import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BikeServices } from "./bike.service";
const createBike = catchAsync(async (req, res) => {
  const bikeData = req.body;
  const result = await BikeServices.createBikeIntoDB(bikeData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bike added successfully",
    data: result,
  });
});
const getAllBike = catchAsync(async (req, res) => {
  const result = await BikeServices.getAllBikes();
  const data = result.length > 0 || false;
  sendResponse(res, {
    success: data ? true : false,
    statusCode: data ? 200 : httpStatus.NOT_FOUND,
    message: data ? "Bikes retrieved successfully" : "No Data Found",
    data: result,
  });
});

const updateBike = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const bikeUpdateData = req.body;

  const result = await BikeServices.updateBikes(id, user, bikeUpdateData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bike updated successfully",
    data: result,
  });
});

const deleteBike = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await BikeServices.deleteBike(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bike deleted successfully",
    data: result,
  });
});

export const BikeControllers = {
  createBike,
  getAllBike,
  updateBike,
  deleteBike,
};
