'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function LoginPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/${slug}/admin`)
    }
  }

  return (
    <div className="min-h-screen bg-[#001219] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#001219] mb-2">Admin Login</h1>
        <p className="text-gray-600 mb-8">Accede al panel de administración</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A9396] text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A9396] text-black"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A9396] text-white py-3 rounded-xl font-bold hover:bg-[#005F73] transition disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <button
          onClick={() => router.push(`/${slug}`)}
          className="w-full mt-4 text-gray-600 text-sm hover:text-[#0A9396]"
        >
          ← Volver a la página de reservas
        </button>
      </div>
    </div>
  )
}