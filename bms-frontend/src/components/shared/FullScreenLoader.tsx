import React from "react";

interface ILoaderProps {
  message?: string;
}

const FullScreenLoader: React.FC<ILoaderProps> = ({
  message = "Warming up the projector",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#f74565] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-[#f74565] animate-pulse">
          {message}...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
