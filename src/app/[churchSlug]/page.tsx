import { churchService } from "@/services/churchService"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ChurchHomePage({
    params,
}: {
    params: Promise<{ churchSlug: string }>
}) {
    const { churchSlug } = await params
    const church = await churchService.getChurchFullProfileBySlug(churchSlug)

    if (!church) {
        notFound()
    }

    return (
        <div className="flex-1 w-full bg-white">
            {/* HERO SECTION */}
            <section className="bg-slate-900 text-white min-h-[60vh] flex flex-col justify-center items-center px-4 py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                    Bienvenidos a {church.name}
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mb-10">
                    {church.description || "Nos alegra mucho tenerte por aquí. Conecta con nosotros en nuestros próximos eventos y reuniones."}
                </p>
                <div className="flex gap-4 flex-col sm:flex-row">
                    <Link
                        href={`/${churchSlug}/events`}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all transform hover:scale-105"
                    >
                        Ver Eventos
                    </Link>
                    <Link
                        href={`/${churchSlug}/sermons`}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all backdrop-blur-sm"
                    >
                        Últimas Prédicas
                    </Link>
                </div>
            </section>

            {/* QUICK STATS / INFO */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Comunidad</h3>
                            <p className="text-slate-600">Únete a nuestros grupos y ministerios.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Crecimiento</h3>
                            <p className="text-slate-600">Recursos y prédicas para tu vida espiritual.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Conexión</h3>
                            <p className="text-slate-600">Asiste a nuestros próximos eventos unidos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PREVIEWS */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Lo último en {church.name}</h2>

                    {/* Aquí irán los componentes importados de events y sermons cuando se creen */}
                    <div className="text-slate-500 italic p-12 bg-slate-50 border rounded-2xl border-dashed">
                        (Página principal en construcción. Tu contenido destacado de Eventos y Prédicas se mostrará aquí).
                    </div>
                </div>
            </section>
        </div>
    )
}
