import React, { useState } from "react";

interface IStepAccountCreationProps {
  onNext: React.MouseEventHandler<HTMLButtonElement>;
}

const StepAccountCreation: React.FC<IStepAccountCreationProps> = ({
  onNext,
}) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Enter your account details
      </h2>
      <p className="text-center text-sm text-gray-500">
        If you don't have an account, we'll create one for you.
      </p>
      <div className="flex items-center border rounded-md border-gray-300 px-4 py-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="grow outline-none text-base"
          required
        />
      </div>
      <div className="flex items-center border rounded-md border-gray-300 px-4 py-3">
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter your mobile number"
          className="grow outline-none text-base"
          required
        />
      </div>

      <button
        type="submit"
        onClick={onNext}
        className="w-full cursor-pointer text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition"
      >
        Create Account
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

export default StepAccountCreation;
