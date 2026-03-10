import { churchService } from "@/services/churchService"
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

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Eventos de {church.name}</h1>

            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Próximos Eventos</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    Pronto verás aquí la lista completa de conferencias, reuniones y eventos especiales de nuestra comunidad.
                </p>
            </div>
        </div>
    )
}
