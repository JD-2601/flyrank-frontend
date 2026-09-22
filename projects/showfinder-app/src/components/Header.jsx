import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="brand">
          ShowFinder
        </Link>
        <Link to="/">Home</Link>
        <Link to="/favourites">Favourites</Link>
      </nav>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="search"
          placeholder="Search TV shows..."
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </header>
  );
}

export default Header;
