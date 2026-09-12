import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Bookmark from './pages/Bookmark'
import MyRegistrations from './pages/MyRegistrations'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { getSessionId } from './hooks/useSession'
import { addBookmark, removeBookmark, getBookmarks } from './api'

// Session ID khusus per user — konsisten tiap login
function getUserSid(user) {
  return `usr_${user.id}`
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [bookmarkedIds, setBookmarkedIds] = useState([])

  // Load bookmarks on mount — pakai user session kalau sudah login
  useEffect(() => {
    const sid = user ? getUserSid(user) : getSessionId()
    getBookmarks(sid)
      .then(res => setBookmarkedIds(res.data.map(b => b.event?.id).filter(Boolean)))
      .catch(() => {})
  }, [user])

  function handleLogin(userData) {
    setUser(userData)
    setBookmarkedIds([])
    localStorage.setItem('user', JSON.stringify(userData))
    // Pakai user-specific session ID — tidak hilang walau logout
    getBookmarks(getUserSid(userData))
      .then(res => setBookmarkedIds(res.data.map(b => b.event?.id).filter(Boolean)))
      .catch(() => {})
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    // Jangan hapus user session — bookmark tetap ada untuk login berikutnya
    // Hanya reset state & bersihkan guest session
    localStorage.removeItem('session_id')
    setBookmarkedIds([])
  }

  async function handleToggleBookmark(eventId) {
    if (!user) return 'unauthorized'

    const sid = getUserSid(user)
    const isBookmarked = bookmarkedIds.includes(eventId)
    if (isBookmarked) {
      await removeBookmark(sid, eventId)
      setBookmarkedIds(ids => ids.filter(id => id !== eventId))
      return false
    } else {
      await addBookmark(sid, eventId)
      setBookmarkedIds(ids => [...ids, eventId])
      return true
    }
  }

  const sharedProps = {
    bookmarkedIds,
    onToggleBookmark: handleToggleBookmark,
  }

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/login"  element={<Login  onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

        <Route path="/*" element={
          <div>
            <Navbar
              bookmarkCount={bookmarkedIds.length}
              user={user}
              onLogout={handleLogout}
            />
            <Routes>
              <Route path="/"              element={<Home        {...sharedProps} />} />
              <Route path="/events"        element={<Events      {...sharedProps} />} />
              <Route path="/events/:id"    element={<EventDetail {...sharedProps} />} />
              <Route path="/bookmark" element={<Bookmark {...sharedProps} user={user} />} />
              <Route path="/registrations" element={
                user ? <MyRegistrations user={user} /> : <Navigate to="/login" />
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}