import { useEffect, useState } from "react";

const STORAGE_KEY = "showfinder-favourites";

function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavourites() {
  const [favourites, setFavourites] = useState(loadFavourites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // localStorage unavailable (e.g. private browsing) — fail silently,
      // favourites just won't persist across reloads.
    }
  }, [favourites]);
  // Manual fix: wrapped in try/catch after review — localStorage.setItem
  // can throw in private browsing or when storage quota is exceeded.

  const isFavourite = (id) => favourites.some((show) => show.id === id);

  const toggleFavourite = (show) => {
    setFavourites((prev) =>
      prev.some((s) => s.id === show.id)
        ? prev.filter((s) => s.id !== show.id)
        : [...prev, show]
    );
  };

  return { favourites, isFavourite, toggleFavourite };
}
