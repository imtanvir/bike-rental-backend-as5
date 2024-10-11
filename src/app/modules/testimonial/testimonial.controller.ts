import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TTestimonial } from "./testimonial.interface";
import { TestimonialServices } from "./testimonial.service";

const createTestimonial = catchAsync(async (req, res) => {
  const {
    data,
    bikeTotalRating,
    rentalId,
  }: { data: TTestimonial; bikeTotalRating: number; rentalId: string } =
    req.body;
  const result = await TestimonialServices.createTestimonial(
    data,
    bikeTotalRating,
    rentalId
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Testimonial added successfully",
    data: result,
  });
});

const getAllTestimonial = catchAsync(async (req, res) => {
  const result = await TestimonialServices.getAllTestimonial();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Testimonial retrieved successfully",
    data: result,
  });
});

export const TestimonialController = {
  createTestimonial,
  getAllTestimonial,
};
