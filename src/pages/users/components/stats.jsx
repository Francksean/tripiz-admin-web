import { Users, UserCheck, UserX, Plus } from "lucide-react";

const STATS_CONFIG = [
    { key: 'total',      title: 'Total Utilisateurs',    Icon: Users,      bg: 'bg-blue-100',   color: 'text-blue-600'   },
    { key: 'online',     title: 'Utilisateurs en ligne', Icon: UserCheck,  bg: 'bg-green-100',  color: 'text-green-600'  },
    { key: 'blocked',    title: 'Utilisateurs bloqués',  Icon: UserX,      bg: 'bg-red-100',    color: 'text-red-600'    },
    { key: 'thisMonth',  title: 'Nouveaux ce mois',      Icon: Plus,       bg: 'bg-amber-100',  color: 'text-amber-600'  },
];

export const StatsCards = ({ stats = {} }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {STATS_CONFIG.map(({ key, title, Icon, bg, color }) => (
            <div key={key} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">{stats[key] ?? 0}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 ml-2`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
            </div>
        ))}
    </div>
);