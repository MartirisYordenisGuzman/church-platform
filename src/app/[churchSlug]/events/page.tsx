import { churchService } from "@/services/churchService"
import { eventService } from "@/services/eventService"
import EventCalendar from "@/components/events/EventCalendar"
import { notFound } from "next/navigation"

export default async function ChurchEventsPage({
    params,
}: {
    params: Promise<{ churchSlug: string }>
}) {
    const { churchSlug } = await params
    const church = await churchService.getChurchBySlug(churchSlug)

    if (!church) {
        notFound()
    }

    const events = await eventService.getPublicEventsByChurchId(church.id)

    return (
        <div className="flex-1 bg-slate-50 pb-20">
            {/* Page Header / Hero */}
            <div className="bg-slate-950 text-white py-16 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent"></div>
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                                Calendario
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Próximas Actividades</h1>
                            <p className="text-slate-400 mt-4 max-w-2xl text-lg font-light">
                                Mantente al tanto de todo lo que sucede en nuestra comunidad. Reuniones, eventos especiales y tiempos de comunión.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {events.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-20 text-center">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Sin eventos por ahora</h3>
                        <p className="text-slate-500 max-w-md mx-auto text-lg font-light">
                            Estamos preparando nuevas actividades para ti. Vuelve pronto para descubrir todo lo que compartiremos juntos.
                        </p>
                    </div>
                ) : (
                    <div className="relative -mt-20 z-20">
                        <EventCalendar initialEvents={events} />
                    </div>
                )}
            </div>
        </div>
    )
}
