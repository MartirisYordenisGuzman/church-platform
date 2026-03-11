import { churchService } from "@/services/churchService"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ChurchLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ churchSlug: string }>
}) {
    const { churchSlug } = await params

    // Obtenemos la iglesia en el layout base para validar que exista
    // De no existir el slug cargado mostrará el 404 para todo este portal
    const church = await churchService.getChurchBySlug(churchSlug)

    if (!church) {
        notFound()
    }

    const primaryColor = (church.portalConfig?.theme as any)?.primaryColor || '#4f46e5'

    return (
        <div
            className="min-h-screen bg-slate-50 flex flex-col"
            style={{ '--color-primary': primaryColor } as React.CSSProperties}
        >
            {/* Navbar Genérico del Portal Público de la Iglesia */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all duration-300">
                <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                    <Link
                        href={`/${churchSlug}`}
                        className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                            <span className="text-lg leading-none">{church.name.charAt(0)}</span>
                        </div>
                        {church.name}
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {church.portalConfig?.layout === 'LANDING_PAGE' ? (
                            <>
                                <a href={`/${churchSlug}#events`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Eventos</a>
                                <a href={`/${churchSlug}#sermons`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Prédicas</a>
                                <a href={`/${churchSlug}#ministries`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Ministerios</a>
                            </>
                        ) : (
                            <>
                                <Link href={`/${churchSlug}/events`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Eventos</Link>
                                <Link href={`/${churchSlug}/sermons`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Prédicas</Link>
                                <Link href={`/${churchSlug}/ministries`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Ministerios</Link>
                            </>
                        )}
                    </nav>

                    {/* Botón de acceso / CTA */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden md:block text-sm font-medium px-5 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Ingresar
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col">{children}</main>

            {/* Footer Premium de la Iglesia */}
            <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-800">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <p className="mb-4 text-2xl font-bold flex items-center gap-2 text-white">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm shadow-lg shadow-indigo-500/20">{church.name.charAt(0)}</span>
                                {church.name}
                            </p>
                            <p className="text-slate-400 leading-relaxed max-w-sm">
                                {church.description || "Transformando vidas, construyendo comunidad y compartiendo esperanza en nuestra ciudad."}
                            </p>
                        </div>
                        <div className="hidden md:block"></div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
                            <div className="flex flex-col gap-2">
                                <Link href={`/${churchSlug}/events`} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Ver Calendario de Eventos</Link>
                                <Link href={`/${churchSlug}/sermons`} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Últimas Prédicas</Link>
                                <Link href={`/${churchSlug}/ministries`} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Nuestros Ministerios</Link>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} {church.name}. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                            Desarrollado en <span className="font-medium text-slate-400">Church Platform</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
