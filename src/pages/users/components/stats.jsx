// Stats Cards Component
import {Plus, UserCheck, Users, UserX} from "lucide-react";

export const StatsCards = ({ users, stats }) => {
    // Utiliser prioritairement les stats des endpoints, avec fallback sur le calcul local
    const defaultStats = [
        {
            title: 'Total Utilisateurs',
            value: stats?.total || 0, // Utiliser directement la valeur de l'endpoint
            icon: Users,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Utilisateurs En ligne',
            value: stats?.online || 0, // Utiliser directement la valeur de l'endpoint
            icon: UserCheck,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Utilisateurs Bloqués',
            value: stats?.blocked || 0, // Utiliser directement la valeur de l'endpoint
            icon: UserX,
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            title: 'Nouveaux ce mois',
            value: stats?.thisMonth || 0, // Utiliser directement la valeur de l'endpoint
            icon: Plus,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-6 mb-4 xl:mb-8">
            {defaultStats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-3 xl:p-6 rounded-xl xl:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs xl:text-sm font-medium text-gray-600 truncate">
                                {stat.title}
                            </p>
                            <p className="text-lg xl:text-3xl font-bold mt-1 xl:mt-2 text-gray-800">
                                {stat.value}
                            </p>
                        </div>
                        <div className={`p-2 xl:p-3 rounded-lg xl:rounded-xl ${stat.bgColor} flex-shrink-0 ml-2`}>
                            <stat.icon className={`w-4 h-4 xl:w-6 xl:h-6 ${stat.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};