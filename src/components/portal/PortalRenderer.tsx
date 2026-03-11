import Link from "next/link"
import { ChurchProfile } from "@/types/church"

export default function PortalRenderer({ church }: { church: ChurchProfile }) {
    const blocks = church.portalConfig?.blocks || []
    // Ensure we have some default blocks if none exist
    const activeBlocks = blocks.filter(b => b.is_visible).sort((a, b) => a.order - b.order)

    if (activeBlocks.length === 0) {
        return (
            <div className="py-20 text-center text-slate-500">
                <p>El portal está en construcción.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {activeBlocks.map((block) => {
                switch (block.type) {
                    case 'hero':
                        return <HeroBlock key={block.id} church={church} data={block.data} />
                    case 'events':
                        return <EventsBlock key={block.id} church={church} data={block.data} layout={church.portalConfig?.layout} />
                    case 'sermons':
                        return <SermonsBlock key={block.id} church={church} data={block.data} layout={church.portalConfig?.layout} />
                    case 'ministries':
                        return <MinistriesBlock key={block.id} church={church} data={block.data} layout={church.portalConfig?.layout} />
                    case 'custom_text':
                        return <CustomTextBlock key={block.id} church={church} data={block.data} />
                    default:
                        return null
                }
            })}
        </div>
    )
}

// --- BLOCK COMPONENTS ---

function HeroBlock({ church, data }: { church: ChurchProfile, data: any }) {
    const title = data?.title || `Bienvenidos a ${church.name}`
    const subtitle = data?.subtitle || church.description || "Un espacio para conectar con Dios y crecer en comunidad."

    return (
        <section id="hero" className="relative overflow-hidden bg-slate-950 text-white min-h-[75vh] flex flex-col justify-center items-center px-4 py-20 text-center">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Tu Iglesia Digital
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400">
                    {title}
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 font-light leading-relaxed">
                    {subtitle}
                </p>

                <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
                    <Link
                        href={`/${church.slug}/events`}
                        className="px-8 py-4 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_40px_-10px_var(--color-primary)] flex justify-center items-center gap-2"
                    >
                        Próximos Eventos
                    </Link>
                </div>
            </div>
        </section>
    )
}

function EventsBlock({ church, data, layout }: { church: ChurchProfile, data: any, layout?: string }) {
    const title = data?.title || 'Próximos Eventos'
    const isMultiPage = layout === 'MULTI_PAGE'

    return (
        <section id="events" className="py-24 bg-white relative z-20 px-4 border-b border-slate-100">
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h2>
                        <p className="text-slate-500 max-w-2xl text-lg">Únete a nosotros en nuestras próximas actividades y sé parte de la comunidad.</p>
                    </div>
                    <Link href={`/${church.slug}/events`} className="hidden md:flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:opacity-80 transition-colors">
                        Ver calendario completo &rarr;
                    </Link>
                </div>

                {/* Eventos Preview */}
                {!isMultiPage && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {church.events && church.events.length > 0 ? (
                            church.events.map(event => (
                                <div key={event.id} className="p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{new Date(event.start_date).toLocaleDateString()}</p>
                                    <p className="text-slate-600 line-clamp-3">{event.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-500">No hay eventos próximos.</p>
                            </div>
                        )}
                    </div>
                )}

                <Link href={`/${church.slug}/events`} className={`mt-8 flex ${isMultiPage ? 'justify-start' : 'md:hidden justify-center'} items-center gap-2 text-[var(--color-primary)] font-semibold hover:opacity-80 transition-colors`}>
                    Ver calendario completo &rarr;
                </Link>
            </div>
        </section>
    )
}

function SermonsBlock({ church, data, layout }: { church: ChurchProfile, data: any, layout?: string }) {
    const title = data?.title || 'Últimas Prédicas'
    const subtitle = data?.subtitle || 'Edifica tu vida con los mensajes más recientes.'
    const isMultiPage = layout === 'MULTI_PAGE'

    return (
        <section id="sermons" className="py-24 bg-slate-50 relative z-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{title}</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">{subtitle}</p>
                </div>

                {!isMultiPage && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {church.sermons && church.sermons.length > 0 ? (
                            church.sermons.map(sermon => (
                                <div key={sermon.id} className="group cursor-pointer">
                                    <div className="aspect-video bg-slate-200 rounded-3xl mb-4 overflow-hidden relative">
                                        <img src={`https://img.youtube.com/vi/${sermon.youtube_video_id}/maxresdefault.jpg`} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-primary)] shadow-lg transform group-hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">{sermon.title}</h3>
                                    <p className="text-sm text-slate-500">{sermon.preacher} • {new Date(sermon.date).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12">
                                <p className="text-slate-500">Próximamente nuevas prédicas.</p>
                            </div>
                        )}
                    </div>
                )}

                <div className={`mt-12 text-center`}>
                    <Link href={`/${church.slug}/sermons`} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] rounded-full font-semibold transition-all shadow-sm hover:shadow">
                        Ver todas las prédicas
                    </Link>
                </div>
            </div>
        </section>
    )
}

function MinistriesBlock({ church, data, layout }: { church: ChurchProfile, data: any, layout?: string }) {
    const title = data?.title || 'Nuestros Ministerios'
    const isMultiPage = layout === 'MULTI_PAGE'

    return (
        <section id="ministries" className="py-24 bg-white relative z-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h2>
                        <p className="text-slate-500 max-w-2xl text-lg">Encuentra tu lugar de servicio y crecimiento en nuestra comunidad.</p>
                    </div>
                </div>

                {!isMultiPage && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Placeholder para ministerios, en un futuro se traerán los ministerios reales */}
                        <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Jóvenes</h3>
                            <p className="text-sm text-slate-600">Reuniones semanales llenas de energía y palabra.</p>
                        </div>

                        <div className="p-8 bg-purple-50 rounded-[2rem] border border-purple-100 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Alabanza</h3>
                            <p className="text-sm text-slate-600">Adoración sincera que conecta el cielo y la tierra.</p>
                        </div>

                        <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enseñanza</h3>
                            <p className="text-sm text-slate-600">Estudio profundo de la Palabra de Dios para tu vida.</p>
                        </div>

                        <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 mb-6 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"></path><path d="M12 2v20"></path><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Misiones</h3>
                            <p className="text-sm text-slate-600">Llevando el amor de Dios más allá de nuestras fronteras.</p>
                        </div>
                    </div>
                )}

                {isMultiPage && (
                    <div className="mt-8">
                        <Link href={`/${church.slug}/ministries`} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] rounded-full font-semibold transition-all shadow-sm hover:shadow">
                            Conocer más sobre ministerios
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
