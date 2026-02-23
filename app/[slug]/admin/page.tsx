'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getBarberiaPorSlug } from '@/lib/barberia'
import SelectorFechas from './components/SelectorFechas'
import ResumenCaja from './components/ResumenCaja'
import ListaCitasAdmin from './components/ListaCitasAdmin'
import { useParams, useRouter } from 'next/navigation'

export default function AdminPanel() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [citas, setCitas] = useState<any[]>([])
  const [barberíaId, setBarberíaId] = useState<string | null>(null)
  const [diaFiltro, setDiaFiltro] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Verificar autenticación
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Redirigir a login
        alert('Necesitas iniciar sesión')
        router.push(`/${slug}/admin/login`)
        return
      }
      
      setUser(session.user)
      
      // Obtener barbería
      const barbería = await getBarberiaPorSlug(slug)
      if (barbería) {
        // Verificar que sea el owner
        if (barbería.owner_id !== session.user.id) {
          alert('No tienes permiso para ver este panel')
          router.push(`/${slug}`)
          return
        }
        setBarberíaId(barbería.id)
      }
      setLoading(false)
    }
    checkAuth()
  }, [slug, router])

  // Cargar citas cuando cambia la fecha o la barbería
  useEffect(() => {
    if (barberíaId && user) {
      cargarCitas()
    }
  }, [diaFiltro, barberíaId, user])

  async function cargarCitas() {
    if (!barberíaId) return
    
    const { data } = await supabase
      .from('citas')
      .select('*, servicios(*)')
      .eq('fecha', diaFiltro)
      .eq('barberia_id', barberíaId)
      .order('hora')
    
    if (data) setCitas(data)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001219] text-white flex items-center justify-center">
        <p>Verificando acceso...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#001219] text-white p-6 md:p-12 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#94D2BD]">Panel de Administración</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push(`/${slug}`)
          }}
          className="text-sm text-gray-400 hover:text-white"
        >
          Cerrar sesión
        </button>
      </div>
      
      <SelectorFechas fecha={diaFiltro} setFecha={setDiaFiltro} />
      <ResumenCaja citas={citas} />
      <ListaCitasAdmin citas={citas} refresh={cargarCitas} />
    </div>
  )
}