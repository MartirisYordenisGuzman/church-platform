'use client'

import { useActionState } from 'react'
import { createMember } from '../actions'
import Link from 'next/link'

const initialState = { error: '' }

export default function NewMemberPage() {
    const [state, formAction, isPending] = useActionState(createMember, initialState)

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/directory" className="text-slate-400 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Añadir Persona</h1>
                    <p className="text-slate-500">Registra un nuevo miembro en la base de datos de tu iglesia.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <form action={formAction} className="flex flex-col gap-6">

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                                Nombre Completo <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="phone">
                                Teléfono / WhatsApp
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="birth_date">
                            Fecha de Nacimiento
                        </label>
                        <input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Link
                            href="/dashboard/directory"
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                        >
                            {isPending ? 'Guardando...' : 'Registrar Persona'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
