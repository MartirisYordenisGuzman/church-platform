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
        <div className="flex-1 w-full bg-slate-50">
            {/* PREMIUN HERO SECTION */}
            <section className="relative overflow-hidden bg-slate-950 text-white min-h-[75vh] flex flex-col justify-center items-center px-4 py-20 text-center">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Tu Iglesia Digital
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400">
                        Bienvenidos a <br className="hidden md:block" /> {church.name}
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 font-light leading-relaxed">
                        {church.description || "Un espacio para conectar con Dios y crecer en comunidad. Descubre lo que tenemos preparado para ti."}
                    </p>

                    <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
                        <Link
                            href={`/${churchSlug}/events`}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] flex justify-center items-center gap-2"
                        >
                            Próximos Eventos
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                        <Link
                            href={`/${churchSlug}/sermons`}
                            className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white rounded-full font-semibold transition-all duration-300 backdrop-blur-md border border-white/10 flex justify-center items-center"
                        >
                            Últimas Prédicas
                        </Link>
                    </div>
                </div>
            </section>

            {/* BENTO GRID - QUICK STATS / INFO */}
            <section className="py-24 relative z-20 -mt-10 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start transition-transform duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Comunidad Activa</h3>
                            <p className="text-slate-500 leading-relaxed mb-6">Únete a nuestros ministerios y encuentra tu lugar de servicio en la casa de Dios.</p>
                            <Link href={`/${churchSlug}/ministries`} className="mt-auto text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 group">
                                Ver ministerios <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-10 rounded-3xl shadow-xl shadow-indigo-200 border border-indigo-400/30 flex flex-col items-start text-white transition-transform duration-300 hover:-translate-y-1 md:transform md:-translate-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Crecimiento Espiritual</h3>
                            <p className="text-indigo-100 leading-relaxed mb-6">Accede a nuestra biblioteca de prédicas en video para edificar tu vida en cualquier momento.</p>
                            <Link href={`/${churchSlug}/sermons`} className="mt-auto text-white font-semibold flex items-center gap-1 group">
                                Escuchar prédicas <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Link>
                        </div>

                        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start transition-transform duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Conexión Global</h3>
                            <p className="text-slate-500 leading-relaxed mb-6">No te pierdas ninguno de nuestros próximos eventos presenciales o virtuales.</p>
                            <Link href={`/${churchSlug}/events`} className="mt-auto text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1 group">
                                Ver calendario <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
