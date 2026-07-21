import React, { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BeatLoader } from "react-spinners";

import { useAuth } from "@/context/AuthContext";
import { useCountDown } from "@/hooks/useCountDown";

interface IStepOtpProps {
  onNext: React.MouseEventHandler<HTMLButtonElement>;
}

const StepOtp: React.FC<IStepOtpProps> = ({ onNext }) => {
  const [otpArray, setOtpArray] = useState(new Array(4).fill(""));
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);

  const { verifyOtpRequest, verifyOtpLoading, sendOtpRequest } = useAuth();
  const { displayTime, isExpired } = useCountDown({
    initialTimeInSeconds: 2 * 60,
  });

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    e.preventDefault();
    const { value } = e?.target;
    if (!isNaN(parseInt(value))) {
      setOtpArray([...otpArray.map((d, idx) => (i === idx ? value : d))]);
      if (value !== "" && i < inputRef.current.length - 1) {
        inputRef.current[i + 1]?.focus();
      }
    }
  };

  const handleClearOtp = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setOtpArray(new Array(4).fill(""));
    inputRef.current[0]?.focus();
  };

  const handleResendOtp = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    handleClearOtp(e);
    sendOtpRequest({ resend: true });
  };

  const handleVerifyOtp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const otp = parseInt(otpArray.join(""), 10);
    verifyOtpRequest({ otp, onNext });
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
            ref={(el) => {
              inputRef.current[i] = el;
            }}
            className="w-12 h-12 font-bold text-center rounded-md mx-1 border border-gray-200 text-white-500 outline-none"
          />
        ))}

        <button
          onClick={handleClearOtp}
          className="w-8 h-8 cursor-pointer border border-gray-200 items-center text-[#f74565] ml-1 font-bold outline-none rounded-md"
        >
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
        onClick={handleVerifyOtp}
        className="w-full cursor-pointer text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition"
      >
        {verifyOtpLoading ? <BeatLoader size={12} color="white" /> : "Continue"}
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
