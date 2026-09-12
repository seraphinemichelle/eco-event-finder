import { useState, useEffect } from 'react'

let _show = null
export const showToast = (msg) => _show?.(msg)

export default function Toast() {
  const [state, setState] = useState({ visible: false, msg: '' })

  useEffect(() => {
    _show = (msg) => {
      setState({ visible: true, msg })
      setTimeout(() => setState(s => ({ ...s, visible: false })), 2500)
    }
  }, [])

  return (
    <div className={`fixed bottom-7 right-7 z-50 flex items-center gap-3 bg-g-dark text-white
      px-5 py-3 rounded-xl shadow-xl text-sm font-medium border-l-4 border-g-lime
      transition-all duration-300
      ${state.visible
        ? 'translate-y-0 opacity-100'
        : 'translate-y-16 opacity-0 pointer-events-none'}`}>
      <span>{state.msg}</span>
    </div>
  )
}