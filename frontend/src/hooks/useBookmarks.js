import { useState, useEffect, useCallback } from 'react'
import { getBookmarks, addBookmark, removeBookmark } from '../api'
import { getSessionId } from './useSession'

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState([])
  const sessionId = getSessionId()

  useEffect(() => {
    getBookmarks(sessionId)
      .then(res => setBookmarkedIds(res.data.map(b => b.event.id)))
      .catch(() => {})
  }, [sessionId])

  const toggleBookmark = useCallback(async (eventId) => {
    const isOn = bookmarkedIds.includes(eventId)
    try {
      if (isOn) {
        await removeBookmark(sessionId, eventId)
        setBookmarkedIds(prev => prev.filter(id => id !== eventId))
        return false
      } else {
        await addBookmark(sessionId, eventId)
        setBookmarkedIds(prev => [...prev, eventId])
        return true
      }
    } catch { return isOn }
  }, [bookmarkedIds, sessionId])

  return { bookmarkedIds, toggleBookmark, sessionId }
}
