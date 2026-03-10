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

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar Genérico del Portal Público de la Iglesia */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                    <Link
                        href={`/${churchSlug}`}
                        className="font-bold text-xl text-slate-800 tracking-tight"
                    >
                        {church.name}
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href={`/${churchSlug}/events`}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Eventos
                        </Link>
                        <Link
                            href={`/${churchSlug}/sermons`}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Prédicas
                        </Link>
                        <Link
                            href={`/${churchSlug}/ministries`}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Ministerios
                        </Link>
                        <Link
                            href={`/${churchSlug}/songs`}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Canciones
                        </Link>
                    </nav>

                    {/* Botón de acceso / CTA */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col">{children}</main>

            {/* Footer Básico de la Iglesia */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="container mx-auto max-w-6xl px-4 text-center text-slate-400">
                    <p className="mb-4 text-lg font-semibold text-white">{church.name}</p>
                    <p className="text-sm mb-8">
                        {church.description || "Un lugar para conectar y crecer."}
                    </p>
                    <p className="text-xs">
                        © {new Date().getFullYear()} Creado con Church Platform. Todos los
                        derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    )
}
