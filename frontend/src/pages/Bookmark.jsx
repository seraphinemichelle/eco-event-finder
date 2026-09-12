import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookmarks } from '../api'
import { getSessionId } from '../hooks/useSession'
import { showToast } from '../components/Toast'


const ST_STYLE = {
  upcoming:  'bg-g-accent text-g-main border border-g-lime',
  ongoing:   'bg-g-yellow/20 text-yellow-700 border border-g-yellow',
  completed: 'bg-g-wire/40 text-g-gray border border-g-wire',
}
const ST_LABEL = {
  upcoming:  'Upcoming',
  ongoing:   'Sedang Berlangsung',
  completed: 'Selesai',
}

function imgSrc(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `http://localhost:8000${path}`
}

export default function Bookmark({ bookmarkedIds, onToggleBookmark, user }) {
  const navigate = useNavigate()
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => { load() }, [bookmarkedIds.length]) // eslint-disable-line react-hooks/exhaustive-deps


  async function load() {
    setLoading(true)
    // Pakai user session kalau sudah login, guest session kalau belum
    const sid = user ? `usr_${user.id}` : getSessionId()
    try {
      const res = await getBookmarks(sid)
      setEvents(res.data.map(b => b.event).filter(Boolean))
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }


  async function handleRemove(id) {
    await onToggleBookmark(id)
    showToast('Bookmark dihapus.')
  }


  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-g-dark px-8 pt-10 pb-8 border-b border-g-wire/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-g-gray text-xs font-mono tracking-widest mb-2">TERSIMPAN</div>
          <h1 className="font-outfit font-bold text-2xl text-white">
            Event Tersimpan
          </h1>
          <p className="text-g-gray text-sm mt-1">
            {events.length} event disimpan
          </p>
        </div>
      </div>


      <div className="max-w-5xl mx-auto px-8 pt-8 pb-20">


        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}
                className="bg-white rounded-xl h-28 animate-pulse border border-g-wire" />
            ))}
          </div>
        )}


        {/* Empty */}
        {!loading && events.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-g-accent mx-auto mb-4
                            flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      stroke="#2D6A4F" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-outfit font-bold text-lg text-g-dark mb-2">
              Belum ada event tersimpan
            </h3>
            <p className="text-sm text-g-gray mb-6">
              Klik tombol simpan pada event untuk menyimpannya di sini
            </p>
            <button onClick={() => navigate('/events')}
              className="bg-g-main text-white px-6 py-2.5 rounded-lg font-semibold text-sm
                         hover:bg-g-dark transition-colors">
              Jelajahi Event
            </button>
          </div>
        )}


        {/* List */}
        {!loading && events.length > 0 && (
          <div className="flex flex-col gap-4">
            {events.map(ev => (
              <div key={ev.id}
                onClick={() => navigate(`/events/${ev.id}`)}
                className="bg-white border border-g-wire rounded-xl overflow-hidden flex
                           hover:border-g-lime hover:shadow-md transition-all cursor-pointer">


                {/* Thumbnail */}
                <div className="w-24 flex-shrink-0 overflow-hidden">
                  {ev.image
                  ? <img src={imgSrc(ev.image)}
                    alt={ev.title}
                    className="w-full h-full object-cover" />
                  : <div className="w-full h-full" style={{ background: ev.cover_color || '...' }} />
                  }
                </div>


                {/* Body */}
                <div className="flex-1 p-4">
                  {/* Badges */}
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded
                                     ${ST_STYLE[ev.status]}`}>
                      {ST_LABEL[ev.status]}
                    </span>
                    {(ev.sdg_tags || []).map(s => (
                      <span key={s}
                        className="text-xs font-semibold px-2 py-0.5 rounded
                                   bg-g-accent text-g-main border border-g-lime">
                        {s}
                      </span>
                    ))}
                  </div>


                  {/* Title */}
                  <h3 className="font-outfit font-bold text-sm text-g-dark mb-1">
                    {ev.title}
                  </h3>


                  {/* Meta */}
                  <div className="flex gap-4 text-xs text-g-gray mb-3 flex-wrap">
                    <span>{ev.date_start}</span>
                    <span>{ev.location}</span>
                    <span>{ev.organizer}</span>
                  </div>


                  {/* Actions */}
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/events/${ev.id}`)}
                      className="bg-g-main text-white px-4 py-1.5 rounded-lg text-xs font-semibold
                                 hover:bg-g-dark transition-colors">
                      Lihat Detail
                    </button>
                    <button
                      onClick={() => handleRemove(ev.id)}
                      className="bg-white text-g-red border border-g-wire px-4 py-1.5 rounded-lg
                                 text-xs font-semibold hover:bg-g-red hover:text-white
                                 hover:border-g-red transition-all">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
