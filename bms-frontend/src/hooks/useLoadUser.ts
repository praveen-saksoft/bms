import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUser } from "@/apis";

export const useLoadUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setIsLoggedIn } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUser();
        setUser(data);
        setIsLoggedIn(true);
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { isLoading };
};
