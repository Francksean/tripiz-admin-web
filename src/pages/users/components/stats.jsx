// Stats Cards Component
import {Plus, UserCheck, Users, UserX} from "lucide-react";

export const StatsCards = ({ users }) => {
    const stats = [
        {
            title: 'Total Utilisateurs',
            value: users.length,
            icon: Users,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Utilisateurs Actifs',
            value: users.filter(u => u.status === 'active').length,
            icon: UserCheck,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Utilisateurs Bloqués',
            value: users.filter(u => u.status === 'blocked').length,
            icon: UserX,
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            title: 'Nouveaux ce mois',
            value: users.filter(u => {
                const userDate = new Date(u.createdAt);
                const now = new Date();
                return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
            }).length,
            icon: Plus,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-6 mb-4 xl:mb-8">
            {stats.map((stat, index) => (
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
