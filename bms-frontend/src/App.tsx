import { Route, Routes, useMatch } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";
import Checkout from "./pages/Checkout";
import SignInModal from "./components/shared/SignInModal";
import FullScreenLoader from "./components/shared/FullScreenLoader";
import { Toaster } from "react-hot-toast";
import { useLoadUser } from "./hooks/useLoadUser";

function App() {
  const { isLoading } = useLoadUser();

  const isSeatLayoutPage = useMatch(
    "/movies/:id/:movieName/:state/theater/:theaterId/show/:showId/seat-layout",
  );
  const isCheckoutPage = useMatch("/shows/:showId/:state/checkout");

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontSize: 14 } }}
      />
      <div className="flex flex-col min-h-screen">
        <main className="grow">
          {!(isSeatLayoutPage || isCheckoutPage) && <Header />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/movies" element={<Movies />} />
            <Route
              path="/movies/:id/:movieName/:state/shows"
              element={<MovieDetails />}
            />
            <Route
              path="/movies/:id/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
              element={<SeatLayout />}
            />
            <Route
              path="/shows/:showId/:state/checkout"
              element={<Checkout />}
            />
          </Routes>
        </main>
        {!(isSeatLayoutPage || isCheckoutPage) && <Footer />}
        <SignInModal />
      </div>
    </>
  );
}

export default App;
