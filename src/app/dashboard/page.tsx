import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Validar usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Buscar si el usuario ya está asignado a al menos una iglesia en Prisma
    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id },
        include: { church: true }
    })

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Control</h1>
            <p className="text-slate-500 mb-8">Administra el portal de tu iglesia, eventos y predicaciones de forma unificada.</p>

            {/* Tarjetas Estadísticas Simuladas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1">Próximos Eventos</p>
                    <div className="text-3xl font-bold text-slate-800">12</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1">Prédicas Subidas</p>
                    <div className="text-3xl font-bold text-slate-800">45</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1">Miembros de Grupos</p>
                    <div className="text-3xl font-bold text-slate-800">89</div>
                </div>
            </div>

            {!userChurch ? (
                // UI MODO: SIN IGLESIA (Te fuerza a ir a settings)
                <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl text-blue-900 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">¡Comienza a configurar tu Iglesia!</h3>
                        <p className="text-blue-700 max-w-lg mb-6">
                            Aún no has conectado una iglesia a este usuario. Ve a Configuración de Perfil para dar de alta a tu congregación y crear tu portal público.
                        </p>
                        <Link
                            href="/dashboard/settings"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Crear Portal
                        </Link>
                    </div>
                </div>
            ) : (
                // UI MODO: CON IGLESIA (Muestra resumen activo)
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Portal Activo</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <h4 className="font-bold text-lg text-slate-900">{userChurch.church.name}</h4>
                            <p className="text-slate-500 max-w-xl text-sm mt-1">{userChurch.church.description || 'Sin descripción asignada.'}</p>
                        </div>
                        <a
                            href={`/${userChurch.church.slug}`}
                            target="_blank"
                            className="whitespace-nowrap flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
                        >
                            Visitar Portal Público
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    </div>
                </div>
            )}

        </div>
    )
}
