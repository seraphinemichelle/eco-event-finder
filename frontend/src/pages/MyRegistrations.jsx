import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyRegistrations, cancelRegistration } from '../api'
import { showToast } from '../components/Toast'

const ST_STYLE = {
  upcoming:  'bg-g-accent text-g-main border border-g-lime',
  ongoing:   'bg-g-yellow/20 text-yellow-700 border border-g-yellow',
  completed: 'bg-g-wire/40 text-g-gray border border-g-wire',
}
const ST_LABEL = {
  upcoming:  'Upcoming',
  ongoing:   'Ongoing',
  completed: 'Completed',
}

function imgSrc(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `http://localhost:8000${path}`
}

export default function MyRegistrations({ user }) {
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(false)
  const [cancellingId, setCancellingId]   = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    setLoading(true)
    getMyRegistrations(token)
      .then(res => {
        const data = res.data
        const events = data.map(item => item.event ?? item).filter(Boolean)
        setRegistrations(events)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [navigate])

  async function handleCancel(eventId) {
    if (!window.confirm('Yakin ingin membatalkan registrasi ini?')) return
    setCancellingId(eventId)
    try {
      await cancelRegistration(eventId)
      setRegistrations(prev => prev.filter(ev => ev.id !== eventId))
      showToast('Registrasi berhasil dibatalkan.')
    } catch {
      showToast('Gagal membatalkan. Coba lagi.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-g-dark px-8 pt-10 pb-8 border-b border-g-wire/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-g-gray text-xs font-mono tracking-widest mb-2">AKUN</div>
          <h1 className="font-outfit font-bold text-2xl text-white">
            Event Saya
          </h1>
          <p className="text-g-gray text-sm mt-1">
            {!loading && !error && `${registrations.length} event terdaftar`}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 pt-8 pb-20">

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-g-wire" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-24">
            <p className="text-g-gray text-sm mb-4">Gagal memuat data registrasi.</p>
            <button onClick={() => window.location.reload()}
              className="bg-g-main text-white px-6 py-2.5 rounded-lg text-sm font-semibold
                         hover:bg-g-dark transition-colors">
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && registrations.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-g-accent mx-auto mb-4 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                      stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="#2D6A4F" strokeWidth="1.5"/>
                <path d="M9 12h6M9 16h4" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-outfit font-bold text-lg text-g-dark mb-2">
              Belum ada registrasi
            </h3>
            <p className="text-sm text-g-gray mb-6">
              Daftar ke event dan registrasimu akan muncul di sini
            </p>
            <button onClick={() => navigate('/events')}
              className="bg-g-main text-white px-6 py-2.5 rounded-lg font-semibold text-sm
                         hover:bg-g-dark transition-colors">
              Jelajahi Event
            </button>
          </div>
        )}

        {/* List */}
        {!loading && !error && registrations.length > 0 && (
          <div className="flex flex-col gap-4">
            {registrations.map(ev => (
              <div key={ev.id}
                onClick={() => navigate(`/events/${ev.id}`)}
                className="bg-white border border-g-wire rounded-xl overflow-hidden flex
                           hover:border-g-lime hover:shadow-md transition-all cursor-pointer">

                {/* Thumbnail */}
                <div className="w-24 flex-shrink-0 overflow-hidden">
                  {ev.image
                    ? <img src={imgSrc(ev.image)} alt={ev.title}
                           className="w-full h-full object-cover" />
                    : <div className="w-full h-full"
                           style={{ background: ev.cover_color || 'linear-gradient(135deg,#74C69D,#2D6A4F)' }} />
                  }
                </div>

                {/* Body */}
                <div className="flex-1 p-4">
                  {/* Badges */}
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${ST_STYLE[ev.status]}`}>
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
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <span className="inline-flex items-center gap-1.5 bg-g-accent text-g-main
                                     text-xs font-semibold px-3 py-1.5 rounded-lg border border-g-lime">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#2D6A4F" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Terdaftar
                    </span>
                    <button
                      onClick={() => navigate(`/events/${ev.id}`)}
                      className="bg-g-main text-white px-4 py-1.5 rounded-lg text-xs font-semibold
                                 hover:bg-g-dark transition-colors">
                      Lihat Detail
                    </button>
                    {ev.status !== 'completed' && (
                      <button
                        onClick={() => handleCancel(ev.id)}
                        disabled={cancellingId === ev.id}
                        className="bg-white text-red-500 border border-g-wire px-4 py-1.5 rounded-lg
                                   text-xs font-semibold hover:bg-red-50 hover:border-red-300
                                   transition-all disabled:opacity-50">
                        {cancellingId === ev.id ? 'Membatalkan...' : 'Batalkan'}
                      </button>
                    )}
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