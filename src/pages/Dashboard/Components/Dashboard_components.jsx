import { Users, CreditCard, BarChart3, Zap, TrendingUp, Clock, Bus, DollarSign, UserPlus, AlertTriangle, Route, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Données statiques hors composant (évite la recréation à chaque render) ────
const STATS = [
    { title: 'Total Utilisateurs', value: '1,247', icon: Users,       gradient: 'from-blue-500 to-blue-600',    change: '+12%', changeType: 'positive', description: 'Nouveaux cette semaine' },
    { title: 'Bus Actifs',         value: '87',    icon: Bus,         gradient: 'from-emerald-500 to-emerald-600', change: '+3%', changeType: 'positive', description: 'Sur 90 bus total'       },
    { title: 'Tickets Vendus',     value: '2,456', icon: CreditCard,  gradient: 'from-purple-500 to-purple-600', change: '+8%',  changeType: 'positive', description: "Aujourd'hui"            },
    { title: 'Revenus du Mois',    value: '1,2M',  icon: DollarSign,  gradient: 'from-amber-500 to-amber-600',  change: '+15%', changeType: 'positive', description: 'FCFA ce mois'           },
];

const ACTIVITIES = [
    { id: 1, action: 'Nouveau utilisateur inscrit', user: 'Marie Kamga', time: '2 min',  type: 'user',    icon: UserPlus      },
    { id: 2, action: 'Bus #23 signalé en panne',    user: 'Système',     time: '5 min',  type: 'alert',   icon: AlertTriangle },
    { id: 3, action: 'Itinéraire modifié',           user: 'Admin',       time: '10 min', type: 'route',   icon: Route         },
    { id: 4, action: '150 tickets vendus',           user: 'Système',     time: '15 min', type: 'ticket',  icon: CreditCard    },
    { id: 5, action: 'Nouvelle station ajoutée',     user: 'Admin',       time: '1h',     type: 'station', icon: MapPin        },
];

const BUSES = [
    { id: 'BUS001', route: 'Bonabéri - Akwa',    status: 'En service', passengers: 45, maxPassengers: 50, driver: 'Jean Mballa'  },
    { id: 'BUS023', route: 'Douala - Logpom',    status: 'En service', passengers: 32, maxPassengers: 50, driver: 'Paul Ndongo'  },
    { id: 'BUS045', route: 'Makepe - Bonanjo',   status: 'Maintenance', passengers: 0, maxPassengers: 50, driver: 'N/A'          },
    { id: 'BUS067', route: 'PK8 - Centre-ville', status: 'En service', passengers: 28, maxPassengers: 50, driver: 'Marie Fotso'  },
];

const ACTIVITY_COLORS = {
    user:    'bg-blue-100 text-blue-600',
    alert:   'bg-red-100 text-red-600',
    route:   'bg-green-100 text-green-600',
    ticket:  'bg-purple-100 text-purple-600',
    station: 'bg-orange-100 text-orange-600',
};

// ── Composant ─────────────────────────────────────────────────────────────────
export const DashboardContent = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                <div className="flex-1">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Tableau de Bord</h1>
                    <p className="text-gray-600 mt-1 text-sm">Bienvenue sur votre plateforme de gestion TRIPIZ</p>
                    <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center text-xs sm:text-sm xl:text-base text-gray-500">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/>
                            Dernière mise à jour: il y a 2 min
                        </div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm xl:text-base text-green-600 font-medium">Système en ligne</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base">
                        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5"/>
                        <span className="font-medium">Ajouter Bus</span>
                    </button>
                    <button
                        onClick={() => navigate('/stats')}
                        className="bg-white border border-gray-200 text-gray-700 px-4 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5"/>
                        <span className="font-medium">Rapports</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-6 mb-4 xl:mb-8">
                {STATS.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 xl:p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-1 min-h-[130px] sm:min-h-[150px] xl:min-h-[170px]"
                        >
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br ${stat.gradient} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-white"/>
                                </div>
                                <div className={`flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-xs font-medium ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    <TrendingUp className="w-3 h-3"/>
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs xl:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">{stat.title}</p>
                                <p className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">{stat.value}</p>
                                <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500">{stat.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Activities Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 2xl:grid-cols-12 gap-3 sm:gap-4 xl:gap-6">
                {/* Sales Chart */}
                <div className="xl:col-span-8 2xl:col-span-8 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 xl:p-5 shadow-md border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 xl:mb-5 space-y-2 sm:space-y-0">
                        <div>
                            <h3 className="text-base sm:text-lg xl:text-xl font-semibold text-gray-900">Ventes de Tickets</h3>
                            <p className="text-gray-600 text-[11px] sm:text-xs xl:text-sm mt-0.5">Évolution des ventes sur la période</p>
                        </div>
                        <select className="border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs xl:text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto">
                            <option>7 derniers jours</option>
                            <option>30 derniers jours</option>
                            <option>3 derniers mois</option>
                        </select>
                    </div>
                    <div className="h-40 sm:h-56 xl:h-72 2xl:h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center border border-gray-100">
                        <div className="text-center text-gray-500">
                            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 xl:p-5 shadow max-w-xs mx-auto">
                                <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 mx-auto mb-2 sm:mb-3 text-blue-500" />
                                <p className="font-medium text-gray-700 mb-1 text-xs sm:text-sm xl:text-base">Graphique des ventes</p>
                                <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500">Données en cours de chargement...</p>
                                <div className="flex justify-center mt-2 sm:mt-3">
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6 border-b-2 border-blue-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="xl:col-span-4 2xl:col-span-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 xl:p-5 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div>
                            <h3 className="text-base sm:text-lg xl:text-xl font-semibold text-gray-900">Activités Récentes</h3>
                            <p className="text-gray-600 text-[11px] sm:text-xs xl:text-sm mt-0.5">Dernières actions système</p>
                        </div>
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2 sm:space-y-3 xl:space-y-4 max-h-52 xl:max-h-64 2xl:max-h-72 overflow-y-auto">
                        {ACTIVITIES.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 ${ACTIVITY_COLORS[activity.type] || 'bg-gray-100 text-gray-600'}`}>
                                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-5 xl:h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm xl:text-base font-medium text-gray-900 mb-0.5 truncate">{activity.action}</p>
                                        <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500 truncate">
                                            Par {activity.user} • il y a {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button className="w-full mt-3 sm:mt-4 text-xs sm:text-sm xl:text-base text-blue-600 hover:text-blue-700 font-medium py-1.5 sm:py-2 px-3 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors duration-200">
                        Voir toutes les activités →
                    </button>
                </div>
            </div>

            {/* Bus Status Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 xl:p-5 shadow-md border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 xl:mb-5 space-y-2 sm:space-y-0">
                    <div>
                        <h3 className="text-base sm:text-lg xl:text-xl font-semibold text-gray-900">Status des Bus en Temps Réel</h3>
                        <p className="text-gray-600 text-xs sm:text-sm xl:text-base mt-0.5">Surveillance en direct de la flotte</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1.5">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                            <span className="text-xs sm:text-sm text-green-600 font-medium">Temps réel</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                            Voir tous →
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4">
                    {BUSES.map((bus) => (
                        <div key={bus.id} className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition bg-gradient-to-br from-white to-gray-50 min-h-[180px] sm:min-h-[200px]">
                            <div className="flex justify-between items-center mb-2.5">
                                <div className="flex items-center space-x-2">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center shadow-sm">
                                        <Bus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-900 text-xs sm:text-base">{bus.id}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${bus.status === 'En service' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                    {bus.status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Itinéraire</p>
                                    <p className="text-sm font-medium text-gray-800 truncate">{bus.route}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Passagers</p>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${(bus.passengers / bus.maxPassengers) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{bus.passengers}/{bus.maxPassengers}</span>
                                    </div>
                                </div>
                                {bus.driver !== 'N/A' && (
                                    <div>
                                        <p className="text-xs text-gray-600 mb-0.5">Chauffeur</p>
                                        <p className="text-xs font-medium text-gray-800 truncate">{bus.driver}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};