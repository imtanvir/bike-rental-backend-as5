export interface TCoupon {
  couponCode: string;
  discount: number;
  expiryDate: Date;
  isUsed: boolean;
  isExpired: boolean;
}
