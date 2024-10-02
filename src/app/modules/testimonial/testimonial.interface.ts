import { ObjectId } from "mongoose";

export interface TTestimonial {
  userId: ObjectId;
  bikeId: ObjectId;
  message: string;
  rating: number;
}
