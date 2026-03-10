import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const params = await searchParams

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <Link href="/" className="absolute left-8 top-8 text-slate-500 hover:text-slate-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                Volver
            </Link>

            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Bienvenido de nuevo</h1>
                        <p className="text-slate-500 mt-2 text-sm">Inicia sesión en tu cuenta de iglesia</p>
                    </div>

                    <form className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                                type="email"
                                placeholder="tu@correo.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                                type="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {params?.message && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                                {params.message}
                            </div>
                        )}

                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                formAction={login}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Iniciar Sesión
                            </button>

                            <button
                                formAction={signup}
                                className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                            >
                                Registrarse (Demo)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
