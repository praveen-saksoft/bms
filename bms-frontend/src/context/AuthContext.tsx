import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface IAuthContext {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  showModal: boolean;
  toggleModal: VoidFunction;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => {
    setStep(1);
    setShowModal((prev) => !prev);
  }, []);

  const providerValue = useMemo(
    () => ({
      step,
      setStep,
      showModal,
      toggleModal,
    }),
    [step, showModal],
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
