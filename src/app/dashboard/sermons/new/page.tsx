'use client'

import { useActionState } from 'react'
import { createSermon } from '../actions'
import Link from 'next/link'

const initialState = { error: '' }

export default function NewSermonPage() {
    const [state, formAction, isPending] = useActionState(createSermon, initialState)

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/sermons" className="text-slate-400 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Agregar Prédica</h1>
                    <p className="text-slate-500">Copia y pega el enlace de tu video de YouTube.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <form action={formAction} className="flex flex-col gap-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="youtube_url">
                            Enlace de YouTube <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </div>
                            <input
                                id="youtube_url"
                                name="youtube_url"
                                type="url"
                                placeholder="Ej: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-slate-50"
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">Extraeremos el video automáticamente a tu portal.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">
                            Título del Mensaje <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Ej: El Poder del Perdón"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="preacher">
                                Predicador <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="preacher"
                                name="preacher"
                                type="text"
                                placeholder="Ej: Pastor Juan Pérez"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="date">
                                Fecha de la Prédica <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="series">
                            Serie de Enseñanzas (Opcional)
                        </label>
                        <input
                            id="series"
                            name="series"
                            type="text"
                            placeholder="Ej: Fundamentos de la Fe"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex gap-2 items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span>{state.error}</span>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                        <Link
                            href="/dashboard/sermons"
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                        >
                            {isPending ? 'Guardando...' : 'Guardar Videoprédica'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
