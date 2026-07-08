import { Search } from "lucide-react";

const selectCls = "px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

export const UserFilters = ({ searchTerm, onSearchChange, filterRole, onFilterRoleChange, filterStatus, onFilterStatusChange }) => {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email…"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <select value={filterRole} onChange={(e) => onFilterRoleChange(e.target.value)} className={selectCls}>
                    <option value="all">Tous les rôles</option>
                    <option value="admin">Administrateur</option>
                    <option value="driver">Chauffeur</option>
                    <option value="client">Client</option>
                </select>
                <select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} className={selectCls}>
                    <option value="all">Tous les statuts</option>
                    <option value="ONLINE">En ligne</option>
                    <option value="OFFLINE">Déconnecté</option>
                    <option value="BLOCKED">Bloqué</option>
                </select>
            </div>
        </div>
    );
};