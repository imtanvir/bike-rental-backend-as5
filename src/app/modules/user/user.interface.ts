/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";
export type TImage = {
  id: string;
  url: string;
  isRemove: boolean;
};
export interface TUser {
  name: string;
  image: TImage[];
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "admin" | "user" | "superAdmin";
  lastLogin: string | null;
}
export interface TUserRoleUpdate {
  role: "admin" | "user" | "superAdmin";
}

export type TUserRole = keyof typeof USER_ROLE;

export interface ExtendModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  isPasswordMatched(
    plainPassword: string,
    hashPassword: string
  ): Promise<boolean>;
}
