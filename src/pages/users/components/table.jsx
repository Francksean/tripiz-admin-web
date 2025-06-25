// User Table Component
import {Edit, Mail, User, Phone, Calendar, UserX, Trash2, UserCheck} from "lucide-react";

export const UserTable = ({ users, onEdit, onDelete, onToggleStatus }) => {
    const getStatusBadge = (status) => {
        if (status === 'active') {
            return (
                <span className="px-2 xl:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Actif
                </span>
            );
        }
        return (
            <span className="px-2 xl:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Bloqué
            </span>
        );
    };

    const getRoleBadge = (role) => {
        const configs = {
            admin: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin' },
            driver: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chauffeur' },
            user: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Client' }
        };
        const config = configs[role] || configs.user;

        return (
            <span className={`px-2 xl:px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

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
                        {/*<th className="px-3 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-gray-700 hidden lg:table-cell">*/}
                        {/*    Date création*/}
                        {/*</th>*/}
                        <th className="px-3 xl:px-6 py-3 xl:py-4 text-center text-xs xl:text-sm font-semibold text-gray-700">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={user.id}
                            className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200"
                        >
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mr-2 xl:mr-3 flex items-center justify-center flex-shrink-0">
                                        <User className="w-3 h-3 xl:w-5 xl:h-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm xl:text-base text-gray-800 truncate">{user.name}</p>
                                        <p className="text-xs xl:text-sm text-gray-600 truncate md:hidden">
                                            {user.email}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            ID: {user.id}
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
                                    <div className="flex items-center text-xs xl:text-sm">
                                        <Phone className="w-3 h-3 xl:w-4 xl:h-4 mr-2 text-blue-600 flex-shrink-0" />
                                        <span className="text-gray-700">{user.phone}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                {getRoleBadge(user.role)}
                            </td>
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                {getStatusBadge(user.status)}
                            </td>
                            {/*<td className="px-3 xl:px-6 py-3 xl:py-4 hidden lg:table-cell">*/}
                            {/*    <div className="flex items-center text-xs xl:text-sm">*/}
                            {/*        <Calendar className="w-3 h-3 xl:w-4 xl:h-4 mr-2 text-blue-600" />*/}
                            {/*        <span className="text-gray-700">*/}
                            {/*            {new Date(user.createdAt).toLocaleDateString('fr-FR')}*/}
                            {/*        </span>*/}
                            {/*    </div>*/}
                            {/*</td>*/}
                            <td className="px-3 xl:px-6 py-3 xl:py-4">
                                <div className="flex items-center justify-center space-x-1">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-1.5 xl:p-2 rounded-lg hover:bg-blue-50 transition-all hover:scale-110 group"
                                        title="Modifier"
                                    >
                                        <Edit className="w-3 h-3 xl:w-4 xl:h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => onToggleStatus(user)}
                                        className={`p-1.5 xl:p-2 rounded-lg transition-all hover:scale-110 group ${
                                            user.status === 'active' ? 'hover:bg-red-50' : 'hover:bg-green-50'
                                        }`}
                                        title={user.status === 'active' ? 'Bloquer' : 'Débloquer'}
                                    >
                                        {user.status === 'active' ? (
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
