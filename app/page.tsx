import { supabase } from '@/lib/supabase'
import ListaServicios from '@/components/ListaServicios'

export default async function Home() {
  const { data: servicios } = await supabase.from('servicios').select('*')

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
      <h1 className="text-4xl font-bold mb-12 text-gray-900">Reserva tu Experiencia</h1>
      
      {/* Pasamos los datos del servidor al componente de cliente */}
      <ListaServicios servicios={servicios || []} />
    </main>
  )
}