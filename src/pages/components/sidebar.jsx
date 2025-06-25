import {useLocation, useNavigate} from "react-router-dom";
import {
    Bus,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Route,
    CreditCard,
    Bell,
    User,
    MapPin
} from 'lucide-react';

// Sidebar Component
export const TripizSidebar = ({ isCollapsed, onToggleCollapse, isMobile, onMobileClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (id) => {
        navigate(`/${id}`);
    };

    // Extrait le segment de l'URL (ex: "/users" → "users")
    const currentPath = location.pathname.slice(1) || 'dashboard';

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Tableau de bord', labelEn: 'Dashboard' },
        { id: 'users', icon: Users, label: 'Utilisateurs', labelEn: 'Users' },
        { id: 'routes', icon: Route, label: 'Itinéraires', labelEn: 'Routes' },
        { id: 'buses', icon: Bus, label: 'Bus', labelEn: 'Routes' },
        { id: 'tickets', icon: CreditCard, label: 'Billets', labelEn: 'Tickets' },
        { id: 'stats', icon: BarChart3, label: 'Statistiques', labelEn: 'Statistics' },
        { id: 'notifications', icon: Bell, label: 'Notifications', labelEn: 'Notifications' },
        { id: 'settings', icon: Settings, label: 'Paramètres', labelEn: 'Settings' }
    ];


    const sidebarClasses = isMobile
        ? `fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`
        : `transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && !isCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={onMobileClose}
                />
            )}

            <div className={`${sidebarClasses} h-full bg-gray-50 border-r border-gray-200 flex flex-col`}>
                {/* Header */}
                <div className="p-3 xl:p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        {(!isCollapsed || isMobile) && (
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-xl mr-3 border border-blue-200">
                                    <Bus className="w-5 h-5 xl:w-6 xl:h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-base xl:text-lg font-bold text-gray-800">TRIPIZ</h1>
                                    <p className="text-xs text-gray-600">Admin Panel</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-blue-600"
                        >
                            {(isCollapsed && !isMobile) ? <Menu className="w-4 h-4 xl:w-5 xl:h-5" /> : <X className="w-4 h-4 xl:w-5 xl:h-5" />}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 xl:p-4 space-y-1 xl:space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = currentPath === item.id; // Simulate active state

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                className={`w-full flex items-center p-2 xl:p-3 rounded-xl transition-all duration-300 group ${
                                    isActive
                                        ? 'bg-blue-100 text-blue-600 shadow-lg scale-105 border border-blue-200'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-102'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 xl:w-5 xl:h-5 ${(isCollapsed && !isMobile) ? 'mx-auto' : 'mr-3'} group-hover:scale-110 transition-transform duration-300`} />
                                {(!isCollapsed || isMobile) && (
                                    <span className="font-medium text-xs xl:text-sm">{item.label}</span>
                                )}
                                {isActive && (!isCollapsed || isMobile) && (
                                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Profile & Logout - Always visible */}
                <div className="p-3 xl:p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
                    {(!isCollapsed || isMobile) && (
                        <div className="flex items-center p-2 xl:p-3 rounded-xl bg-blue-50">
                            <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mr-3 flex items-center justify-center flex-shrink-0">
                                <User className="w-3 h-3 xl:w-4 xl:h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs xl:text-sm font-medium text-gray-800 truncate">Admin SOCATUR</p>
                                <p className="text-xs text-gray-600 truncate">admin@socatur.cm</p>
                            </div>
                        </div>
                    )}

                    <button className="w-full flex items-center p-2 xl:p-3 rounded-xl transition-all duration-300 hover:bg-red-50 group">
                        <LogOut className={`w-4 h-4 xl:w-5 xl:h-5 ${(isCollapsed && !isMobile) ? 'mx-auto' : 'mr-3'} text-red-500 group-hover:scale-110 transition-transform duration-300`} />
                        {(!isCollapsed || isMobile) && (
                            <span className="font-medium text-xs xl:text-sm text-red-500">Déconnexion</span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default TripizSidebar