'use client'

import { useActionState, useEffect, useState } from 'react'
import { createMinistry } from '../actions'
import Link from 'next/link'

const initialState = { error: '' }

// Cargar ministerios para llenar el selector de "Departamento de..."
function useMinistries() {
    const [ministries, setMinistries] = useState<{ id: string, name: string }[]>([])

    useEffect(() => {
        // En una app real, esto llamaría a un Endpoint GET o un Server Action de lectura directa.
        // Para simplificar, obtenemos los ministerios desde un route handler publico o simulado
        // Dado el entorno de Next.js Server Actions, lo ideal es pasar los ministerios como prop desde un layout
        // o usar SWR/React Query.
        // Por ahora, como es un componente de cliente, lo obtenemos así:
        fetch('/api/ministries')
            .then(res => res.json())
            .then(data => setMinistries(data))
            .catch(err => console.error("Error fetching ministries:", err))
    }, [])

    return ministries
}

export default function NewMinistryPage() {
    const [state, formAction, isPending] = useActionState(createMinistry, initialState)
    const ministries = useMinistries()

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/ministries" className="text-slate-400 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Crear Ministerio / Dept.</h1>
                    <p className="text-slate-500">Agrega un nuevo grupo o subdivisión de liderazgo.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <form action={formAction} className="flex flex-col gap-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                            Nombre del Ministerio <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ej: Jóvenes, Ujieres, Alabanza"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="parent_id">
                            Pertenece a (Convertir en Departamento)
                        </label>
                        <select
                            id="parent_id"
                            name="parent_id"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        >
                            <option value="">Ninguno (Es un Ministerio Principal)</option>
                            {ministries.map(min => (
                                <option key={min.id} value={min.id}>{min.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Si seleccionas un ministerio arriba, esto se creará como un sub-departamento dentro de él.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="leader_name">
                                Nombre del Líder (Opcional)
                            </label>
                            <input
                                id="leader_name"
                                name="leader_name"
                                type="text"
                                placeholder="Quién lo dirige"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="coleader_name">
                                Co-Líder (Opcional)
                            </label>
                            <input
                                id="coleader_name"
                                name="coleader_name"
                                type="text"
                                placeholder="Mano derecha"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">
                            Misión / Descripción Corta
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            placeholder="De qué se encarga este grupo..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 resize-none"
                        ></textarea>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Link
                            href="/dashboard/ministries"
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                        >
                            {isPending ? 'Guardando...' : 'Crear Grupo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
