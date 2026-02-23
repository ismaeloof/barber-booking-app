import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#001219] text-white p-8">
      <h1 className="text-5xl font-black mb-4 text-[#94D2BD]">
        Barber Booking SaaS
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Sistema de reservas multi-tenant
      </p>
      
      {/* Demo link */}
      <Link 
        href="/mi-barberia-prueba"
        className="bg-[#0A9396] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#005F73] transition"
      >
        Ver Demo
      </Link>

      <p className="mt-8 text-sm text-gray-500">
        Build in Public - 90 días
      </p>
    </main>
  )
}