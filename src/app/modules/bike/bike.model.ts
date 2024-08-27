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
  pricePerHour: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
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
});

BikeSchema.statics.isBikeExist = async function (id: string) {
  return await BikeModel.findById({ _id: id });
};
export const BikeModel = model<TBike, BikeExtend>("bikes", BikeSchema);
