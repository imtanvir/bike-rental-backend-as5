import { Model } from "mongoose";
export type TImage = {
  id: string;
  url: string;
  isRemove: boolean;
};
export type TFeedback = {
  email: string;
  message: string;
};
export interface TBike {
  name: string;
  image: TImage[] | null;
  description: string;
  pricePerHour: number;
  isAvailable?: boolean;
  rating?: number;
  totalRating?: number;
  cc: number;
  year: number;
  model: string;
  brand: string;
  weight: string;
  frameSize: string;
  tireSize: string;
  gears: string;
  features: string[];
}

export interface BikeExtend extends Model<TBike> {
  // eslint-disable-next-line no-unused-vars
  isBikeExist(id: string): Promise<TBike>;
}
