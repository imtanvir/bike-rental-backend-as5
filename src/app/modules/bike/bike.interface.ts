import { Model } from "mongoose";

export interface TBike {
  name: string;
  description: string;
  pricePerHour: number;
  isAvailable?: boolean;
  cc: number;
  year: number;
  model: string;
  brand: string;
}

export interface BikeExtend extends Model<TBike> {
  // eslint-disable-next-line no-unused-vars
  isBikeExist(id: string): Promise<TBike>;
}
