import {Plus, Search, Users} from "lucide-react";
import TripizSidebar from "../components/sidebar.jsx";
import React, {useEffect, useState} from "react";
import {StatsCards} from "./components/stats.jsx";
import {UserTable, UserTableSkeleton} from "./components/table.jsx";
import {UserFilters} from "./components/filters.jsx";
import {UserModal} from "./Forms/users.jsx";
import {userService} from "../../Services/UserService.js";

const BRAND = {
    blue:      '#3A68C4',
    lightBlue: '#498BD2',
    dark:      '#2C2C2C',
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.lightBlue} 100%)`;

const TripizUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, online: 0, blocked: 0, thisMonth: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeItem, setActiveItem] = useState('users');

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const stored = localStorage.getItem("sidebar-collapsed");
        return stored ? JSON.parse(stored) : false;
    });

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const handleToggleCollapse = () => {
        setSidebarCollapsed(prev => !prev);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [usersData, totalUsers, onlineUsers, blockedUsers, thisMonthUsers] = await Promise.allSettled([
                userService.getAllUsers(),
                userService.countTotalUsers(),
                userService.countOnlineUsers(),
                userService.countBlockedUsers(),
                userService.countUsersCreatedThisMonth()
            ]);

            const users = usersData.status === 'fulfilled' && Array.isArray(usersData.value) ? usersData.value : [];
            setUsers(users);

            const statsFromEndpoints = {
                total: totalUsers.status === 'fulfilled' && totalUsers.value?.count !== undefined ? totalUsers.value.count : 0,
                online: onlineUsers.status === 'fulfilled' && onlineUsers.value?.count !== undefined ? onlineUsers.value.count : 0,
                blocked: blockedUsers.status === 'fulfilled' && blockedUsers.value?.count !== undefined ? blockedUsers.value.count : 0,
                thisMonth: thisMonthUsers.status === 'fulfilled' && thisMonthUsers.value?.count !== undefined ? thisMonthUsers.value.count : 0
            };

            const fallbackStats = {
                total: users.length || 0,
                online: users.filter(u => u.status === 'online').length || 0,
                blocked: users.filter(u => u.status === 'blocked').length || 0,
                thisMonth: users.filter(u => {
                    if (!u.createdAt) return false;
                    const userDate = new Date(u.createdAt);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                }).length || 0
            };

            setStats({
                total: statsFromEndpoints.total || fallbackStats.total,
                online: statsFromEndpoints.online || fallbackStats.online,
                blocked: statsFromEndpoints.blocked || fallbackStats.blocked,
                thisMonth: statsFromEndpoints.thisMonth || fallbackStats.thisMonth
            });

        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
            if (err.message.includes('Not Found') || err.message.includes('404')) {
                setUsers([]);
                setStats({ total: 0, online: 0, blocked: 0, thisMonth: 0 });
            } else {
                setError("Impossible de charger les données depuis le serveur.");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleCreateUser = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Supprimer ${user.first_name || user.name} ?`)) {
            try {
                await userService.deleteUser(user.user_id);
                setUsers(users.filter(u => u.user_id !== user.user_id));
                loadData();
            } catch (error) {
                console.error('Erreur suppression:', error);
                alert('Erreur lors de la suppression de l\'utilisateur');
            }
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            const newStatus = user.status === 'online' ? 'blocked' : 'online';
            setUsers(users.map(u =>
                u.user_id === user.user_id ? { ...u, status: newStatus } : u
            ));
            loadData();
        } catch (error) {
            console.error('Erreur changement de statut:', error);
            alert('Erreur lors du changement de statut');
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            const payload = {
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone
            };

            const newDriver = await userService.signupAsDriver(payload);

            await loadData();

            if (newDriver) {
                setUsers(prevUsers => {
                    const exists = prevUsers.some(u => u.email === newDriver.email);
                    return exists ? prevUsers : [...prevUsers, newDriver];
                });
            }

            setModalOpen(false);
        } catch (error) {
            console.error('Erreur sauvegarde chauffeur:', error);
            alert(`Erreur lors de la création du chauffeur : ${error.message}`);
        }
    };

    return (
        <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">

            {/* Sidebar - toujours visible */}
            <div className="flex-shrink-0">
                <TripizSidebar
                    activeItem={activeItem}
                    onItemClick={setActiveItem}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />
            </div>

            {/* Main Content - toujours affiché */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8">

                    {/* Header */}
                    <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRADIENT }}>
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold" style={{ color: BRAND.dark }}>Gestion des Utilisateurs</h1>
                                <p className="text-gray-500 mt-0.5 text-sm">Gérez les utilisateurs de votre plateforme</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateUser}
                            disabled={loading}
                            className="flex items-center px-4 sm:px-5 py-3 text-sm text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl
                                w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: GRADIENT }}
                        >
                            <Plus className="w-4 h-4 mr-2"/> Nouveau Chauffeur
                        </button>
                    </div>

                    {/* Erreur */}
                    {error && (
                        <div
                            className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center justify-between">
                            <span>{error}</span>
                            <button
                                onClick={loadData}
                                className="ml-4 text-sm font-medium underline hover:text-red-900"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}

                    {/* Stats Cards - toujours affichées */}
                    <StatsCards stats={stats} loading={loading}/>

                    {/* Filtres — composant séparé, toujours affiché (statique), indépendant du loading de la table,
                        exactement comme sur TicketsPage / BusStationsPage. */}
                    <UserFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterRole={filterRole}
                        onFilterRoleChange={setFilterRole}
                        filterStatus={filterStatus}
                        onFilterStatusChange={setFilterStatus}
                    />

                    {/* Tableau / états alternatifs */}
                    <div
                        className="bg-white rounded-xl xl:rounded-2xl border border-gray-200 overflow-hidden shadow-lg">

                        {/* Squelette de tableau pendant le chargement — mêmes colonnes que UserTable */}
                        {loading && <UserTableSkeleton/>}

                        {/* Aucun utilisateur */}
                        {!loading && users.length === 0 && !error && (
                            <div className="p-12 text-center">
                                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400"/>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                    Aucun utilisateur
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Votre plateforme ne contient encore aucun utilisateur.
                                    Commencez par créer votre premier chauffeur.
                                </p>
                                <button
                                    onClick={handleCreateUser}
                                    className="inline-flex items-center px-6 py-3 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                                    style={{ background: GRADIENT }}
                                >
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Créer le premier chauffeur
                                </button>
                            </div>
                        )}

                        {/* Aucun résultat de recherche */}
                        {!loading && filteredUsers.length === 0 && users.length > 0 && (
                            <div className="p-12 text-center">
                                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400"/>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                    Aucun résultat
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Aucun utilisateur ne correspond à vos critères de recherche.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterRole('all');
                                        setFilterStatus('all');
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        )}

                        {/* Tableau des utilisateurs */}
                        {!loading && filteredUsers.length > 0 && (
                            <UserTable
                                users={filteredUsers}
                                onDelete={handleDeleteUser}
                                onToggleStatus={handleToggleStatus}
                            />
                        )}
                    </div>

                </div>
            </div>

            {/* Modal */}
            <UserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                user={selectedUser}
                onSave={handleSaveUser}
            />
        </div>
    );
};

export default TripizUserManagement;