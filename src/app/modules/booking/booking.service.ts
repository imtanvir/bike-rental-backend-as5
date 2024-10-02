/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import AppError from "../../middleware/AppError";
import { BikeModel } from "../bike/bike.model";
import { TRental } from "./booking.interface";
import { RentalModel } from "./booking.model";

const rentBike = async (userId: string, payload: TRental) => {
  const { bikeId } = payload;
  payload.userId = new Types.ObjectId(userId);
  const isBikeExist = await BikeModel.findById(bikeId);
  if (!isBikeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not exist. Rental failed.");
  } else if (isBikeExist.isAvailable === false) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike is not available!");
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Change Bike status
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const changeBikeAvailableStatus = await BikeModel.findByIdAndUpdate(
      { _id: bikeId },
      { isAvailable: false },
      { new: true, session }
    );

    // Rent bike
    const result = await RentalModel.create([payload], { session });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.CONFLICT, "Rent bike failed!");
  }
};

const rentBikeReturn = async (_id: string) => {
  const isRentExist = await RentalModel.findById(_id);
  if (!isRentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike rent not exist!");
  } else if (isRentExist.isReturned !== false) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rented bike is already returned!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const bikeDetails = await BikeModel.findOne({ _id: isRentExist?.bikeId });

    // Rent details update operation
    // UTC time format
    const started_time: Date = new Date(isRentExist?.startTime);
    const return_time: Date = new Date();
    // convert UTC time to BTS (Bangladesh Standard time) and calculate rent bill according Bangladesh time zone
    const startedBTStime = new Date(
      started_time.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );
    const timeIs = new Date();
    const returnBTStime = new Date(
      timeIs.toLocaleString("en-us", { timeZone: "Asia/Dhaka" })
    );

    const calculateRentDuration: number =
      returnBTStime.getTime() - startedBTStime.getTime();
    const calculateRentHours = Math.ceil(
      calculateRentDuration / (1000 * 60 * 60)
    );

    const totalCost: number =
      (bikeDetails?.pricePerHour as number) * calculateRentHours;

    // But return the Bike Return time UTC time zone as a value
    const returnRentedBike = await RentalModel.findOneAndUpdate(
      { _id },
      {
        returnTime: return_time,
        totalCost: totalCost,
        pendingCalculation: false,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!returnRentedBike) {
      throw new AppError(httpStatus.NOT_FOUND, "Rent details not exist");
    }

    await session.commitTransaction();
    await session.endSession();
    return returnRentedBike;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.CONFLICT, "Rented bike return failed!");
  }
};

const rentCostPayment = async (rentId: string) => {
  const rent = await RentalModel.findById(rentId);

  if (!rent) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental details not exist");
  }

  const result = await RentalModel.findOneAndUpdate(
    { _id: rentId },
    {
      isPaid: true,
    },
    {
      new: true,
    }
  );

  const updateStatus = await BikeModel.findByIdAndUpdate(
    {
      _id: rent?.bikeId,
    },
    {
      isAvailable: true,
    },
    {
      new: true,
    }
  );

  return result;
};

const userRentals = async (user: JwtPayload, isReturned: boolean) => {
  let query: Record<string, unknown> = {};
  if (isReturned === true) {
    query.isReturned = true;
  } else if (isReturned === false) {
    query.isReturned = false;
  }
  const { _id } = user;

  const result = await RentalModel.find({ userId: _id, ...query }).populate(
    "bikeId"
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User rentals not exist");
  }

  return result;
};

const rentEndSubmit = async (
  rentId: string,
  newReturnTime: { [key: string]: Date }
) => {
  const estimatedReturnTime = new Date(newReturnTime?.estimatedReturnTime);
  const rent = await RentalModel.findById(rentId);
  if (!rent) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental details not exist");
  }

  const result = await RentalModel.findByIdAndUpdate(
    rentId,
    { pendingCalculation: true, estimatedReturnTime },
    {
      new: true,
    }
  );

  return result;
};
export const rentBikeServices = {
  rentBike,
  rentBikeReturn,
  userRentals,
  rentCostPayment,
  rentEndSubmit,
};
