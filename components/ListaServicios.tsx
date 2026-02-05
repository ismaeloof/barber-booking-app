'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import FormularioReserva from './FormularioReserva'
import SelectorHoras from './SelectorHoras'
import CalendarioClientes from './CalendarioClientes' // Importación única y limpia

interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  duracion_minutos: number;
}

export default function ListaServicios({ servicios }: { servicios: Servicio[] }) {
  // ESTADOS
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null)
  const [fechaObjeto, setFechaObjeto] = useState<Date | undefined>(new Date());
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([])
  const [mostrarExito, setMostrarExito] = useState(false);
  const [horaConfirmada, setHoraConfirmada] = useState('');
  
  const telefonoValido = /^[6789]\d{8}$/.test(telefono);

  // EFECTO: Buscar huecos cuando cambia la fecha
  useEffect(() => {
    async function buscarCitas() {
      if (!fecha) return
      const { data } = await supabase
        .from('citas')
        .select('hora, servicios (duracion_minutos)')
        .eq('fecha', fecha)

      if (data) {
        const huecos: string[] = [];
        data.forEach((cita: any) => {
          const horaInicio = String(cita.hora).substring(0, 5);
          huecos.push(horaInicio);
          const duracion = cita.servicios?.duracion_minutos || 30;
          // Si dura 60 min, bloqueamos también la siguiente media hora
          if (duracion === 60) {
            const [h, m] = horaInicio.split(':').map(Number);
            let nextH = h, nextM = m + 30;
            if (nextM === 60) { nextH++; nextM = 0; }
            huecos.push(`${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`);
          }
        });
        setHorasOcupadas(huecos);
      }
    }
    buscarCitas()
  }, [fecha])

  // LÓGICA: Manejador de cambio de fecha (Clean Code)
  const handleCambioFecha = (d: Date | undefined) => {
    if (d) {
      setFechaObjeto(d);
      // Ajuste de zona horaria manual para evitar errores de día
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setFecha(`${yyyy}-${mm}-${dd}`);
    }
  };

  const realizarReserva = async (hora: string) => {
    const { error } = await supabase
      .from('citas')
      .insert([{
        fecha,
        hora,
        servicio_id: seleccionado!.id, 
        nombre_cliente: nombre,
        telefono
      }]);

    if (error) {
      console.error("Error Supabase:", error);
      alert("Error: " + error.message);
    } else {
      setHoraConfirmada(hora);
      setMostrarExito(true); 
    }
  };

  const googleCalendar = () => {
    if (!seleccionado || !horaConfirmada) return '';
    const titulo = encodeURIComponent(`Cita: ${seleccionado.nombre}`);
    const detalles = encodeURIComponent(`Servicio: ${seleccionado.nombre}`);
    const fechaLimpia = fecha.replace(/-/g, '');
    const horaLimpia = horaConfirmada.replace(':', '');
    const inicio = `${fechaLimpia}T${horaLimpia}`;
    const fin = `${fechaLimpia}T${parseInt(horaLimpia) + 1}${horaLimpia.substring(2)}00`;
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${inicio}/${fin}&details=${detalles}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 select-none">
      {/* 1. GRID DE SERVICIOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {servicios.map((s) => (
          <div
            key={s.id}
            onClick={() => setSeleccionado(s)}
            className={`p-6 rounded-3xl cursor-pointer border-2 transition-all duration-300 transform hover:-translate-y-1 ${
              seleccionado?.id === s.id 
                ? 'border-[#0A9396] bg-[#001219] text-white shadow-lg shadow-[#0a9396]/20' 
                : 'bg-white border-[#0A9396]/30 text-[#001219] hover:border-[#0A9396] hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className={`text-xl font-bold ${seleccionado?.id === s.id ? 'text-white' : 'text-[#001219]'}`}>{s.nombre}</h3>
              {seleccionado?.id === s.id && (
                <div className="bg-[#0A9396] rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-baseline">
              <p className="text-3xl font-black text-[#0A9396]">{s.precio}€</p>
              <span className="ml-2 text-xs opacity-60">/ {s.duracion_minutos} min</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. PANEL DE RESERVA */}
      {seleccionado && (
        <div className="bg-[#001219] rounded-[3rem] p-8 md:p-14 text-white shadow-2xl mt-10 w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12"> 
            
            
            {/* COLUMNA IZQUIERDA: CALENDARIO + DATOS */}
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-4xl font-black text-[#94D2BD] tracking-tighter uppercase mb-2">Datos de Reserva</h3>
                <p className="text-gray-400 text-sm mb-8">Selecciona el día perfecto.</p>
                
                {/* CALENDARIO */}
                <div className="w-full flex justify-center mb-8">
                  <CalendarioClientes 
                    fecha={fechaObjeto} 
                    setFecha={handleCambioFecha} 
                  />
                </div>
              </div>

              {/* INPUTS - CLAVE: w-full para ocupar todo el ancho */}
              <div className="w-full">
                 <FormularioReserva 
                    nombre={nombre} 
                    setNombre={setNombre} 
                    telefono={telefono} 
                    setTelefono={setTelefono} 
                 />
              </div>
            </div>

            {/* COLUMNA DERECHA: HORAS */}
            <div className={`flex flex-col h-full border-l border-white/5 pl-12 transition-opacity duration-500 ${!telefonoValido ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
              <h4 className="text-[#94D2BD] text-xs font-black uppercase tracking-[0.4em] mb-8 text-center">
                {telefonoValido ? 'Horarios Disponibles' : 'Introduce tu teléfono'}
              </h4>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <SelectorHoras 
                  horasOcupadas={horasOcupadas} 
                  onSeleccionarHora={realizarReserva} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL ÉXITO */}
      {mostrarExito && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-[#001219] border border-[#0A9396]/50 p-10 rounded-[2.5rem] text-center max-w-sm w-full">
              <h3 className="text-2xl font-bold text-white mb-4">¡Confirmado!</h3>
              <p className="text-[#94D2BD] text-xl mb-6">{seleccionado?.nombre} el día {fecha.split('-').reverse().join('/')} a las {horaConfirmada}</p>
              <a href={googleCalendar()} target="_blank" className="block w-full py-4 bg-white text-[#001219] font-bold rounded-2xl mb-3">AÑADIR A CALENDARIO</a>
              <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#0A9396] text-white font-bold rounded-2xl">CERRAR</button>
           </div>
           
        </div>
      )}
    </div>
  )
}