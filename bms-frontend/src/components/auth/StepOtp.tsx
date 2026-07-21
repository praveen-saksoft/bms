import React, { useRef, useState } from "react";

import { useCountDown } from "@/hooks/useCountDown";
import { IoClose } from "react-icons/io5";

interface IStepOtpProps {
  onNext: React.MouseEventHandler<HTMLButtonElement>;
}

const StepOtp: React.FC<IStepOtpProps> = ({ onNext }) => {
  const [otpArray, setOtpArray] = useState(new Array(4).fill(""));
  const inputRef = useRef(null);

  const { displayTime, isExpired } = useCountDown({
    initialTimeInSeconds: 2 * 60,
  });

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    e.preventDefault();
  };

  const handleResendOtp = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Enter the otp received on your email
      </h2>
      <p className="text-center text-sm text-gray-500">
        If you don't have an account, we'll create one for you.
      </p>

      {/* OTP Input */}
      <div className="flex items-center justify-center">
        {otpArray.map((digit, i) => (
          <input
            key={i}
            type="text"
            name="otp"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e, i)}
            className="w-12 h-12 font-bold text-center rounded-md mx-1 border border-gray-200 text-white-500 outline-none"
          />
        ))}

        <button className="w-8 h-8 cursor-pointer border border-gray-200 items-center text-[#f74565] ml-1 font-bold outline-none rounded-md">
          <IoClose size={24} className="inline" />
        </button>
      </div>

      {isExpired ? (
        <p className="text-center text-xs text-gray-500">
          OTP Expired.{" "}
          <span
            className="underline cursor-pointer text-red-500"
            onClick={handleResendOtp}
          >
            Resend OTP
          </span>
        </p>
      ) : (
        <p className="text-center text-sm text-gray-500">
          OTP expires in {displayTime}
        </p>
      )}

      <button
        type="submit"
        onClick={onNext}
        className="w-full cursor-pointer text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition"
      >
        Continue
      </button>

      <p className="text-[#c4c5c5] text-center m-auto text-[12px]">
        By entering your email id, you're agreed to our{" "}
        <a href="" className="text-[#f74565]">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="" className="text-[#f74565]">
          Privacy Policy
        </a>
        . Thanks!
      </p>
    </div>
  );
};

export default StepOtp;
