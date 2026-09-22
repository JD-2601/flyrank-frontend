function ShowCard({ show, isFavourite, onToggleFavourite }) {
  const image = show.image?.medium || null;

  return (
    <div className="show-card">
      {image ? (
        <img src={image} alt={show.name} />
      ) : (
        <div className="show-card-placeholder">No image</div>
      )}
      <div className="show-card-body">
        <h3>{show.name}</h3>
        <p className="show-meta">
          {show.genres?.slice(0, 2).join(", ") || "Unknown genre"}
          {show.premiered ? ` · ${show.premiered.slice(0, 4)}` : ""}
        </p>
        <button
          className={isFavourite ? "fav-btn active" : "fav-btn"}
          onClick={() => onToggleFavourite(show)}
          aria-pressed={isFavourite}
        >
          {isFavourite ? "★ Favourited" : "☆ Add to Favourites"}
        </button>
      </div>
    </div>
  );
}

export default ShowCard;
