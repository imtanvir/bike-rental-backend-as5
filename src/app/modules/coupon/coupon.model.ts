import { model, Schema } from "mongoose";
import { TCoupon } from "./coupon.interface";

const CouponSchema = new Schema<TCoupon>({
  couponCode: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
});

export const CouponModel = model<TCoupon>("coupon", CouponSchema);
