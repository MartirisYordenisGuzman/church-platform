'use client'

import { useActionState, useEffect, useState } from 'react'
import { addMemberToMinistry } from './actions'

const initialState = { error: '', success: false }

export function AddMemberForm({ ministryId }: { ministryId: string }) {
    const [state, formAction, isPending] = useActionState(addMemberToMinistry, initialState)
    const [members, setMembers] = useState<{ id: string, first_name: string, last_name: string }[]>([])

    // Cargar opciones para el select desde un nuevo endpoint /api/directory
    useEffect(() => {
        fetch('/api/directory')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("Error fetching members:", err))
    }, [])

    return (
        <form action={formAction} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 flex flex-col gap-4">
            <h3 className="font-semibold text-slate-800">Añadir Persona al Grupo</h3>
            <input type="hidden" name="ministry_id" value={ministryId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="member_id">
                        Selecciona a la Persona
                    </label>
                    <select
                        id="member_id"
                        name="member_id"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        required
                    >
                        <option value="">- Seleccionar -</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.first_name} {member.last_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="role">
                        Rol / Posición
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        required
                        defaultValue="MEMBER"
                    >
                        <option value="MEMBER">Miembro Regular</option>
                        <option value="LEADER">Líder Principal</option>
                        <option value="COLEADER">Co-líder / Ayudante</option>
                        <option value="SECRETARY">Secretario(a)</option>
                        <option value="TREASURER">Tesorero(a)</option>
                    </select>
                </div>
            </div>

            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mt-2">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                    {isPending ? 'Añadiendo...' : 'Añadir al Ministerio'}
                </button>
            </div>
        </form>
    )
}
