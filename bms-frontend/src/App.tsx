import { Route, Routes, useMatch } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";

function App() {
  const isSeatLayoutPage = useMatch(
    "/movies/:id/:movieName/:state/theater/:theaterId/show/:showId/seat-layout",
  );
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="grow">
          {!isSeatLayoutPage && <Header />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/movies" element={<Movies />} />
            <Route
              path="/movies/:id/:movieName/:state/shows"
              element={<MovieDetails />}
            />
            <Route
              path="/movies/:id/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
              element={<SeatLayout />}
            />
          </Routes>
        </main>
        {!isSeatLayoutPage && <Footer />}
      </div>
    </>
  );
}

export default App;
