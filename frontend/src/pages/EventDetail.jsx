import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEvent, registerEvent } from '../api'
import { showToast } from '../components/Toast'

function imgSrc(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `http://localhost:8000${path}`
}
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


export default function EventDetail({ bookmarkedIds, onToggleBookmark }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getEvent(id)
      .then(r => {
        setEvent(r.data)
        // cek apakah user sudah terdaftar dari data event
        setRegistered(r.data.is_registered ?? false)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  async function handleRegister() {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    setRegLoading(true)
    try {
      await registerEvent(event.id, token)
      setRegistered(true)
      setEvent(e => ({ ...e, registered: (e.registered || 0) + 1 }))  // ← kurangi sisa otomatis
      showToast('Berhasil mendaftar ke event!')
    } catch (err) {
      if (err.response?.status === 400) {
        showToast('Kamu sudah terdaftar di event ini.')
        setRegistered(true)
      } else {
        showToast('Gagal mendaftar. Coba lagi.')
      }
    } finally {
      setRegLoading(false)
    }
  }

  async function handleBookmark() {
  const result = await onToggleBookmark(event.id)
  if (result === 'unauthorized') { navigate('/signup'); return }
  showToast(result ? 'Event disimpan!' : 'Bookmark dihapus.')
}

  /* Loading */
  if (loading) return (
    <div className="pt-14 animate-pulse">
      <div className="h-56 bg-g-accent" />
      <div className="max-w-5xl mx-auto px-8 pt-10 grid lg:grid-cols-[1fr_300px] gap-10">
        <div className="space-y-4">
          <div className="h-7 bg-g-accent rounded w-2/3" />
          <div className="h-4 bg-g-accent rounded w-full" />
          <div className="h-4 bg-g-accent rounded w-3/4" />
        </div>
        <div className="h-64 bg-g-accent rounded-xl" />
      </div>
    </div>
  )

  /* Not found */
  if (notFound || !event) return (
    <div className="pt-40 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-g-accent mx-auto mb-4
                      flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#2D6A4F" strokeWidth="1.5"/>
          <path d="M9 9l6 6M15 9l-6 6" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h2 className="font-outfit font-bold text-xl text-g-dark mb-4">
        Event tidak ditemukan
      </h2>
      <button onClick={() => navigate('/events')}
        className="bg-g-main text-white px-6 py-2.5 rounded-lg font-semibold text-sm
                   hover:bg-g-dark transition-colors">
        Kembali ke Events
      </button>
    </div>
  )

  const isBookmarked = bookmarkedIds.includes(Number(id))
  const sisa = Math.max(0, (event.quota || 0) - (event.registered || 0))
  const pct  = event.quota ? Math.min(100, (event.registered / event.quota) * 100) : 0

  return (
    <div className="pt-14">
      {/* Cover */}
      <div className="h-56 relative overflow-hidden">
  {event.image ? (
    <img
      src={imgSrc(event.image)}
      alt={event.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full"
         style={{ background: event.cover_color || 'linear-gradient(135deg,#74C69D,#2D6A4F)' }} />
  )}
  <div className="absolute inset-0 bg-black/20" /> 

        {/* Badges */}
        <div className="absolute bottom-4 left-8 flex gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${ST_STYLE[event.status]}`}>
            {ST_LABEL[event.status]}
          </span>
          {(event.sdg_tags || []).map(s => (
            <span key={s}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-g-accent text-g-main border border-g-lime">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-g-wire">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-g-gray">
          <Link to="/" className="hover:text-g-main transition-colors no-underline text-g-gray">
            Home
          </Link>
          <span>/</span>
          <Link to="/events" className="hover:text-g-main transition-colors no-underline text-g-gray">
            Events
          </Link>
          <span>/</span>
          <span className="text-g-dark truncate max-w-xs">{event.title}</span>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-5xl mx-auto px-8 pt-8 pb-20 grid lg:grid-cols-[1fr_300px] gap-10">

        {/* Main content */}
        <div>
          {/* Category */}
          <span className="text-xs font-bold text-g-main font-mono tracking-widest uppercase">
            {event.category}
          </span>

          {/* Title */}
          <h1 className="font-outfit font-bold text-3xl text-g-dark leading-tight mt-2 mb-4">
            {event.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 mb-7 pb-7 border-b border-g-wire">
            {[
              { label: 'Tanggal', val: event.date_start + (event.date_end && event.date_end !== event.date_start ? ` – ${event.date_end}` : '') },
              { label: 'Waktu',   val: event.time_info },
              { label: 'Lokasi',  val: event.location },
              { label: 'Kategori', val: event.category },
            ].filter(r => r.val).map(r => (
              <div key={r.label}>
                <p className="text-xs text-g-gray font-mono tracking-wide uppercase mb-0.5">
                  {r.label}
                </p>
                <p className="text-sm text-g-dark font-medium">{r.val}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <h2 className="font-outfit font-bold text-lg text-g-dark mb-3">Tentang Event</h2>
          <p className="text-sm leading-relaxed text-g-dark/70 mb-7">{event.description}</p>

          {/* SDG box */}
          {(event.sdg_tags || []).length > 0 && (
            <div className="bg-g-accent border-l-4 border-g-main rounded-r-xl p-5 mb-7">
              <p className="font-bold text-sm text-g-main mb-1">Kontribusi SDGs</p>
              <p className="text-sm text-g-dark/70 leading-relaxed">
                Event ini berkontribusi pada <strong>{event.sdg_tags.join(' dan ')}</strong> dalam
                mendukung tujuan pembangunan berkelanjutan melalui aksi lingkungan nyata.
              </p>
            </div>
          )}

          {/* Info detail */}
          <h2 className="font-outfit font-bold text-lg text-g-dark mb-4">Informasi Event</h2>
          <div className="space-y-4">
            {[
              { label: 'TANGGAL',        val: event.date_start + (event.date_end && event.date_end !== event.date_start ? ` – ${event.date_end}` : '') },
              { label: 'WAKTU',          val: event.time_info },
              { label: 'LOKASI',         val: event.location },
              { label: 'PENYELENGGARA',  val: event.organizer },
              { label: 'KUOTA',          val: event.quota ? `${event.quota} peserta (${sisa} sisa)` : null },
            ].filter(r => r.val).map(r => (
              <div key={r.label} className="flex gap-4 items-start pb-4 border-b border-g-wire/50">
                <div className="w-28 flex-shrink-0">
                  <p className="text-xs text-g-gray font-mono tracking-wide">{r.label}</p>
                </div>
                <p className="text-sm text-g-dark font-medium">{r.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="self-start sticky top-20">
          <div className="bg-white border border-g-wire rounded-xl p-5">

            {/* Free badge */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-g-gray font-mono">BIAYA</p>
                <p className="font-outfit font-bold text-2xl text-g-dark">Gratis</p>
              </div>
              {event.quota && (
                <div className="text-right">
                  <p className="font-mono font-bold text-xl text-g-main leading-none">{sisa}</p>
                  <p className="text-xs text-g-gray mt-0.5">sisa tempat</p>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {event.quota && (
              <div className="h-1.5 bg-g-accent rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-g-main rounded-full transition-all duration-500"
                     style={{ width: `${pct}%` }} />
              </div>
            )}

            {/* Info list */}
            <div className="space-y-3 mb-5 pb-5 border-b border-g-wire">
              {[
                { label: 'TANGGAL',       val: event.date_start },
                { label: 'WAKTU',         val: event.time_info },
                { label: 'LOKASI',        val: event.location },
                { label: 'PENYELENGGARA', val: event.organizer },
              ].filter(r => r.val).map(r => (
                <div key={r.label}>
                  <p className="text-xs text-g-gray font-mono tracking-wide">{r.label}</p>
                  <p className="text-sm text-g-dark font-medium mt-0.5">{r.val}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            {event.status !== 'completed' ? (
              <button
                onClick={handleRegister}
                disabled={registered || regLoading}
                className={`w-full py-3 rounded-lg font-semibold text-sm mb-3 transition-colors
                  ${registered
                    ? 'bg-g-accent text-g-main border border-g-lime cursor-not-allowed'
                    : 'bg-g-main text-white hover:bg-g-dark'}`}>
                  {regLoading ? 'Memproses...' : registered ? 'Sudah Terdaftar' : 'Daftar Sekarang'}
              </button>
            ) : (
              <button disabled
                className="w-full bg-g-accent text-g-gray py-3 rounded-lg font-semibold
                          text-sm mb-3 opacity-60 cursor-not-allowed">
                Event Telah Selesai
              </button>
            )}

            <button onClick={handleBookmark}
              className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center
                justify-center gap-2 border transition-all
                ${isBookmarked
                  ? 'bg-g-main text-white border-g-main'
                  : 'bg-g-accent text-g-main border-g-wire hover:border-g-main'}`}>
              {isBookmarked ? 'Tersimpan' : 'Simpan Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}