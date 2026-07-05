import { Mail, Phone, User, Users, UserX, UserCheck, Trash2 } from "lucide-react";

// ── Helpers hors composant ────────────────────────────────────────────────────
const STATUS_CFG = {
    online:  { cls: 'bg-green-50 text-green-700',  label: 'En ligne'    },
    offline: { cls: 'bg-amber-50 text-amber-700',  label: 'Hors ligne'  },
    blocked: { cls: 'bg-red-50 text-red-700',      label: 'Bloqué'      },
};

const ROLE_CFG = {
    admin:  { cls: 'bg-purple-50 text-purple-700', label: 'Admin'       },
    driver: { cls: 'bg-yellow-50 text-yellow-700', label: 'Chauffeur'   },
    client: { cls: 'bg-blue-50 text-blue-700',     label: 'Client'      },
    user:   { cls: 'bg-gray-100 text-gray-600',    label: 'Utilisateur' },
};

const getUserName = (u) =>
    (u.firstName || u.lastName)
        ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
        : (u.name || '—');

// ── Composant ─────────────────────────────────────────────────────────────────
export const UserTable = ({ users, onDelete, onToggleStatus }) => {
    if (!users.length) return null;

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    {['Utilisateur', 'Contact', 'Rôle', 'Statut', 'Actions'].map((h, i) => (
                        <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 ${i === 1 ? 'hidden md:table-cell' : ''}`}>
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {users.map((user, idx) => {
                    const status  = user.status || 'online';
                    const role    = user.role?.toLowerCase() || 'user';
                    const sCfg    = STATUS_CFG[status]            || { cls: 'bg-gray-100 text-gray-600', label: status };
                    const rCfg    = ROLE_CFG[role]                || ROLE_CFG.user;
                    const isOnline = status === 'online';

                    return (
                        <tr key={user.user_id || idx} className="hover:bg-gray-50 transition-colors">
                            {/* Utilisateur */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{getUserName(user)}</p>
                                        <p className="text-xs text-gray-400 truncate md:hidden">{user.email}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Contact */}
                            <td className="px-4 py-3 hidden md:table-cell">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <Mail className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                        <span className="truncate max-w-[180px]">{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                            <Phone className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </td>

                            {/* Rôle */}
                            <td className="px-4 py-3">
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${rCfg.cls}`}>
                                        {rCfg.label}
                                    </span>
                            </td>

                            {/* Statut */}
                            <td className="px-4 py-3">
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${sCfg.cls}`}>
                                        {sCfg.label}
                                    </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onToggleStatus(user)}
                                        title={isOnline ? 'Bloquer' : 'Débloquer'}
                                        className={`p-1.5 rounded-lg transition-colors ${isOnline ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                    >
                                        {isOnline
                                            ? <UserX    className="w-3.5 h-3.5" />
                                            : <UserCheck className="w-3.5 h-3.5" />
                                        }
                                    </button>
                                    <button
                                        onClick={() => onDelete(user)}
                                        title="Supprimer"
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};