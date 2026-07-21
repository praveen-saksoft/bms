import React from "react";
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";

import mainWhiteLogo from "@/assets/main-icon-white.png";

import StepEmail from "../auth/StepEmail";
import StepOtp from "../auth/StepOtp";
import StepAccountCreation from "../auth/StepAccountCreation";

const steps: Record<number, React.FC<any>> = {
  1: StepEmail,
  2: StepOtp,
  3: StepAccountCreation,
};

const SignInModal = () => {
  const { step, setStep, showModal, toggleModal } = useAuth();

  const StepComponent = steps[step];

  const onNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep(step + 1);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-opacity-50 backdrop-blur-xs">
      <div className="w-[90%] h-[620px] max-w-xl bg-white rounded-3xl shadow-lg animate-fadeIn overflow-hidden">
        {/* Top header section */}
        <div className="bg-linear-to-r from-gray-800 to-[#f74565] text-white px-6 py-8 h-[300px] relative flex items-center justify-center flex-col">
          <IoClose
            onClick={toggleModal}
            className="absolute top-4 right-4 text-4xl cursor-pointer"
          />
          <img
            src={mainWhiteLogo}
            alt="bookMyScreen"
            className="mx-auto h-24 mb-2"
          />
          <p className="text-md text-white -mt-2">Where movies meet magic.</p>
        </div>

        <div className="">
          <StepComponent onNext={onNext} />
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
