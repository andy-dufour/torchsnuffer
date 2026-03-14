import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="text-center pt-4 pb-2 px-4">
      <Link to="/" className="inline-block">
        <h1
          className="text-3xl tracking-wider text-flame"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          TORCH SNUFFER
        </h1>
        <p className="text-text-muted text-xs tracking-widest uppercase -mt-1">
          guess who said it
        </p>
      </Link>
    </header>
  );
}
