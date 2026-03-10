import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logout } from "./actions"
import { LayoutDashboard, Calendar, Video, Users, Music, Settings } from "lucide-react"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // 1. Verificamos sesión y obtenemos usuario real
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    // TODO: Buscar la iglesia a la que pertenece el usuario usando Prisma (Próxima tarea)
    const userEmail = data.user.email

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Izquierdo */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-1">Mi Plataforma</h2>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Resumen</span>
                    </Link>
                    <Link href="/dashboard/events" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Calendar size={20} />
                        <span>Eventos</span>
                    </Link>
                    <Link href="/dashboard/sermons" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Video size={20} />
                        <span>Prédicas</span>
                    </Link>
                    <Link href="/dashboard/ministries" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span>Ministerios</span>
                    </Link>
                    <Link href="/dashboard/directory" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Users size={20} />
                        <span>Directorio</span>
                    </Link>
                    <Link href="/dashboard/songs" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Music size={20} />
                        <span>Canciones</span>
                    </Link>
                    <div className="pt-8 mb-4 border-t border-slate-800"></div>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Settings size={20} />
                        <span>Configuración</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action={logout}>
                        <button className="w-full py-2 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Área del Contenido Principal */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
