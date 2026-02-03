export default function ResumenCaja({ citas }: { citas: any[] }) {
  const totalGanancias = citas.reduce((acc, cita) => acc + (cita.servicios?.precio || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#00222a] p-6 rounded-[2rem] border border-[#0A9396]/20">
        <p className="text-gray-400 uppercase text-xs tracking-widest mb-1">Citas del día</p>
        <p className="text-4xl font-black">{citas.length}</p>
      </div>
      <div className="bg-[#0A9396] p-6 rounded-[2rem] text-[#001219]">
        <p className="text-[#00222a]/60 uppercase text-xs tracking-widest mb-1">Caja Estimada</p>
        <p className="text-4xl font-black">{totalGanancias}€</p>
      </div>
    </div>
  );
}