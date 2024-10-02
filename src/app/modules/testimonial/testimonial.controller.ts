import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TestimonialServices } from "./testimonial.service";

const createTestimonial = catchAsync(async (req, res) => {
  const testimonialData = req.body;
  const result = await TestimonialServices.createTestimonial(testimonialData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Testimonial added successfully",
    data: result,
  });
});

export const TestimonialController = {
  createTestimonial,
};
