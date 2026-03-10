import { churchService } from "@/services/churchService"
import { eventService } from "@/services/eventService"
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

    const events = await eventService.getEventsByChurchId(church.id)

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Eventos de {church.name}</h1>

            {events.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Próximos Eventos</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Pronto verás aquí la lista completa de conferencias, reuniones y eventos especiales de nuestra comunidad.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-3 bg-blue-600 w-full"></div>
                            <div className="p-6">
                                <div className="text-sm font-semibold text-blue-600 mb-2">
                                    {event.start_date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                                {event.description && (
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                        {event.description}
                                    </p>
                                )}
                                <div className="space-y-2 mt-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        {event.start_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        {event.location || 'Por definir'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
