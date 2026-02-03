'use client'

interface Props {
  nombre: string;
  setNombre: (v: string) => void;
  telefono: string;
  setTelefono: (v: string) => void;
}

export default function FormularioReserva({ nombre, setNombre, telefono, setTelefono }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="group">
        <input 
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => {
            // Solo permite letras y espacios (bloquea números)
            const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
            setNombre(val);
          }}
          className="w-full bg-[#001c25] p-5 rounded-2xl border border-white/5 text-white placeholder-gray-500 focus:border-[#94D2BD] outline-none transition-all"
        />
      </div>
      <div className="group">
        <input 
          type="tel"
          placeholder="Teléfono móvil"
          value={telefono}
          maxLength={9} // Limita a 9 dígitos
          onChange={(e) => {
            // Solo permite números
            const val = e.target.value.replace(/\D/g, '');
            setTelefono(val);
          }}
          className="w-full bg-[#001c25] p-5 rounded-2xl border border-white/5 text-white placeholder-gray-500 focus:border-[#94D2BD] outline-none transition-all"
        />
      </div>
    </div>
  )
}