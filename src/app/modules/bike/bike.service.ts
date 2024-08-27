import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import AppError from "../../middleware/AppError";
import { TBike } from "./bike.interface";
import { BikeModel } from "./bike.model";

const createBikeIntoDB = async (payload: TBike) => {
  const result = await BikeModel.create(payload);
  return result;
};

const getAllBikes = async () => {
  const result = await BikeModel.find();
  return result;
};

const updateBikes = async (
  id: string,
  user: JwtPayload,
  payload: Partial<TBike>
) => {
  const isBikeExist = await BikeModel.isBikeExist(id);

  if (!isBikeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not exist!");
  }

  const bikeIdValidation = (_id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(_id);
  };

  const BikeIdSchema = z.string().refine(bikeIdValidation, {
    message: "Invalid bike id format",
  });

  BikeIdSchema.parse(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }

  const result = await BikeModel.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteBike = async (_id: string) => {
  const isBikeExist = await BikeModel.isBikeExist(_id);

  if (!isBikeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not exist!");
  }

  const result = await BikeModel.findByIdAndDelete({ _id });

  return result;
};
export const BikeServices = {
  createBikeIntoDB,
  getAllBikes,
  updateBikes,
  deleteBike,
};
