import { Types } from "mongoose";

export interface TCoupon {
  userId: Types.ObjectId;
  couponCode: string;
  discount: number;
  createDate: Date;
  isUsed: boolean;
  isExpired: boolean;
}
