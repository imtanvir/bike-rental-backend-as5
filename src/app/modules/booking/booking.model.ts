import { Schema, model } from "mongoose";
import { TRental } from "./booking.interface";

// Define the Mongoose schema for rental
const rentalSchema = new Schema<TRental>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "userId is required"],
    },
    bikeId: {
      type: Schema.Types.ObjectId,
      ref: "bikes",
      required: [true, "bikeId is required"],
    },
    startTime: {
      type: Date,
      required: true,
    },
    returnTime: {
      type: Date,
      default: null,
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const RentalModel = model<TRental>("Rental", rentalSchema);
