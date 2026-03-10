'use client'

import { useActionState } from 'react'
import { createChurch } from './actions'

const initialState = { error: '' }

export default function SettingsPage() {
    const [state, formAction, isPending] = useActionState(createChurch, initialState)

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Configuración Inicial</h1>
            <p className="text-slate-500 mb-8">Da de alta tu congregación para activar tu portal público.</p>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <form action={formAction} className="flex flex-col gap-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                            Nombre Oficial de la Iglesia
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ej: Ministerio Centro Vida"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="slug">
                            Dirección de tu Portal (URL)
                        </label>
                        <div className="flex rounded-lg shadow-sm">
                            <span className="px-4 py-2 inline-flex items-center rounded-l-md border border-r-0 border-slate-300 bg-slate-100 text-slate-500 sm:text-sm truncate">
                                tu-plataforma.com/
                            </span>
                            <input
                                type="text"
                                name="slug"
                                id="slug"
                                className="flex-1 block w-full px-4 py-2 min-w-0 rounded-none rounded-r-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm bg-slate-50"
                                placeholder="centro-vida"
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">Solo minúsculas, números y guiones. Sin espacios.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">
                            Descripción Corta (Meta/Misión)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            placeholder="Un resumen de quiénes son y qué buscan como congregación..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 resize-none"
                        ></textarea>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait text-white rounded-lg font-medium transition-colors"
                        >
                            {isPending ? 'Configurando...' : 'Crear y Publicar Portal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
