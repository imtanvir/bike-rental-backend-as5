import { z } from "zod";
const isValidISODate = (val: string) => {
  const date = new Date(val);
  return !isNaN(date.getTime());
};

const rentalBikeSchema = z.object({
  body: z.object({
    bikeId: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
      message: "Invalid bike id format",
    }),
    startTime: z
      .string()
      .refine(isValidISODate, {
        message: "Invalid date format or value",
      })
      .transform((val) => new Date(val)), // Transform string to Date
  }),
});

export const bookingValidationSchema = {
  rentalBikeSchema,
};
