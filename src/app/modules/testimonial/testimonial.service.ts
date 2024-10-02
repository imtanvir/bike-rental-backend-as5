import { TTestimonial } from "./testimonial.interface";
import { TestimonialModel } from "./testimonial.model";

const createTestimonial = async (payload: TTestimonial) => {
  const result = await TestimonialModel.create(payload);
  return result;
};

export const TestimonialServices = {
  createTestimonial,
};
