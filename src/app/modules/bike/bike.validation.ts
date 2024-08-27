import { z } from "zod";
const bikeValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .trim()
      .min(1, "Name cannot be empty"),

    description: z
      .string({
        required_error: "Description is required",
      })
      .min(1, "Description cannot be empty"),

    pricePerHour: z
      .number({
        required_error: "Price per hour is required",
      })
      .positive("Price per hour must be a positive number"),

    isAvailable: z
      .boolean({
        required_error: "Availability status is required",
      })
      .optional()
      .default(true),

    cc: z
      .number({
        required_error: "Engine capacity (cc) is required",
      })
      .int("Engine capacity must be an integer")
      .positive("Engine capacity must be a positive integer"),

    year: z
      .number({
        required_error: "Manufacturing year is required",
      })
      .int("Manufacturing year must be an integer")
      .min(1885, "Manufacturing year must be 1885 or later"),

    model: z
      .string({
        required_error: "Model is required",
      })
      .min(1, "Model cannot be empty"),

    brand: z
      .string({
        required_error: "Brand is required",
      })
      .min(1, "Brand cannot be empty"),
  }),
});

const bikeUpdateValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, "Name cannot be empty")
      .optional(),

    description: z
      .string({
        required_error: "Description is required",
      })
      .min(1, "Description cannot be empty")
      .optional(),

    pricePerHour: z
      .number({
        required_error: "Price per hour is required",
      })
      .positive("Price per hour must be a positive number")
      .optional(),

    isAvailable: z
      .boolean({
        required_error: "Availability status is required",
      })
      .optional(),

    cc: z
      .number({
        required_error: "Engine capacity (cc) is required",
      })
      .int("Engine capacity must be an integer")
      .positive("Engine capacity must be a positive integer")
      .optional(),

    year: z
      .number({
        required_error: "Manufacturing year is required",
      })
      .int("Manufacturing year must be an integer")
      .min(1885, "Manufacturing year must be 1885 or later")
      .optional(),

    model: z
      .string({
        required_error: "Model is required",
      })
      .min(1, "Model cannot be empty")
      .optional(),

    brand: z
      .string({
        required_error: "Brand is required",
      })
      .min(1, "Brand cannot be empty")
      .optional(),
  }),
});

// Zod schema for validating ObjectId

export const BikeValidationSchema = {
  bikeValidationSchema,
  bikeUpdateValidationSchema,
};
