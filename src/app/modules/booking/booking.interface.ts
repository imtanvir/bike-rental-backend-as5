import { Types } from "mongoose";

// Define a type alias for the rental model
export type TRental = {
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  startTime: string;
  estimatedReturnTime: Date | null;
  returnTime: Date | null;
  totalCost: number;
  isReturned: boolean;
  advancePaid: number;
  getBackAmount?: number;
  pendingCalculation: boolean;
  feedBackSubmitted: boolean;
  isPaid: boolean;
  discountApplied: boolean;
};
