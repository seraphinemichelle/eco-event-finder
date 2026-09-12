import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ bookmarkCount = 0, user, onLogout }) {
  const { pathname } = useLocation()

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-4 h-14 flex items-center text-sm font-medium border-b-2 transition-all no-underline
        ${pathname === to
          ? 'text-g-lime border-g-lime'
          : 'text-g-gray border-transparent hover:text-white'}`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-g-dark flex items-center px-8"
         style={{ borderBottom: '1px solid rgba(116,198,157,0.15)' }}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mr-auto no-underline">
        <img src="/logo.png" alt="logo" className="w-7 h-7 object-contain" />
        <span className="font-mono font-bold text-sm text-g-lime tracking-tight">
          EcoEvent <span className="text-white font-normal">Finder</span>
        </span>
      </Link>

      {/* Nav links */}
      {navLink('/', 'Home')}
      {navLink('/events', 'Events')}

      {/* Bookmark — semua user bisa lihat, tapi isi hanya kalau login */}
      <Link
        to="/bookmark"
        className={`px-4 h-14 flex items-center gap-2 text-sm font-medium border-b-2 transition-all no-underline
          ${pathname === '/bookmark'
            ? 'text-g-lime border-g-lime'
            : 'text-g-gray border-transparent hover:text-white'}`}
      >
        Tersimpan
        {bookmarkCount > 0 && (
          <span className="bg-g-lime text-g-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {bookmarkCount}
          </span>
        )}
      </Link>

      {/* Registrasi Saya — hanya muncul kalau sudah login */}
      {user && (
        <Link
          to="/registrations"
          className={`px-4 h-14 flex items-center text-sm font-medium border-b-2 transition-all no-underline
            ${pathname === '/registrations'
              ? 'text-g-lime border-g-lime'
              : 'text-g-gray border-transparent hover:text-white'}`}
        >
          Event Saya
        </Link>
      )}

      {/* Auth */}
      {user ? (
        <div className="flex items-center gap-3 ml-4">
          <span className="text-g-gray text-sm">
            Halo, <span className="text-white font-medium">{user.username}</span>
          </span>
          <button
            onClick={onLogout}
            className="border border-g-wire text-g-gray px-4 py-1.5 rounded-lg text-sm
                       hover:bg-white/10 hover:text-white transition-all"
          >
            Keluar
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 ml-4">
          <Link to="/login"
            className="text-g-gray text-sm px-4 py-1.5 rounded-lg border border-g-wire
                       hover:bg-white/10 hover:text-white transition-all no-underline">
            Masuk
          </Link>
          <Link to="/signup"
            className="bg-g-lime text-g-dark text-sm px-4 py-1.5 rounded-lg font-bold
                       hover:bg-g-hi transition-all no-underline">
            Daftar
          </Link>
        </div>
      )}
    </nav>
  )
}
