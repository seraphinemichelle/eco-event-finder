import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getEvents } from '../api'
import EventCard from '../components/EventCard'
import { GridSkeleton } from '../components/Skeleton'
import { showToast } from '../components/Toast'

export default function Events({ bookmarkedIds, onToggleBookmark }) {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    search:   searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status:   '',
  })
  const [inputSearch, setInputSearch] = useState(searchParams.get('search') || '')
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.search)   params.search   = filters.search
    if (filters.category) params.category = filters.category
    if (filters.status)   params.status   = filters.status
    getEvents(params)
      .then(r => setEvents(r.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [filters])

  function set(key, val) { setFilters(f => ({ ...f, [key]: val })) }
  function reset() { setFilters({ search: '', category: '', status: '' }) }

  async function handleBookmark(id) {
  const result = await onToggleBookmark(id)
  if (result === 'unauthorized') return result  // teruskan ke EventCard
  showToast(result ? 'Event disimpan!' : 'Bookmark dihapus.')
}

  const activeTags = Object.entries(filters).filter(([, v]) => v)

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-g-dark px-8 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-g-gray text-xs font-mono tracking-widest mb-2">EVENTS</div>
          <h1 className="font-outfit font-bold text-2xl text-white mb-6">
            Cari Event Lingkungan
          </h1>

          {/* Search */}
         <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-xl max-w-2xl">
          <input
          className="flex-1 min-w-0 px-4 text-sm text-g-dark outline-none bg-transparent placeholder-g-gray"
          value={inputSearch}
          onChange={e => setInputSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && set('search', inputSearch)}
          placeholder="Cari nama event, lokasi, penyelenggara..."
        />
        <button
         onClick={() => set('search', inputSearch)}
          className="bg-g-main text-white px-5 py-2 rounded-lg text-sm font-semibold
               hover:bg-g-dark transition-colors flex-shrink-0">
         Cari
        </button>
      </div>
      </div>
      </div>

      {/* Filter bar */}
      <div className="bg-g-dark/95 border-b border-g-wire/20">
        <div className="max-w-5xl mx-auto px-8 py-4 flex gap-3 items-center flex-wrap">
          <span className="text-g-gray text-xs font-mono tracking-widest">FILTER</span>

          {/* Category */}
          <select
            value={filters.category}
            onChange={e => set('category', e.target.value)}
            className="bg-white/10 border border-g-wire/30 text-white rounded-lg px-3 py-2
                       text-xs outline-none cursor-pointer">
            <option value="" style={{ background: '#1B3A2D' }}>Semua Kategori</option>
            {['Volunteer', 'Workshop', 'Seminar'].map(o => (
              <option key={o} value={o} style={{ background: '#1B3A2D' }}>{o}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={e => set('status', e.target.value)}
            className="bg-white/10 border border-g-wire/30 text-white rounded-lg px-3 py-2
                       text-xs outline-none cursor-pointer">
            <option value="" style={{ background: '#1B3A2D' }}>Semua Status</option>
            {[['upcoming','Upcoming'], ['ongoing','Ongoing'], ['completed','Selesai']].map(([v, l]) => (
              <option key={v} value={v} style={{ background: '#1B3A2D' }}>{l}</option>
            ))}
          </select>

          {/* Reset */}
          {activeTags.length > 0 && (
            <button onClick={reset}
              className="border border-g-wire/30 text-g-gray rounded-lg px-3 py-2 text-xs
                         hover:bg-white/10 hover:text-white transition-all">
              Reset
            </button>
          )}

          {/* Active tags */}
          {activeTags.map(([key, val]) => (
            <span key={key}
              className="bg-g-lime text-g-dark text-xs font-bold px-3 py-1 rounded-full
                         flex items-center gap-2">
              {val}
              <button onClick={() => set(key, '')}
                className="hover:opacity-60 font-bold">x</button>
            </span>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-8 pt-7 pb-20">
        <p className="text-xs text-g-gray font-mono mb-5">
          {events.length} EVENT DITEMUKAN
        </p>

        {loading ? (
          <GridSkeleton />
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-g-accent mx-auto mb-4
                            flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D6A4F" strokeWidth="1.5"/>
                <path d="M16.5 16.5L21 21" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-outfit font-bold text-lg text-g-dark mb-2">
              Event tidak ditemukan
            </h3>
            <p className="text-sm text-g-gray mb-6">
              Coba ubah kata kunci atau reset filter
            </p>
            <button onClick={reset}
              className="bg-g-main text-white px-6 py-2.5 rounded-lg text-sm font-semibold
                         hover:bg-g-dark transition-colors">
              Reset Filter
            </button>
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