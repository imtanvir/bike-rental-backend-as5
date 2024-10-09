import httpStatus from "http-status";
import AppError from "../../middleware/AppError";
import { TCoupon } from "./coupon.interface";
import { CouponModel } from "./coupon.model";

const createCoupon = async (couponData: TCoupon) => {
  const coupon = await CouponModel.create(couponData);
  return coupon;
};

const couponCheck = async (couponCode: string, userId: string) => {
  const result = await CouponModel.find({ couponCode, userId }).populate(
    "userId"
  );

  if (result && result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found!");
  }

  return result;
};

const getAllCoupons = async () => {
  const result = await CouponModel.find({}).populate("userId");
  console.log({ couponS: result });
  return result;
};

const updateCoupon = async (couponData: Partial<TCoupon>, couponId: string) => {
  const coupon = await CouponModel.findByIdAndUpdate(
    { _id: couponId },
    couponData,
    {
      new: true,
    }
  );
  return coupon;
};

const deleteCoupon = async (couponId: string) => {
  const coupon = await CouponModel.findByIdAndDelete({ _id: couponId });
  return coupon;
};
export const CouponServices = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  couponCheck,
};
