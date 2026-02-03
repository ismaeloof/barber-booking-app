'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import SelectorFechas from './components/SelectorFechas'
import ResumenCaja from './components/ResumenCaja'
import ListaCitasAdmin from './components/ListaCitasAdmin'

export default function AdminPanel() {
  const [citas, setCitas] = useState<any[]>([])
  const [diaFiltro, setDiaFiltro] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { cargarCitas() }, [diaFiltro])

  async function cargarCitas() {
    const { data } = await supabase.from('citas').select('*, servicios(*)').eq('fecha', diaFiltro).order('hora')
    if (data) setCitas(data)
  }

  return (
    <div className="min-h-screen bg-[#001219] text-white p-6 md:p-12 max-w-4xl mx-auto space-y-10">
      <SelectorFechas fecha={diaFiltro} setFecha={setDiaFiltro} />
      <ResumenCaja citas={citas} />
      <ListaCitasAdmin citas={citas} refresh={cargarCitas} />
    </div>
  )
}