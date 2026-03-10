import { churchService } from "@/services/churchService"
import { notFound } from "next/navigation"

export default async function ChurchSongsPage({
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
                <h1 className="text-3xl font-bold text-slate-900">Cancionero</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Alabanza y Adoración</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    Próximamente podrás ver las letras y escuchar las canciones que entonamos.
                </p>
            </div>
        </div>
    )
}
