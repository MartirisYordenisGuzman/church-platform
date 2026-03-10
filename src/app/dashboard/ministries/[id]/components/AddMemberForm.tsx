'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { addMemberToMinistry } from '../actions'

const initialState: any = { error: '' }

type Member = { id: string, first_name: string, last_name: string }

export function AddMemberForm({ ministryId }: { ministryId: string }) {
    const [state, formAction, isPending] = useActionState(addMemberToMinistry, initialState)
    const [members, setMembers] = useState<Member[]>([])

    // Autocomplete states
    const [searchTerm, setSearchTerm] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<Member | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Cargar opciones para el select desde un nuevo endpoint /api/directory
    useEffect(() => {
        fetch('/api/directory')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("Error fetching members:", err))
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredMembers = members.filter(member =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectMember = (member: Member) => {
        setSelectedMember(member)
        setSearchTerm(`${member.first_name} ${member.last_name}`)
        setIsDropdownOpen(false)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setSelectedMember(null) // Deseleccionar si el usuario edita el texto
        setIsDropdownOpen(true)
    }

    // Limpiar el select cuando hay exito (hack usando useEffect, lo ideal sería manejar via Server Action Response)
    useEffect(() => {
        if (state?.success) {
            setSearchTerm('')
            setSelectedMember(null)
        }
    }, [state])

    return (
        <form action={formAction} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 flex flex-col gap-4">
            <h3 className="font-semibold text-slate-800">Añadir Persona al Grupo</h3>
            <input type="hidden" name="ministry_id" value={ministryId} />
            <input type="hidden" name="member_id" value={selectedMember?.id || ''} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div ref={dropdownRef} className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="search_member">
                        Buscar Persona
                    </label>
                    <input
                        id="search_member"
                        type="text"
                        placeholder="Escribe un nombre..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsDropdownOpen(true)}
                        required={!selectedMember}
                        autoComplete="off"
                    />

                    {isDropdownOpen && searchTerm.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredMembers.length > 0 ? (
                                <ul className="py-1 line-clamp-none">
                                    {filteredMembers.map(member => (
                                        <li
                                            key={member.id}
                                            onClick={() => handleSelectMember(member)}
                                            className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-800"
                                        >
                                            {member.first_name} {member.last_name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                    No se encontraron personas.
                                </div>
                            )}
                        </div>
                    )}
                    {selectedMember && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Persona seleccionada
                        </p>
                    )}
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
                    disabled={isPending || !selectedMember}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                    {isPending ? 'Añadiendo...' : 'Añadir al Ministerio'}
                </button>
            </div>
        </form>
    )
}
