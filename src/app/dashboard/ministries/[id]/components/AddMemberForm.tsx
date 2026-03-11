'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { addMemberToMinistry } from '../actions'
import {
    Search,
    UserPlus,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Plus,
    User,
    ChevronDown
} from 'lucide-react'

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
        setSelectedMember(null)
        setIsDropdownOpen(true)
    }

    useEffect(() => {
        if (state?.success) {
            setSearchTerm('')
            setSelectedMember(null)
        }
    }, [state])

    return (
        <div className="bg-indigo-50/30 p-8 rounded-[2.5rem] border border-indigo-50/50">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                    <UserPlus size={20} />
                </div>
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Inscripción</h3>
                    <h2 className="text-xl font-black text-slate-900 leading-none">Añadir Persona</h2>
                </div>
            </div>

            <form action={formAction} className="space-y-6">
                <input type="hidden" name="ministry_id" value={ministryId} />
                <input type="hidden" name="member_id" value={selectedMember?.id || ''} />

                <div className="space-y-6">
                    {/* Member Search */}
                    <div ref={dropdownRef} className="relative space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="search_member">
                            <Search size={14} className="text-indigo-500" />
                            Buscar en el Directorio
                        </label>
                        <div className="relative group">
                            <input
                                id="search_member"
                                type="text"
                                placeholder="Escribe un nombre..."
                                className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all caret-indigo-600 shadow-sm"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => setIsDropdownOpen(true)}
                                autoComplete="off"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                                <ChevronDown size={18} />
                            </div>
                        </div>

                        {isDropdownOpen && searchTerm.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-indigo-50 rounded-2xl shadow-2xl shadow-indigo-200/50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                {filteredMembers.length > 0 ? (
                                    <ul className="p-2 space-y-1">
                                        {filteredMembers.map(member => (
                                            <li
                                                key={member.id}
                                                onClick={() => handleSelectMember(member)}
                                                className="px-4 py-3 hover:bg-indigo-50 rounded-xl cursor-pointer text-sm font-bold text-slate-700 transition-colors flex items-center gap-3 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                                                </div>
                                                {member.first_name} {member.last_name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-slate-400 font-medium">No se encontraron resultados</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedMember && (
                            <div className="flex items-center gap-2 px-2 text-emerald-600 animate-in slide-in-from-left-4">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Persona lista para asignar</span>
                            </div>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="role">
                            <ShieldCheck size={14} className="text-indigo-500" />
                            Definir Rol en el Grupo
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                name="role"
                                className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
                                required
                                defaultValue="MEMBER"
                            >
                                <option value="MEMBER">Miembro Regular</option>
                                <option value="LEADER">Líder Principal</option>
                                <option value="COLEADER">Co-líder / Ayudante</option>
                                <option value="SECRETARY">Secretario(a)</option>
                                <option value="TREASURER">Tesorero(a)</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {state?.error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        <AlertCircle size={16} />
                        {state.error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending || !selectedMember}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-200 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] group"
                >
                    {isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Confirmar Adición</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
