import { BikeModel } from "../bike/bike.model";
import { TTestimonial } from "./testimonial.interface";
import { TestimonialModel } from "./testimonial.model";

const createTestimonial = async (
  payload: TTestimonial,
  bikeTotalRating: number
) => {
  const { bikeId, rating } = payload;
  const result = await TestimonialModel.create(payload);

  if (result) {
    await BikeModel.findByIdAndUpdate(
      { _id: bikeId },
      { rating: rating, totalRating: bikeTotalRating + rating },
      { new: true }
    );
  }
  return result;
};

const getAllTestimonial = async () => {
  const result = await TestimonialModel.find({}).populate(["userId", "bikeId"]);
  if (!result) {
    throw new Error("Testimonial not found!");
  }
  return result;
};

export const TestimonialServices = {
  createTestimonial,
  getAllTestimonial,
};
