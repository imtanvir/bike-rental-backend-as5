import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
import AppError from "../../middleware/AppError";
import { sendImageToCloudinary } from "../../utils/uploadImageInCloudinary";
import { TBike, TImage } from "./bike.interface";
import { BikeModel } from "./bike.model";

const createBikeIntoDB = async (
  // eslint-disable-next-line no-undef
  files: Express.Multer.File[],
  payload: TBike
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (files) {
      const images: TImage[] = [];
      for (const file of files) {
        const imageName = `${Math.floor(Math.random() * 9000) + 100000}`;

        // send image to Cloudinary using buffer
        const { secure_url } = await sendImageToCloudinary(
          imageName,
          file.buffer
        );
        images.push({ id: imageName, url: secure_url as string });
      }
      payload.image = images;
    }
    const result = await BikeModel.create([payload], { session });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

const getAllBikes = async (
  brand: string,
  model: string,
  sortOrder: string,
  searchQuery: string
) => {
  let query: Record<string, unknown> = {};
  if (brand && brand.trim() !== "") {
    query.brand = { $regex: new RegExp(brand, "i") }; // "i" for case-insensitivity
  }

  if (model && model.trim() !== "") {
    query.model = { $regex: new RegExp(model, "i") };
  }

  type SortOrder = -1 | 1 | "asc" | "ascending" | "desc" | "descending";

  const sortOptions: { [key: string]: SortOrder } = {
    pricePerHour: sortOrder === "desc" ? -1 : 1,
  };
  if (searchQuery && searchQuery.trim() !== "") {
    const regex = new RegExp(searchQuery, "i");
    query.$or = [
      { name: { $regex: regex } },
      { brand: { $regex: regex } },
      { model: { $regex: regex } },
    ];
  }
  const result = await BikeModel.find(query).sort(sortOptions);

  return result;
};

const getSingleBike = async (_id: string) => {
  const result = await BikeModel.findById({ _id });
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
  getSingleBike,
  updateBikes,
  deleteBike,
};
