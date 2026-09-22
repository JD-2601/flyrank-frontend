import ShowCard from "../components/ShowCard";

function Favourites({ favourites, isFavourite, toggleFavourite }) {
  return (
    <main className="page">
      <h2>Your Favourites</h2>
      {favourites.length === 0 ? (
        <p className="hint">
          No favourites yet — search for a show and add one.
        </p>
      ) : (
        <div className="show-grid">
          {favourites.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              isFavourite={isFavourite(show.id)}
              onToggleFavourite={toggleFavourite}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Favourites;
