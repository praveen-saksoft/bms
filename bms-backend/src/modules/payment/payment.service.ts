import Razorpay from "razorpay";
import { Orders } from "razorpay/dist/types/orders";
import crypto from "node:crypto";

import type { IPaymentData, IVerifyPayment } from "./payment.interface";
import { config } from "../../config/config";

export const createOrder = async (paymentData: IPaymentData) => {
  const razorpay = new Razorpay({
    key_id: config.razorpayKey,
    key_secret: config.razorpaySecret,
  });

  const { amount } = paymentData;

  const options: Orders.RazorpayOrderCreateRequestBody = {
    amount: amount * 100,
    currency: "INR",
    receipt: `bms-ticket_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  return order;
};

export const verifyPayment = async (paymentData: IVerifyPayment) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    paymentData;

  const expectedSignature = crypto
    .createHmac("sha256", config.razorpaySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};
