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

const rentBikeReturnAcceptAndCostCalculate = async (_id: string) => {
  const isRentExist = (await RentalModel.findById(_id)) as TRental;
  if (!isRentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Rent details not exist!");
  } else if (isRentExist.isReturned !== false) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rented bike is already returned!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    let returnRentedBike: TRental | null = null;
    const bikeDetails = await BikeModel.findOne({ _id: isRentExist?.bikeId });

    const startTime = new Date(isRentExist?.startTime);
    const returnTime = new Date(isRentExist?.returnTime as Date);

    // Calculate the difference in milliseconds
    const differenceInMs = returnTime.getTime() - startTime.getTime();

    // Convert the difference to hours
    const differenceInHours = Math.round(differenceInMs / (1000 * 60 * 60));
    const hoursOfRented = differenceInHours === 0 ? 1 : differenceInHours;

    const totalCost: number =
      (bikeDetails?.pricePerHour as number) * hoursOfRented;
    const rentalDetails = await RentalModel.findById({ _id });

    if (rentalDetails && rentalDetails?.advancePaid > totalCost) {
      const checkWithAdvancePayment = rentalDetails?.advancePaid - totalCost;
      returnRentedBike = await RentalModel.findOneAndUpdate(
        { _id },
        {
          totalCost: totalCost,
          getBackAmount: checkWithAdvancePayment,
          pendingCalculation: false,
          isReturned: true,
          isPaid: true,
          isAvailable: true,
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
    } else if (rentalDetails && rentalDetails?.advancePaid < totalCost) {
      const checkWithAdvancePayment = totalCost - rentalDetails?.advancePaid;
      returnRentedBike = await RentalModel.findOneAndUpdate(
        { _id },
        {
          totalCost: checkWithAdvancePayment,
          pendingCalculation: false,
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
    } else {
      returnRentedBike = await RentalModel.findOneAndUpdate(
        { _id },
        {
          totalCost: 0,
          isPaid: true,
          isReturned: true,
          pendingCalculation: false,
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
    }

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
      isReturned: true,
      isAvailable: true,
    },
    {
      new: true,
    }
  );

  // eslint-disable-next-line no-unused-vars
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

const userRentals = async (user: JwtPayload) => {
  const { _id } = user;

  const result = await RentalModel.find({ userId: _id }).populate([
    "bikeId",
    "userId",
  ]);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User rentals not exist");
  }

  return result;
};

const rentEndSubmitByUser = async (
  rentId: string,
  bikeReturnTimeOfUser: { [key: string]: Date }
) => {
  const estimatedReturnTime = new Date(
    bikeReturnTimeOfUser?.estimatedReturnTime
  );

  const rent = await RentalModel.findById(rentId);
  if (!rent) {
    throw new AppError(httpStatus.NOT_FOUND, "Rent details not exist");
  }
  const returnTime = new Date().toISOString();
  const result = await RentalModel.findByIdAndUpdate(
    rentId,
    { pendingCalculation: true, estimatedReturnTime, returnTime },
    {
      new: true,
    }
  );

  return result;
};

const userSingleRental = async (rentalId: string) => {
  const result = await RentalModel.findById(rentalId).populate("bikeId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental details not exist");
  }

  return result;
};

const allRentals = async () => {
  const rentAll = await RentalModel.find({}).populate(["bikeId", "userId"]);
  return rentAll;
};

const rentalDiscountCostApply = async (totalCost: number, id: string) => {
  const isExist = (await RentalModel.findById({ _id: id })) as TRental;

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Rent details not exist!");
  } else if (isExist.isPaid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rent already paid!");
  }

  const rentAll = await RentalModel.findByIdAndUpdate(
    { _id: id },
    { totalCost, discountApplied: true },
    { new: true }
  ).populate(["bikeId", "userId"]);

  return rentAll;
};

export const rentBikeServices = {
  rentBike,
  rentBikeReturnAcceptAndCostCalculate,
  userRentals,
  rentCostPayment,
  rentEndSubmitByUser,
  userSingleRental,
  allRentals,
  rentalDiscountCostApply,
};
