import { useLocation, useNavigate } from "react-router-dom";
import {
    Bus, Users, BarChart3, LogOut, Home, Route,
    CreditCard, User, Map, ChevronLeft, ChevronRight
} from 'lucide-react';
import {connectionService} from "../../Services/Connexion.js";

export const TripizSidebar = ({ isCollapsed, onToggleCollapse, isMobile, onMobileClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (id) => {
        navigate(`/${id}`);
        if (isMobile) onMobileClose?.();
    };

    // ── Fonction de déconnexion ──
    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            connectionService.logout(); // Supprime les tokens du localStorage
            navigate("/"); // Redirige vers la page d'accueil / connexion
            if (isMobile) onMobileClose?.();
        }
    };

    const currentPath = location.pathname.slice(1) || 'dashboard';

    const menuItems = [
        //{ id: 'dashboard', icon: Home,       label: 'Tableau de bord' },
        { id: 'users',     icon: Users,      label: 'Utilisateurs' },
        { id: 'buses',     icon: Bus,        label: 'Bus' },
        { id: 'routes',    icon: Route,      label: 'Itinéraires' },
        { id: 'trips',     icon: Map,        label: 'Trajets' },
        { id: 'tickets',   icon: CreditCard, label: 'Billets' },
        // { id: 'stats',     icon: BarChart3,  label: 'Statistiques' },
    ];

    const collapsed = isCollapsed && !isMobile;

    const sidebarClasses = isMobile
        ? `fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`
        : `relative transition-all duration-300 ease-in-out flex-shrink-0 ${collapsed ? 'w-[72px]' : 'w-56 xl:w-64'}`;

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && !isCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-20"
                    onClick={onMobileClose}
                />
            )}

            <div className={`${sidebarClasses} h-full bg-white border-r border-gray-100 flex flex-col select-none`}>

                {/* ── Header ── */}
                <div className={`relative flex items-center border-b border-gray-100 flex-shrink-0 h-14 xl:h-16 ${collapsed ? 'justify-center' : 'justify-between px-4'}`}>
                    {!collapsed && (
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Bus className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 leading-tight">TRIPIZ</p>
                                <p className="text-[11px] text-gray-400 leading-tight">Admin Panel</p>
                            </div>
                        </div>
                    )}

                    {collapsed && (
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Bus className="w-5 h-5 text-white" />
                        </div>
                    )}

                    {!isMobile && (
                        <button
                            onClick={onToggleCollapse}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10
                                w-6 h-6 rounded-full border border-gray-200 bg-white shadow-sm
                                flex items-center justify-center
                                text-blue-600 hover:bg-blue-50 hover:border-blue-300
                                transition-all duration-200"
                            title={collapsed ? 'Déplier' : 'Réduire'}
                        >
                            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                        </button>
                    )}
                </div>

                {/* ── Navigation ── */}
                <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`}>
                    {menuItems.map((item) => {
                        const isActive = currentPath === item.id;
                        const Icon = item.icon;

                        return (
                            <div key={item.id} className="relative group">
                                <button
                                    onClick={() => handleClick(item.id)}
                                    className={`
                                        w-full flex items-center rounded-lg transition-all duration-150
                                        ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5'}
                                        ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }
                                    `}
                                >
                                    <Icon className={`
                                        flex-shrink-0 transition-colors
                                        ${collapsed ? 'w-5 h-5 xl:w-6 xl:h-6' : 'w-4 h-4 xl:w-[18px] xl:h-[18px]'}
                                        ${isActive ? 'text-blue-600' : ''}
                                    `} />
                                    {!collapsed && (
                                        <span className={`text-xs xl:text-sm font-medium truncate ${isActive ? 'text-blue-700' : ''}`}>
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && !collapsed && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                    )}
                                </button>

                                {isActive && collapsed && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r-full" />
                                )}

                                {collapsed && (
                                    <div className="
                                        pointer-events-none
                                        absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                                        bg-gray-900 text-white text-xs font-medium
                                        rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-150
                                    ">
                                        {item.label}
                                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* ── Profil & Déconnexion ── */}
                <div className={`border-t border-gray-100 flex-shrink-0 py-3 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>

                    {/* Profil */}
                    {!collapsed ? (
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 mb-1">
                            <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <User className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate leading-tight">Administrateur</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative group flex justify-center mb-1">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center cursor-default">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="
                                pointer-events-none
                                absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                                bg-gray-900 text-white text-xs rounded-lg px-2.5 py-2 whitespace-nowrap shadow-lg
                                opacity-0 group-hover:opacity-100 transition-opacity duration-150
                            ">
                                <p className="font-medium">Administrateur</p>
                                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                            </div>
                        </div>
                    )}

                    {/* Déconnexion */}
                    <div className="relative group">
                        <button
                            onClick={handleLogout} // ← Branchement de la fonction au clic
                            className={`
                                w-full flex items-center rounded-lg transition-all duration-150
                                text-gray-400 hover:bg-red-50 hover:text-red-600
                                ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5'}
                            `}
                        >
                            <LogOut className={`flex-shrink-0 ${collapsed ? 'w-5 h-5 xl:w-6 xl:h-6' : 'w-4 h-4 xl:w-[18px] xl:h-[18px]'}`} />
                            {!collapsed && (
                                <span className="text-xs xl:text-sm font-medium">Déconnexion</span>
                            )}
                        </button>

                        {collapsed && (
                            <div className="
                                pointer-events-none
                                absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                                bg-gray-900 text-white text-xs font-medium
                                rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg
                                opacity-0 group-hover:opacity-100 transition-opacity duration-150
                            ">
                                Déconnexion
                                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TripizSidebar;