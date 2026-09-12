export function getSessionId() {
  let sid = localStorage.getItem('session_id')
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).slice(2)
    localStorage.setItem('session_id', sid)
  }
  return sid
}

// Merge bookmark tamu ke akun setelah login/signup
export async function mergeGuestBookmarks(token) {
  const sid = localStorage.getItem('session_id')
  if (!sid) return
  try {
    const { getBookmarks, addBookmark } = await import('../api')
    const res = await getBookmarks(sid)
    const guestBookmarks = res.data.map(b => b.event?.id).filter(Boolean)
    for (const eid of guestBookmarks) {
      await addBookmark(sid + '_merged', eid)
    }
  } catch {}
}