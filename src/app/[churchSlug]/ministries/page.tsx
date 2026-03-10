import { churchService } from "@/services/churchService"
import { notFound } from "next/navigation"

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

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Ministerios</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Conecta con la Comunidad</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    Próximamente podrás inscribirte y descubrir los grupos y ministerios de nuestra iglesia.
                </p>
            </div>
        </div>
    )
}
