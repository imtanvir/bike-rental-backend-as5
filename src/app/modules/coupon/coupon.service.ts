import { TCoupon } from "./coupon.interface";
import { CouponModel } from "./coupon.model";

const createCoupon = async (couponData: TCoupon) => {
  const coupon = await CouponModel.create(couponData);
  return coupon;
};

const getAllCoupons = async () => {
  const result = await CouponModel.find({});
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
};
