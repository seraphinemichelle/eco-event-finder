import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvents } from '../api'
import EventCard from '../components/EventCard'
import { GridSkeleton } from '../components/Skeleton'
import { showToast } from '../components/Toast'

const CHIPS = [
  { label: 'Semua',      value: null },
  { label: 'Upcoming',   value: { status: 'upcoming' } },
  { label: 'Ongoing',    value: { status: 'ongoing' } },
  { label: 'Completed',    value: { status: 'completed' } },
  { label: 'Volunteer',  value: { category: 'Volunteer' } },
  { label: 'Workshop',   value: { category: 'Workshop' } },
  { label: 'Seminar',    value: { category: 'Seminar' } },
]

export default function Home({ bookmarkedIds, onToggleBookmark }) {
  const navigate = useNavigate()
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [chip, setChip]       = useState(0)
  const [search, setSearch]   = useState('')
  const [stats, setStats]     = useState({ total: 0, upcoming: 0, ongoing: 0, completed: 0 })

  useEffect(() => {
    setLoading(true)
    getEvents(CHIPS[chip].value || {})
      .then(r => {
        setEvents(r.data)
        if (chip === 0) {
          setStats({
            total:     r.data.length,
            upcoming:  r.data.filter(e => e.status === 'upcoming').length,
            ongoing:   r.data.filter(e => e.status === 'ongoing').length,
            completed: r.data.filter(e => e.status === 'completed').length,
          })
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [chip])

  async function handleBookmark(id) {
  const result = await onToggleBookmark(id)
  if (result === 'unauthorized') return result  // teruskan ke EventCard
  showToast(result ? 'Event disimpan!' : 'Bookmark dihapus.')
}

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/events?search=${search}`)
  }

  return (
    <div>
      {/* HERO */}
      <div className="bg-g-dark pt-14">
        <div className="max-w-5xl mx-auto px-8 py-16">
          {/* Headline */}
          <h1 className="font-outfit font-bold text-4xl text-white leading-tight mb-4 max-w-xl">
            Temukan Event Lingkungan<br />
            <span className="text-g-lime">di Sekitarmu</span>
          </h1>
          <p className="text-g-gray text-sm leading-relaxed mb-8 max-w-lg">
            Platform terpusat untuk mahasiswa BINUS menemukan kegiatan volunteer,
            workshop, dan seminar ramah lingkungan.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch}
            className="flex gap-2 bg-white rounded-xl p-1.5 max-w-xl shadow-xl mb-6">
            <input
              className="flex-1 px-4 text-sm text-g-dark outline-none bg-transparent placeholder-g-gray"
              placeholder="Cari nama event, lokasi, penyelenggara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="text-sm text-g-gray border-none outline-none bg-transparent px-2 cursor-pointer"
              onChange={e => navigate(`/events?category=${e.target.value}`)}>
              <option value="">Semua Kategori</option>
              <option>Volunteer</option>
              <option>Workshop</option>
              <option>Seminar</option>
            </select>
            <button type="submit"
              className="bg-g-main text-white px-5 py-2 rounded-lg text-sm font-semibold
                         hover:bg-g-dark transition-colors whitespace-nowrap">
              Cari
            </button>
          </form>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button onClick={() => navigate('/events')}
              className="bg-g-lime text-g-dark px-6 py-2.5 rounded-lg font-bold text-sm
                         hover:bg-g-hi transition-all">
              Jelajahi Event
            </button>
            <button
              onClick={() => document.getElementById('events-sec').scrollIntoView({ behavior: 'smooth' })}
              className="border border-g-wire text-g-gray px-6 py-2.5 rounded-lg text-sm
                         hover:bg-white/10 hover:text-white transition-all">
              Lihat Terbaru
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-g-wire/20">
          <div className="max-w-5xl mx-auto px-8 py-5 grid grid-cols-4 gap-4">
            {[
              { label: 'Total Event',  val: stats.total,     color: 'text-white' },
              { label: 'Upcoming',     val: stats.upcoming,  color: 'text-g-lime' },
              { label: 'Ongoing',      val: stats.ongoing,   color: 'text-g-yellow' },
              { label: 'Selesai',      val: stats.completed, color: 'text-g-gray' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className={`font-mono font-bold text-2xl ${s.color}`}>{s.val}</div>
                <div className="text-g-gray text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EVENT LIST */}
      <div className="max-w-5xl mx-auto px-8 pt-12 pb-20" id="events-sec">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-outfit font-bold text-xl text-g-dark">Event Terbaru</h2>
          <button onClick={() => navigate('/events')}
            className="text-g-main text-sm font-medium hover:text-g-dark transition-colors">
            Lihat semua
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CHIPS.map((c, i) => (
            <button key={i} onClick={() => setChip(i)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${chip === i
                  ? 'bg-g-dark border-g-dark text-white'
                  : 'bg-white border-g-wire text-g-gray hover:border-g-main hover:text-g-main'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <GridSkeleton />
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-g-gray">
            <div className="w-16 h-16 rounded-full bg-g-accent mx-auto mb-4 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                      stroke="#2D6A4F" strokeWidth="1.5"/>
                <path d="M8 12h8M12 8v8" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-outfit font-bold text-lg text-g-dark mb-1">Belum ada event</p>
            <p className="text-sm">Tambahkan event lewat Admin Django</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(ev => (
              <EventCard key={ev.id} event={ev}
                isBookmarked={bookmarkedIds.includes(ev.id)}
                onToggleBookmark={handleBookmark} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}