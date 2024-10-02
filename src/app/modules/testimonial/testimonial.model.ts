import { model, Schema } from "mongoose";
import { TTestimonial } from "./testimonial.interface";

const TestimonialSchema = new Schema<TTestimonial>({
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
  message: {
    type: String,
    required: [true, "message is required"],
  },
  rating: {
    type: Number,
    required: [true, "rating is required"],
    default: 5,
  },
});

export const TestimonialModel = model<TTestimonial>(
  "testimonial",
  TestimonialSchema
);
