import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowCard from "../components/ShowCard";

function Home({ isFavourite, toggleFavourite }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [shows, setShows] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done

  useEffect(() => {
    if (!query) {
      setShows([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setShows(data.map((entry) => entry.show));
        setStatus("done");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, [query]);

  return (
    <main className="page">
      {status === "idle" && (
        <p className="hint">Search for a TV show above to get started.</p>
      )}
      {status === "loading" && <p className="hint">Searching...</p>}
      {status === "error" && (
        <p className="hint error">
          Something went wrong fetching results. Try again.
        </p>
      )}
      {status === "done" && shows.length === 0 && (
        <p className="hint">No shows found for "{query}".</p>
      )}
      <div className="show-grid">
        {shows.map((show) => (
          <ShowCard
            key={show.id}
            show={show}
            isFavourite={isFavourite(show.id)}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </div>
    </main>
  );
}

export default Home;
