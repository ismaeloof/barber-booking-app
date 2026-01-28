'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ListaServicios({ servicios }: { servicios: any[] }) {
    const [seleccionado, setSeleccionado] = useState<any>(null)
    const [fecha, setFecha] = useState('')
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [horasOcupadas, setHorasOcupadas] = useState<string[]>([])
    const horasPosibles = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']

    //Cada vez que cambie la fecha preguntamos si esas horas están pilladas
    useEffect(() => {
        async function buscarCitas() {
            if (!fecha) return

            //Aseguramos que la fecha sea string AAA-MM-DD
            const fechaLimpia = new Date(fecha).toISOString().split('T')[0]
            console.log("Buscando citas para:", fechaLimpia)

            const { data, error } = await supabase
                .from('citas')
                .select(`hora,
                        servicios (duracion_minutos)`)
                .eq('fecha', fechaLimpia)

            if (data) {
                const todosLosHuecos: string[] = [];

                data.forEach((cita: any) => {
                    //Convertimos a String 
                    const horaString = String(cita.hora);
                    const partes = horaString.split(':');

                    //Formateamos HH:MM asegurando que sean Strings
                    const h = String(partes[0]).padStart(2, '0');
                    const m = String(partes[1] || '00').padStart(2, '0');
                    const horaInicio = `${h}:${m}`;

                    todosLosHuecos.push(horaInicio);

                    //Accedemos al primer elemento de la lista de servicios
                    const servicios = Array.isArray(cita.servicios) ? cita.servicios[0] : cita.servicios;
                    const duracion = servicios?.duracion_minutos || 30;

                    console.log(`Cita a las ${horaInicio} detectada con duración: ${duracion} min`);

                    //Si la cita es de 60 mins, calculamos y bloqueamos el siguiente hueco
                    if (duracion === 60) {
                        let proximaH = parseInt(h);
                        let proximosM = parseInt(m) + 30;

                        if (proximosM === 60) {
                            proximaH += 1;
                            proximosM = 0;
                        }

                    const horaExtra = `${String(proximaH).padStart(2, '0')}:${String(proximosM).padStart(2, '0')}`;
                    todosLosHuecos.push(horaExtra);
                    }
                });

                console.log("LISTA FINAL BLOQUEADA:", todosLosHuecos);
                setHorasOcupadas([...todosLosHuecos]); // Copia limpia para forzar el render
                }
        }
        buscarCitas()
    }, [fecha])  //Fin de useEffect

    const realizarReserva = async (hora: string) => {
        if (!seleccionado || !nombre || !telefono) {
            alert("Por favor rellena tus datos.");
            return;
        }

        const { error } = await supabase
            .from('citas')
            .insert([
                {
                    fecha: new Date(fecha).toISOString().split('T')[0],
                    hora: hora,
                    servicio_id: seleccionado.id,
                    nombre_cliente: nombre,
                    telefono: telefono
                }
            ]);
        
        if (error) {
            alert("Error: " + error.message);
        } else {
            alert ("¡Cita reservada con éxito!");
            window.location.reload();
        }
        };
    

    return (
        <div className="w-full max-w-5xl">
            {/* Contenedor de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {servicios.map((servicio) => (
                    <div
                        key={servicio.id}
                        onClick={() => setSeleccionado(servicio)}
                        className={`relative overflow-hidden group border-2 p-8 rounded-3xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${
                            seleccionado?.id === servicio.id
                                ? 'border-[#0A9396] bg-[#001219] shadow-2xl'
                                : 'bg-white border-gray-100 shadow-sm hover:border-[#94D2BD]'
                            }`}
                    >
                        {/* Indicador visual de selección (Círculo en la esquina) */}
                        <div className={`absolute top-4 right-4 w-4 h-4 rounded-full transition-colors ${seleccionado?.id === servicio.id ? 'bg-[#94D2BD] animate-pulse' : 'bg-gray-100'
                            }`} />

                        <h2 className={`text-2xl font-bold transition-colors ${seleccionado?.id === servicio.id ? 'text-white' : 'text-[#001219]'
                            }`}>
                            {servicio.nombre}
                        </h2>

                        <div className="flex items-baseline mt-6">
                            <span className={`text-4xl font-black ${seleccionado?.id === servicio.id ? 'text-[#94D2BD]' : 'text-[#0A9396]'
                                }`}>
                                {servicio.precio}€
                            </span>
                            <span className="ml-2 text-sm text-gray-400">/ {servicio.duracion_minutos} min</span>
                        </div>

                        <button className={`w-full mt-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${seleccionado?.id === servicio.id
                                ? 'bg-[#94D2BD] text-[#001219]'
                                : 'bg-[#001219] text-white group-hover:bg-[#005F73]'
                            }`}>
                            {seleccionado?.id === servicio.id ? 'Seleccionado' : 'Elegir servicio'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Panel de Confirmación y Fecha */}
            {seleccionado && (
                <div className="mt-16 p-10 bg-[#001219] text-white rounded-[2rem] shadow-2xl border-t-4 border-[#0A9396] animate-in slide-in-from-bottom-8 duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="text-[#94D2BD] font-medium uppercase tracking-widest text-sm">Elige el momento</p>
                            <h3 className="text-3xl font-bold mt-2">Reservar {seleccionado.nombre}</h3>
                            <p className="text-gray-400 mt-1">Estamos listos para verte en nuestra Barbería.</p>
                        </div>

                        <div className="w-full md:w-auto">
                            <label className="block text-xs text-gray-400 uppercase mb-2 ml-1">Fecha de la cita</label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => {
                                    console.log("Cambiando fecha a:", e.target.value);
                                    setFecha(e.target.value);
                                }}
                                className="bg-[#005F73] text-white p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#94D2BD] w-full cursor-pointer"
                            />
                        
                            <div className="mb-8 mt-4 space-y-4">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                    type="text" 
                                    placeholder="Nombre completo"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full bg-[#00222a] text-white p-4 rounded-2xl border border-[#005F73] focus:border-[#94D2BD] outline-none transition-all"
                                    />
                                    <input 
                                    type="tel" 
                                    placeholder="Teléfono (ej: 600123456)"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="w-full bg-[#00222a] text-white p-4 rounded-2xl border border-[#005F73] focus:border-[#94D2BD] outline-none transition-all"
                                    />
                                </div>
                                </div>
                            <div className="w-full md:w-auto mt-6">
                                <label className="block text-xs text-gray-400 uppercase mb-4 ml-1">Horas disponibles</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {horasPosibles.map((h) => {
                                        const estaOcupada = horasOcupadas.some(ocupada => ocupada.trim() === h.trim());

                                        return (
                                            <button
                                                key={h}
                                                disabled={estaOcupada}
                                                onClick={() => {
                                                    console.log("Has pulsado la hora:", h); //confirmamos que funciona el boton
                                                    realizarReserva(h);
                                                }}
                                                className={`p-3 rounded-xl text-sm font-bold transition-all ${
                                                    estaOcupada
                                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                        : 'bg-[#0A9396] text-white hover:bg-[#94D2BD] hover:text-[#001219]'
                                                    }`}
                                            >
                                                {h}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}