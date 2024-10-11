import { BikeModel } from "../bike/bike.model";
import { RentalModel } from "../booking/booking.model";
import { TTestimonial } from "./testimonial.interface";
import { TestimonialModel } from "./testimonial.model";

const createTestimonial = async (
  payload: TTestimonial,
  bikeTotalRating: number,
  rentalId: string
) => {
  const { bikeId, rating } = payload;
  const result = await TestimonialModel.create(payload);

  if (result) {
    await BikeModel.findByIdAndUpdate(
      { _id: bikeId },
      { $push: { rating: rating }, totalRating: bikeTotalRating + 1 },
      { new: true }
    );

    await RentalModel.findByIdAndUpdate(
      { _id: rentalId },
      { feedBackSubmitted: true },
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
