import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
import AppError from "../../middleware/AppError";
import { feedbackMailSend } from "../../utils/feedbackMailSend";
import {
  deleteImageFromCloudinary,
  sendImageToCloudinary,
} from "../../utils/uploadImageInCloudinary";
import { TBike, TFeedback, TImage } from "./bike.interface";
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
        images.push({
          id: imageName,
          url: secure_url as string,
          isRemove: false,
        });
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
    _id: sortOrder === "asc" ? -1 : 1,
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
  files: any[],
  user: JwtPayload,
  payload: Partial<TBike>
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const images: TImage[] = [];
    const isBikeExist = await BikeModel.isBikeExist(id);

    if (!isBikeExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Bike not exist!");
    }
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
    }

    const bikeIdValidation = (_id: string): boolean => {
      return /^[0-9a-fA-F]{24}$/.test(_id);
    };

    const BikeIdSchema = z.string().refine(bikeIdValidation, {
      message: "Invalid bike id format",
    });

    BikeIdSchema.parse(id);
    if (
      isBikeExist?.image &&
      payload?.image &&
      payload.image !== undefined &&
      isBikeExist?.image?.[0].isRemove !== payload?.image?.[0].isRemove
    ) {
      for (const img of payload.image) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const removeFromCloud = await deleteImageFromCloudinary(img.id);
      }
    }

    if (files.length > 0) {
      for (const file of files) {
        const imageName = `${Math.floor(Math.random() * 9000) + 100000}`;

        // send image to Cloudinary using buffer
        const { secure_url } = await sendImageToCloudinary(
          imageName,
          file.buffer
        );
        images.push({
          id: imageName,
          url: secure_url as string,
          isRemove: false,
        });
      }

      payload.image = [...images];
    }

    const result = await BikeModel.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const deleteBike = async (_id: string) => {
  const isBikeExist = await BikeModel.isBikeExist(_id);
  if (!isBikeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not exist!");
  }

  const bikeImage = isBikeExist?.image ?? [];
  for (const img of bikeImage) {
    await deleteImageFromCloudinary(img.id);
  }
  const result = await BikeModel.findByIdAndDelete({ _id });

  return result;
};
const sendFeedback = async (feedbackData: TFeedback) => {
  try {
    await feedbackMailSend(feedbackData.email, feedbackData.message);
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Feedback failed!");
  }
};
export const BikeServices = {
  createBikeIntoDB,
  getAllBikes,
  getSingleBike,
  updateBikes,
  deleteBike,
  sendFeedback,
};
