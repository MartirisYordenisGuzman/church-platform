export default function DashboardPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Control</h1>
            <p className="text-slate-500 mb-8">Administra el portal de tu iglesia, eventos y predicaciones de forma unificada.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Tarjetas Estadísticas Simuladas */}
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

            <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl text-blue-900 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">¡Comienza a configurar tu Iglesia!</h3>
                    <p className="text-blue-700 max-w-lg mb-6">
                        Aún no has conectado una iglesia a este usuario. Ve a Configuración de Perfil para dar de alta a tu congregación y crear tu portal público.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Crear Portal
                    </button>
                </div>
            </div>
        </div>
    )
}
