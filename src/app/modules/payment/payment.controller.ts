import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const advancePayment = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const result = await PaymentService.advancePayment(amount);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Advance payment successfully",
    data: result,
  });
});

export const PaymentController = {
  advancePayment,
};
