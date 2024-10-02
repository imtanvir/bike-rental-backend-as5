import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CouponServices } from "./coupon.service";

const createCoupon = catchAsync(async (req, res) => {
  const couponData = req.body;
  const result = await CouponServices.createCoupon(couponData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon added successfully",
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req, res) => {
  const result = await CouponServices.getAllCoupons();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All coupons retrieved successfully",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const couponData = req.body;
  const couponId = req.params.id;
  const result = await CouponServices.updateCoupon(couponData, couponId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const couponId = req.params.id;
  const result = await CouponServices.deleteCoupon(couponId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon Deleted successfully",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
