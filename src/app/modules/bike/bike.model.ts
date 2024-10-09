import { model, Schema } from "mongoose";
import { BikeExtend, TBike } from "./bike.interface";

const BikeSchema = new Schema<TBike, BikeExtend>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: [
      {
        _id: false,
        id: { type: String, required: true },
        url: { type: String, required: true },
        isRemove: { type: Boolean, default: false },
      },
    ],
    default: [],
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  cc: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  frameSize: {
    type: String,
    required: true,
  },
  tireSize: {
    type: String,
    required: true,
  },
  gears: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
});

BikeSchema.statics.isBikeExist = async function (id: string) {
  return await BikeModel.findById({ _id: id });
};
export const BikeModel = model<TBike, BikeExtend>("bikes", BikeSchema);
