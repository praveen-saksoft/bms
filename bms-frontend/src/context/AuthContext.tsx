import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

import { activateUser, logout, sendOtp, verifyOtp } from "@/apis";

interface IAuthContext {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  showModal: boolean;
  toggleModal: VoidFunction;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  sendOtpRequest: ({ email, onNext }: any) => Promise<void>;
  sendOtpLoading: boolean;
  verifyOtpRequest: ({ otp, onNext }: any) => Promise<void>;
  verifyOtpLoading: boolean;
  activateUserRequest: (data: any) => Promise<void>;
  activateUserLoading: boolean;
  logoutRequest: () => Promise<void>;
  logoutLoading: boolean;
  socket: Socket | null;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

interface IOtpRes {
  email: string;
  hash: string;
}

interface IVerifyOtpReq extends IOtpRes {
  otp: number;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [authData, setAuthData] = useState<IOtpRes | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mutations
  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => sendOtp({ email }),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (reqData: IVerifyOtpReq) => verifyOtp(reqData),
  });

  const activateUserMutation = useMutation({
    mutationFn: (reqData: any) => activateUser(reqData),
  });

  const logoutMutation = useMutation({
    mutationFn: (r: null) => logout(),
  });

  const toggleModal = useCallback(() => {
    setStep(1);
    setShowModal((prev) => !prev);
  }, []);

  const sendOtpRequest = async ({ email, onNext, resend = false }: any) => {
    const newEmail = resend ? authData?.email : email;
    sendOtpMutation.mutate(newEmail, {
      onSuccess: (res) => {
        console.log(res.data);
        setAuthData(res.data);
        toast.success("OTP sent to your email");
        !resend && onNext();
      },
      onError: (err) => {
        console.log(err);
        toast.error(err?.message || "Something went wrong");
      },
    });
  };

  const verifyOtpRequest = async ({ otp, onNext }: any) => {
    const { hash = "", email = "" } = authData ?? {};
    const reqData: IVerifyOtpReq = { email, hash, otp };

    verifyOtpMutation.mutate(reqData, {
      onSuccess: (res) => {
        setAuthData(null);
        setUser(res.data);
        setIsLoggedIn(true);
        if (!res.data.activateUser) {
          onNext();
        } else {
          toggleModal();
        }
      },
      onError: (err) => {
        console.log(err);
        toast.error(err?.message || "Something went wrong");
      },
    });
  };

  const activateUserRequest = async (data: any) => {
    const { name, mobile } = data;
    const id = user?._id;
    const reqData = { id, name, mobile };
    activateUserMutation.mutate(reqData, {
      onSuccess: (res) => {
        console.log(res);
        setUser(res.data);
        toggleModal();
      },
      onError: (err) => {
        console.log(err);
        toast.error(err?.message || "Something went wrong");
      },
    });
  };

  const logoutRequest = async () => {
    logoutMutation.mutate(null, {
      onSuccess: (data) => {
        console.log(data);
        setIsLoggedIn(false);
        setUser(null);
        window.location.href = "/";
      },
      onError: (err) => {
        console.log(err);
        toast.error(err?.message || "Something went wrong");
      },
    });
  };

  /** Socket Connection */
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
    newSocket.on("connect", () => {
      console.log("[Socket Client] connected to server:", newSocket.id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.disconnect();
    };
  }, []);

  const providerValue: IAuthContext = useMemo(
    () => ({
      step,
      setStep,
      showModal,
      toggleModal,
      user,
      setUser,
      isLoggedIn,
      setIsLoggedIn,
      sendOtpRequest,
      sendOtpLoading: sendOtpMutation.isPending,
      verifyOtpRequest,
      verifyOtpLoading: verifyOtpMutation.isPending,
      activateUserRequest,
      activateUserLoading: activateUserMutation.isPending,
      logoutRequest,
      logoutLoading: logoutMutation.isPending,
      socket,
    }),
    [
      step,
      showModal,
      user,
      isLoggedIn,
      sendOtpMutation.isPending,
      verifyOtpMutation.isPending,
      activateUserMutation.isPending,
      logoutMutation.isPending,
      socket,
    ],
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
