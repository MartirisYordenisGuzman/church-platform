import { churchService } from "@/services/churchService"
import { sermonService } from "@/services/sermonService"
import { notFound } from "next/navigation"
import { es } from "date-fns/locale"
import { Play, User, Calendar, Youtube, Sparkles, MonitorPlay } from "lucide-react"

export default async function ChurchSermonsPage({
    params,
}: {
    params: Promise<{ churchSlug: string }>
}) {
    const { churchSlug } = await params
    const church = await churchService.getChurchBySlug(churchSlug)

    if (!church) {
        notFound()
    }

    const sermons = await sermonService.getSermonsByChurchId(church.id)

    return (
        <div className="flex-1 bg-slate-50 pb-24">
            {/* Page Header / Hero */}
            <div className="bg-slate-950 text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/10 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-black uppercase tracking-widest mb-8">
                        <MonitorPlay className="w-4 h-4" />
                        Videoteca de Mensajes
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Palabra que <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white">Edifica</span>
                    </h1>
                    <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                        Explora nuestra colección de prédicas y mensajes diseñados para fortalecer tu fe y acompañarte en tu caminar con Dios.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-12 relative z-20">
                {sermons.length === 0 ? (
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-24 text-center">
                        <div className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-6 scale-110">
                            <Youtube className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Aún no hay mensajes</h3>
                        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed font-light">
                            Estamos preparando nuestra galería de videos. Muy pronto podrás revivir cada mensaje y compartirlo con otros.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {sermons.map((sermon) => (
                            <div key={sermon.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
                                <div className="aspect-video w-full bg-slate-950 relative">
                                    <iframe
                                        className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                        src={sermonService.getYoutubeEmbedUrl(sermon.youtube_video_id)}
                                        title={sermon.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                    <div className="absolute inset-0 pointer-events-none border-[6px] border-white/5 rounded-[2.5rem]"></div>
                                </div>

                                <div className="p-10 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-4">
                                        {sermon.series ? (
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
                                                <Sparkles className="w-3 h-3" />
                                                Serie: {sermon.series}
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
                                        <div className="text-slate-400">
                                            <Youtube className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:text-red-500 transition-all duration-500" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors leading-tight">
                                        {sermon.title}
                                    </h3>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 group-hover:bg-indigo-50/30 group-hover:border-indigo-100/30 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Predicador</span>
                                                <span className="text-sm font-bold text-slate-700">{sermon.preacher}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-indigo-400" />
                                                <span className="capitalize">{sermon.date.toLocaleDateString(es.code, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-xl">
                                                Ver ahora <Play className="w-3 h-3 fill-current" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CHANNEL CTA */}
            <div className="container mx-auto px-4 max-w-4xl mt-32">
                <div className="p-12 md:p-16 rounded-[3rem] bg-indigo-50 border border-indigo-100 text-center relative overflow-hidden shadow-sm">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 font-display">¡No te pierdas nada en vivo!</h2>
                        <p className="text-slate-600 mb-10 text-lg leading-relaxed font-light font-display">Suscríbete a nuestro canal de YouTube y activa las notificaciones para unirte a nuestras transmisiones en tiempo real.</p>
                        <a
                            href="#"
                            target="_blank"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all shadow-xl shadow-red-200 hover:-translate-y-1 active:scale-95"
                        >
                            <Youtube className="w-6 h-6" />
                            Ir a nuestro Canal
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
