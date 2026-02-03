'use client'

interface Props {
  horasOcupadas: string[];
  onSeleccionarHora: (hora: string) => void;
}

const HORARIOS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30' ];

export default function SelectorHoras({ horasOcupadas, onSeleccionarHora }: Props) {
  return (
    // Usamos h-full y un grid que se estire
    <div className="grid grid-cols-3 gap-2 w-full h-full content-center"> 
      {HORARIOS.map((h) => {
        const estaOcupada = horasOcupadas.includes(h);
        return (
          <button
            key={h}
            disabled={estaOcupada}
            onClick={() => onSeleccionarHora(h)}
            className={`py-5 px-2 text-sm md:text-base rounded-[1rem] font-black transition-all duration-300 border ${
              estaOcupada 
                ? 'bg-white/5 text-gray-700 border-white/5 cursor-not-allowed opacity-50' 
                : 'bg-[#0A9396] text-white border-transparent hover:bg-[#94D2BD] hover:text-[#001219] shadow-lg shadow-[#0A9396]/10 '
            }`}
          >
            {h}
          </button>
        );
      })}
    </div>
  );
}