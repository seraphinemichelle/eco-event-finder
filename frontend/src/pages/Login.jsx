import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)


  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }


  async function handleSubmit(e) {
    e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login/`, form)
    localStorage.removeItem('session_id')   // ← clear bookmark tamu
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    onLogin(res.data.user)
    navigate('/')
  } catch (err) {
    setError('Username atau password salah. Coba lagi.')
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-g-bg flex">


      {/* Left panel */}
<div className="hidden lg:flex flex-col justify-between w-1/2 bg-g-dark p-12 relative overflow-hidden">
{/* Decorative circles */}
  <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-g-lime/10" />
  <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full border border-g-lime/10" />
  <div className="absolute top-1/2 -translate-y-1/2 right-6 w-3 h-3 rounded-full bg-g-lime/40" />
  <div className="absolute top-1/3 right-28 w-2 h-2 rounded-full bg-g-lime/30" />
  <div className="absolute top-2/3 right-20 w-4 h-4 rounded-full bg-g-yellow/25" />
  <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-g-main/40" />
  <div className="absolute bottom-48 left-10 w-28 h-28 rounded-full border border-g-lime/15" />


  {/* Top: Logo */}
  <div className="relative z-10 flex items-center gap-2">
    <img src="/logo.png" alt="logo" className="w-7 h-7 object-contain" />
    <span className="font-mono font-bold text-g-lime text-sm">
EcoEvent <span className="text-white font-normal">Finder</span>
    </span>
  </div>


  {/* Middle: Headline */}
  <div className="relative z-10">
    <h2 className="font-outfit font-bold text-3xl text-white leading-tight mb-4">
      Temukan event lingkungan<br />
      <span className="text-g-lime">yang menginspirasi</span>
    </h2>
    <p className="text-g-gray text-sm leading-relaxed max-w-sm">
      Platform terpusat untuk mahasiswa BINUS menemukan kegiatan
      volunteer, workshop, dan seminar ramah lingkungan.
    </p>
  </div>


  {/* Bottom: Quote */}
  <div className="relative z-10 border-l-2 border-g-lime/40 pl-4">
    <p className="text-white/60 text-xs leading-relaxed italic">
      "Setiap aksi kecil untuk lingkungan dimulai dari kesadaran,
      temukan eventmu dan mulai berkontribusi hari ini."
    </p>
</div>
</div>


      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">


          {/* Header */}
          <div className="mb-8">
            <div className="text-g-gray text-xs font-mono tracking-widest mb-2">MASUK</div>
            <h1 className="font-outfit font-bold text-2xl text-g-dark">Selamat datang kembali</h1>
            <p className="text-g-gray text-sm mt-1">
              Belum punya akun?{' '}
              <Link to="/signup" className="text-g-main font-semibold hover:text-g-dark no-underline">
                Daftar sekarang
              </Link>
            </p>
          </div>


          {/* Error */}
          {error && (
 <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                            rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-g-gray tracking-wide block mb-1.5">
                USERNAME
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                required
                placeholder="Masukkan username"
                className="w-full border border-g-wire rounded-lg px-4 py-2.5 text-sm
                           text-g-dark outline-none bg-white
                           focus:border-g-main transition-colors placeholder-g-gray"
              />
            </div>


            <div>
              <label className="text-xs font-mono text-g-gray tracking-wide block mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
                placeholder="Masukkan password"
                className="w-full border border-g-wire rounded-lg px-4 py-2.5 text-sm
                           text-g-dark outline-none bg-white
                           focus:border-g-main transition-colors placeholder-g-gray"
              />
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-g-main text-white py-3 rounded-lg font-semibold text-sm
                         hover:bg-g-dark transition-colors disabled:opacity-60
                         disabled:cursor-not-allowed mt-2">
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>


          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-g-wire" />
            <span className="text-xs text-g-gray font-mono">ATAU</span>
            <div className="flex-1 h-px bg-g-wire" />
          </div>


          {/* Guest */}
          <button
            onClick={() => navigate('/')}
            className="w-full border border-g-wire text-g-gray py-3 rounded-lg text-sm
                       font-semibold hover:bg-g-accent hover:text-g-dark
                       hover:border-g-lime transition-all">
            Lanjut sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  )
}




