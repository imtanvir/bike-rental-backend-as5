import { stripe } from "../../../app";

const advancePayment = async (amount: number) => {
  const amountConvert = amount * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountConvert,
    currency: "usd",
    payment_method_types: ["card"],
  });
  const result = {
    clientSecret: paymentIntent.client_secret,
  };
  console.log({ paymentIntent });
  return result;
};

export const PaymentService = {
  advancePayment,
};
