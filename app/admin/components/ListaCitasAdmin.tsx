import { supabase } from '@/lib/supabase';

export default function ListaCitasAdmin({ citas, refresh }: { citas: any[], refresh: () => void }) {
  
  async function eliminarCita(id: number) {
    if (confirm('¿Seguro que quieres borrar esta cita?')) {
      const { error } = await supabase.from('citas').delete().eq('id', id);
      if (!error) refresh(); // Recarga los datos del padre
    }
  }

  async function guardarNota(id: number, nota: string) {
    await supabase.from('citas').update({ notas_admin: nota }).eq('id', id);
  }

  return (
    <div className="space-y-4 pt-4">
      {citas.length > 0 ? citas.map(cita => (
        <div key={cita.id} className="bg-[#00222a] p-6 rounded-[2.5rem] border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold uppercase">{cita.nombre_cliente}</h3>
              <p className="text-gray-400 text-sm">{cita.servicios?.nombre} • {cita.telefono}</p>
            </div>
            <span className="text-2xl font-black text-[#0A9396]">{cita.hora.substring(0,5)}</span>
          </div>

          <textarea 
            placeholder="Añadir notas del corte..."
            defaultValue={cita.notas_admin}
            onBlur={(e) => guardarNota(cita.id, e.target.value)}
            className="w-full bg-[#001219] border border-[#0A9396]/20 rounded-2xl p-4 text-sm text-gray-300 outline-none focus:border-[#0A9396] transition-all resize-none"
            rows={2}
          />

          <button 
            onClick={() => eliminarCita(cita.id)}
            className="mt-4 text-red-500/50 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Eliminar cita
          </button>
        </div>
      )) : (
        <p className="text-center text-gray-500 py-20 italic">No hay citas programadas.</p>
      )}
    </div>
  );
}