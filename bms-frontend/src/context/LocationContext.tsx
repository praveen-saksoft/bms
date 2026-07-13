import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface ILocationContext {
  location: string | null;
  loading: boolean;
  error: any;
}

const LocationContext = createContext<ILocationContext | null>(null);

interface ILocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<ILocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async (lat: number, long: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`,
        );

        const data = await res.json();
        const userLocation = data?.address?.state;
        setLocation(userLocation);
      } catch (error) {
        setError("Failed to fetch location data");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationData(latitude, longitude);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      },
    );
  }, []);

  return (
    <LocationContext value={{ location, loading, error }}>
      {children}
    </LocationContext>
  );
};

export const useLiveLocation = () => {
  const context = useContext(LocationContext);
  if (context == null) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
