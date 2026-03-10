import { churchService } from "@/services/churchService"
import { notFound } from "next/navigation"

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

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Prédicas y Mensajes</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Videoteca de YouTube</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    Próximamente podrás ver nuestras transmisiones y escuchar los mensajes anteriores directamente desde aquí.
                </p>
            </div>
        </div>
    )
}
