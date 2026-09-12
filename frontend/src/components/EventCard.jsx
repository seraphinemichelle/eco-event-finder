import { useNavigate } from 'react-router-dom'

const STATUS = {
  upcoming:  { cls: 'bg-g-lime text-g-dark font-semibold',           label: 'Upcoming' },
  ongoing:   { cls: 'bg-yellow-400 text-yellow-900 font-semibold',   label: 'Ongoing' },
  completed: { cls: 'bg-gray-400 text-white font-semibold',          label: 'Completed' },
}

const CATEGORY_COLOR = {
  Volunteer: 'bg-g-accent text-g-main',
  Workshop:  'bg-blue-100 text-blue-700',
  Seminar:   'bg-purple-100 text-purple-700',
}

// Helper: handle absolute or relative image URL from Django
function imgSrc(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `http://localhost:8000${path}`
}

export default function EventCard({ event, isBookmarked, onToggleBookmark }) {
  const navigate  = useNavigate()
  const st        = STATUS[event.status] || STATUS.upcoming
  const catColor  = CATEGORY_COLOR[event.category] || 'bg-g-accent text-g-main'

  async function handleBookmark(e) {
    e.stopPropagation()
    const result = await onToggleBookmark(event.id)
    if (result === 'unauthorized') navigate('/signup')
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-g-wire
                    hover:-translate-y-1 hover:shadow-lg hover:border-g-lime
                    transition-all duration-200 flex flex-col">

      {/* Cover */}
      <div className="h-36 relative overflow-hidden flex-shrink-0">
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
        <div className="absolute inset-0 bg-black/10" />

        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-lg flex items-center justify-center
            shadow transition-all border
            ${isBookmarked
              ? 'bg-g-main text-white border-g-main'
              : 'bg-white/90 text-g-gray border-g-wire hover:border-g-main hover:text-g-main'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'white' : 'none'}
               stroke={isBookmarked ? 'white' : 'currentColor'} strokeWidth="2">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Status badge */}
        <span className={`absolute bottom-2 left-3 px-2 py-0.5 rounded text-xs font-semibold ${st.cls}`}>
          {st.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit mb-2 ${catColor}`}>
          {event.category}
        </span>

        <h3 className="font-outfit font-bold text-sm text-g-dark leading-snug mb-3 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1 mb-3 flex-1">
          <p className="text-xs text-g-gray flex items-center gap-1">
            <span className="w-3 h-3 inline-block">
              <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="#8A9E93" strokeWidth="1.2"/><path d="M5 1v2M11 1v2M2 7h12" stroke="#8A9E93" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </span>
            {event.date_start}
          </p>
          <p className="text-xs text-g-gray flex items-center gap-1">
            <span className="w-3 h-3 inline-block">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.49-2.01-4.5-4.5-4.5z" stroke="#8A9E93" strokeWidth="1.2"/><circle cx="8" cy="6" r="1.5" stroke="#8A9E93" strokeWidth="1.2"/></svg>
            </span>
            {event.location}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-g-wire">
          <div className="flex gap-1 flex-wrap">
            {(event.sdg_tags || []).map(s => (
              <span key={s}
                className="text-xs font-bold px-2 py-0.5 rounded bg-g-accent text-g-main">
                {s}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="bg-g-main text-white px-3 py-1.5 rounded-lg text-xs font-semibold
                       hover:bg-g-dark transition-colors flex-shrink-0 ml-2"
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  )
}
