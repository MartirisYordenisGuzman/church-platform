import { churchService } from "@/services/churchService"
import { ministryService } from "@/services/ministryService"
import { notFound } from "next/navigation"
import { Users, ChevronRight, Layers, Sparkles } from "lucide-react"

export default async function ChurchMinistriesPage({
    params,
}: {
    params: Promise<{ churchSlug: string }>
}) {
    const { churchSlug } = await params
    const church = await churchService.getChurchBySlug(churchSlug)

    if (!church) {
        notFound()
    }

    const ministries = await ministryService.getMinistriesByChurchId(church.id)

    return (
        <div className="flex-1 bg-slate-50 pb-24">
            {/* Page Header / Hero */}
            <div className="bg-slate-950 text-white py-20 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-black uppercase tracking-widest mb-6">
                            Nuestra Comunidad
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Grupos y <span className="text-indigo-500 leading-normal">Ministerios</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-light leading-relaxed">
                            Descubre tu propósito y encuentra un lugar donde servir y crecer. Hay un espacio para ti en nuestra familia.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-20">
                {ministries.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-24 text-center">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                            <Users className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Cargando nuestra comunidad</h3>
                        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed font-light">
                            Estamos organizando los grupos de servicio. Pronto verás aquí todas las áreas donde puedes conectar y ser parte.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ministries.map((ministry: any) => (
                            <div key={ministry.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
                                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 w-fit mb-6 transition-colors group-hover:bg-indigo-600 group-hover:text-white duration-500">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                    {ministry.name}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-light">
                                    {ministry.description || "Un ministerio dedicado al servicio, el crecimiento espiritual y el impacto en nuestra comunidad local."}
                                </p>

                                {ministry.departments && ministry.departments.length > 0 && (
                                    <div className="mb-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Layers className="w-3 h-3" />
                                            Departamentos
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {ministry.departments.map((dept: any) => (
                                                <span key={dept.id} className="text-xs font-bold text-slate-600 bg-white border border-slate-100 px-3 py-1 rounded-lg">
                                                    {dept.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Liderazgo</span>
                                        <span className="text-sm font-bold text-slate-700">{ministry.leader_name || "Equipo Ministerial"}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-sm">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA SECTION */}
            <section className="mt-32 container mx-auto px-4 max-w-4xl text-center">
                <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">¿Quieres ser parte?</h2>
                        <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-xl mx-auto font-light leading-relaxed">
                            No importa cuál sea tu talento o disponibilidad, hay un lugar especial para ti en nuestra iglesia.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-10 py-5 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
                                Contactar ahora
                            </button>
                            <button className="px-10 py-5 bg-indigo-500/50 backdrop-blur-md border border-indigo-400/30 text-white rounded-full font-bold hover:bg-indigo-500/70 transition-all active:scale-95">
                                Ver otros grupos
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
