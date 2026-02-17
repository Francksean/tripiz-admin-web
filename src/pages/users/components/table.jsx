// User Table Component
import {Edit, Mail, User, Phone, Calendar, UserX, Trash2, UserCheck} from "lucide-react";

export const UserTable = ({ users, onDelete, onToggleStatus }) => {
    const getStatusBadge = (status) => {
        // Par défaut, considérer les utilisateurs comme "online" s'ils n'ont pas de statut défini
        const userStatus = status || 'online';

        if (userStatus === 'online') {
            return (
                <span className="px-2 xl:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    En ligne
                </span>
            );
        }
        if (userStatus === 'offline') {
            return (
                <span className="px-2 xl:px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Hors ligne
                </span>
            );
        }
        if (userStatus === 'blocked') {
            return (
                <span className="px-2 xl:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    Bloqué
                </span>
            );
        }
        // Fallback pour tout autre statut
        return (
            <span className="px-2 xl:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {userStatus}
            </span>
        );
    };

    const getRoleBadge = (role) => {
        const configs = {
            admin: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin' },
            driver: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chauffeur' },
            client: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Client' },
            user: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Utilisateur' }
        };
        const config = configs[role?.toLowerCase()] || configs.user;

        return (
            <span className={`px-2 xl:px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl xl:rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl xl:rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-700">
                            Utilisateur
                        </th>
                        <th className="px-3 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-700 hidden md:table-cell">
                            Contact
                        </th>
                        <th className="px-3 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-700">
                            Rôle
                        </th>
                        <th className="px-3 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-700">
                            Statut
                        </th>
                        <th className="px-3 xl:px-6 py-3 xl:py-4 text-center text-xs xl:text-sm font-semibold text-gray-700">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={user.user_id || index}
                            className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200"
                        >
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mr-2 xl:mr-3 flex items-center justify-center flex-shrink-0">
                                        <User className="w-3 h-3 xl:w-5 xl:h-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm xl:text-base text-gray-800 truncate">
                                            {(user.first_name || user.last_name)
                                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                : (user.name || '—')}
                                        </p>
                                        <p className="text-xs xl:text-sm text-gray-600 truncate md:hidden">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 xl:px-6 py-3 xl:py-4 hidden md:table-cell">
                                <div className="space-y-1">
                                    <div className="flex items-center text-xs xl:text-sm">
                                        <Mail className="w-3 h-3 xl:w-4 xl:h-4 mr-2 text-blue-600 flex-shrink-0" />
                                        <span className="text-gray-700 truncate">{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center text-xs xl:text-sm">
                                            <Phone className="w-3 h-3 xl:w-4 xl:h-4 mr-2 text-blue-600 flex-shrink-0" />
                                            <span className="text-gray-700">{user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                {getRoleBadge(user.role)}
                            </td>
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                {getStatusBadge(user.status)}
                            </td>
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                <div className="flex items-center justify-center space-x-1">
                                    <button
                                        onClick={() => onToggleStatus(user)}
                                        className={`p-1.5 xl:p-2 rounded-lg transition-all hover:scale-110 group ${
                                            (user.status || 'online') === 'online' ? 'hover:bg-red-50' : 'hover:bg-green-50'
                                        }`}
                                        title={(user.status || 'online') === 'online' ? 'Bloquer' : 'Débloquer'}
                                    >
                                        {(user.status || 'online') === 'online' ? (
                                            <UserX className="w-3 h-3 xl:w-4 xl:h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                        ) : (
                                            <UserCheck className="w-3 h-3 xl:w-4 xl:h-4 text-green-500 group-hover:scale-110 transition-transform" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => onDelete(user)}
                                        className="p-1.5 xl:p-2 rounded-lg hover:bg-red-50 transition-all hover:scale-110 group"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-3 h-3 xl:w-4 xl:h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};