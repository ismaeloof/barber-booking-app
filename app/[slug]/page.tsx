import { supabase } from '@/lib/supabase'
import { getBarberiaPorSlug } from '@/lib/barberia'
import ListaServicios from '@/components/ListaServicios'
import { notFound } from 'next/navigation'

export default async function BarberíaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Obtener barbería por slug
  const barberia = await getBarberiaPorSlug(slug)

  if (!barberia) {
    notFound()
  }

  // Obtener servicios de esta barbería
  const { data: servicios } = await supabase
    .from('servicios')
    .select('*')
    .eq('barberia_id', barberia.id)

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        {barberia.nombre}
      </h1>
      {barberia.ciudad && (
        <p className="text-gray-600 mb-12">
          {barberia.ciudad} · Reserva tu experiencia
        </p>
      )}
      
      <ListaServicios 
        servicios={servicios || []} 
        barberiaId={barberia.id}
      />
    </main>
  )
}