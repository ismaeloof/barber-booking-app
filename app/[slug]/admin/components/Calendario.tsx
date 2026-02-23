'use client'

import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import 'react-day-picker/style.css';

export default function Calendario ({ fecha, setFecha }: {fecha: Date | undefined, setFecha: (d: Date | undefined) => void }) {
    // Deshabilitamos fines de semana y fechas pasadas 
    const diasDeshabilitados = [
        { dayOfWeek: [0, 6] },
        { before: new Date() } 
    ];

    return (
        <div className="bg-[#00222a] p-4 rounded-[2rem] border border-white/5 flex justify-center shadow-2xl">
      <style>{`
        /* Scope recomendado en v9: .rdp-root */
        .rdp-root {
          margin: 0;

          /* Flechas (chevron) */
          --rdp-accent-color: #94D2BD;

          /* Círculo del día seleccionado */
          --rdp-selected-border: 2px solid #0A9396;
        }

        .rdp-day { color: white; }

        .rdp-caption_label {
          text-transform: capitalize;
          color: #94D2BD;
          font-weight: bold;
        }

        /* Antes era .rdp-head_cell, en v9 es .rdp-weekday */
        .rdp-weekday { color: #6b7280; }

        /* Si quieres que SOLO las flechas cambien (sin afectar otros acentos),
           descomenta esto y deja --rdp-accent-color para selección.
        */
        /*
        .rdp-nav .rdp-chevron { fill: #94D2BD; }
        */

        /* Si además quieres que el seleccionado tenga relleno (no solo borde) */
        .rdp-selected .rdp-day_button {
          background: #0A9396;
          color: #001219;
        }

        /* (Opcional) Quitar que el número se vea más grande en selected */
        .rdp-selected {
          font-size: inherit;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={fecha}
        onSelect={setFecha}
        disabled={diasDeshabilitados}
        locale={es}
        className="text-white"
      />
    </div>
    );
}