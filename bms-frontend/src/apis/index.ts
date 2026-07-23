import { axiosWrapper } from "./axiosWrapper";

// List all the endpoints
export const getRecommendedMovies = () =>
  axiosWrapper.get("/movies/recommended");

export const getAllMovies = () => axiosWrapper.get("/movies");

export const getMovieById = (id: string) => axiosWrapper.get(`/movies/${id}`);

export const getShowsByMovieAndLocation = (
  movieId: string,
  state: string,
  date: string,
) =>
  axiosWrapper.get("/shows", {
    params: {
      movieId,
      state,
      date,
    },
  });

export const getShowById = (id: string) => axiosWrapper.get(`/shows/${id}`);

// Auth apis
export const sendOtp = (data: any) => axiosWrapper.post("/auth/send-otp", data);
export const verifyOtp = (data: any) =>
  axiosWrapper.post("/auth/verify-otp", data);
export const logout = () => axiosWrapper.post(`/auth/logout`);
export const activateUser = ({ id, ...data }: any) =>
  axiosWrapper.patch(`/users/activate/${id}`, data);
export const getUser = () => axiosWrapper.get(`/users/me`);
// Payment apis
export const createOrderRazorpay = (data: any) =>
  axiosWrapper.post("/payment/create-order", data);
export const verifyPaymentRazorpay = (data: any) =>
  axiosWrapper.post("/payment/verify-payment", data);

axiosWrapper.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest.url.endsWith("refresh-token") &&
      +error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axiosWrapper.post(
          `/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        return axiosWrapper.request(originalRequest);
      } catch (error) {
        console.log("Error while refreshing the token", error);
      }
    }

    throw error;
  },
);
