import { Types } from "mongoose";

// Define a type alias for the rental model
export type TRental = {
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  startTime: Date;
  estimatedReturnTime: Date | null;
  returnTime: Date | null;
  totalCost: number;
  isReturned: boolean;
  advancePaid: number;
  pendingCalculation: boolean;
  isPaid: boolean;
};
