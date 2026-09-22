import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favourites from "./pages/Favourites";
import { useFavourites } from "./hooks/useFavourites";

function App() {
  const { favourites, isFavourite, toggleFavourite } = useFavourites();

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Home isFavourite={isFavourite} toggleFavourite={toggleFavourite} />
          }
        />
        <Route
          path="/favourites"
          element={
            <Favourites
              favourites={favourites}
              isFavourite={isFavourite}
              toggleFavourite={toggleFavourite}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
