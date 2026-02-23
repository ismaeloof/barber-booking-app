'use client'
import Calendario from './Calendario';

interface SelectorFechasProps {
  fecha: string;
  setFecha: (nuevaFecha: string) => void;
}

export default function SelectorFechas({ fecha, setFecha }: SelectorFechasProps) {
  // TRUCO CLAVE: Convertimos el string '2024-02-05' a fecha añadiendo una hora fija
  // Esto evita que por la zona horaria te seleccione el día anterior
  const fechaObjeto = fecha ? new Date(`${fecha}T12:00:00`) : undefined;

  return (
    <div className="w-full space-y-4">
      <div className="bg-[#001c25] p-6 rounded-[2.5rem] border border-white/5 shadow-inner flex justify-center">
        <Calendario
          fecha={fechaObjeto} 
          setFecha={(d: Date | undefined) => {
            if (d) {
              // Si el usuario selecciona un día, lo convertimos a string y avisamos al padre
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              const nuevaFecha = `${yyyy}-${mm}-${dd}`;
              
              console.log("Fecha seleccionada:", nuevaFecha); // MIRA LA CONSOLA (F12) PARA VER SI SALE ESTO
              setFecha(nuevaFecha);
            }
          }} 
        />
      </div>
    </div>
  );
}