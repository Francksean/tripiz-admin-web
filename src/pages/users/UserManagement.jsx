import {Filter, Plus, Search, RefreshCw, X, Users} from "lucide-react";
import TripizSidebar from "../components/sidebar.jsx";
import React, {useEffect, useState} from "react";
import {StatsCards} from "./components/stats.jsx";
import {UserTable} from "./components/table.jsx";
import {UserModal} from "./Forms/users.jsx";
import {userService} from "../../Services/UserService.js";

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

    // Charger les données initiales
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Chargement des utilisateurs...');

            // Charger les utilisateurs en parallèle avec les statistiques
            const [usersData, totalUsers, onlineUsers, blockedUsers, thisMonthUsers] = await Promise.allSettled([
                userService.getAllUsers(),
                userService.countTotalUsers(),
                userService.countOnlineUsers(),
                userService.countBlockedUsers(),
                userService.countUsersCreatedThisMonth()
            ]);

            // Traiter les utilisateurs
            const users = usersData.status === 'fulfilled' && Array.isArray(usersData.value) ? usersData.value : [];
            console.log('Données utilisateurs reçues:', users);
            setUsers(users);

            // Traiter les statistiques avec les vraies valeurs des endpoints
            const statsFromEndpoints = {
                total: totalUsers.status === 'fulfilled' && totalUsers.value?.count !== undefined ? totalUsers.value.count : 0,
                online: onlineUsers.status === 'fulfilled' && onlineUsers.value?.count !== undefined ? onlineUsers.value.count : 0,
                blocked: blockedUsers.status === 'fulfilled' && blockedUsers.value?.count !== undefined ? blockedUsers.value.count : 0,
                thisMonth: thisMonthUsers.status === 'fulfilled' && thisMonthUsers.value?.count !== undefined ? thisMonthUsers.value.count : 0
            };

            // Si les endpoints ont échoué, calculer à partir des données locales
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

            // Utiliser les stats des endpoints si disponibles, sinon fallback
            const finalStats = {
                total: statsFromEndpoints.total || fallbackStats.total,
                online: statsFromEndpoints.online || fallbackStats.online,
                blocked: statsFromEndpoints.blocked || fallbackStats.blocked,
                thisMonth: statsFromEndpoints.thisMonth || fallbackStats.thisMonth
            };

            console.log('Statistiques finales:', finalStats);
            setStats(finalStats);

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

    // Initialise l'état à partir du localStorage
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const stored = localStorage.getItem("sidebar-collapsed");
        return stored ? JSON.parse(stored) : false;
    });

    // Met à jour le localStorage quand sidebarCollapsed change
    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const handleToggleCollapse = () => {
        setSidebarCollapsed(prev => !prev);
    };

    // Filtrer les utilisateurs
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                // Recharger les stats après suppression
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
            // Appeler votre endpoint pour changer le statut
            // await userService.updateUserStatus(user.user_id, newStatus);

            // Mettre à jour localement
            setUsers(users.map(u =>
                u.user_id === user.user_id ? { ...u, status: newStatus } : u
            ));

            // Recharger les stats
            loadData();
        } catch (error) {
            console.error('Erreur changement de statut:', error);
            alert('Erreur lors du changement de statut');
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            const response = await userService.signupAsDriver(userData);
            // Ajouter le nouvel utilisateur à la liste
            if (response && response.data) {
                setUsers([...users, response.data]);
            }
            // Recharger les données pour mettre à jour les stats
            await loadData();
            setModalOpen(false);
        } catch (error) {
            console.error('Erreur sauvegarde chauffeur:', error);
            alert('Erreur lors de la création du chauffeur');
        }
    };

    // Contenu principal basé sur l'état
    const renderMainContent = () => {
        if (loading) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Chargement des utilisateurs...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-red-500 mb-4">
                            <X className="w-12 h-12 mx-auto" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de connexion</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={loadData}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            );
        }

        // Contenu normal avec les données chargées
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 lg:mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                                    Gestion des Utilisateurs
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm">
                                    Gérez les utilisateurs de votre plateforme
                                </p>
                            </div>
                            <button
                                onClick={handleCreateUser}
                                className="flex items-center px-3 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Nouveau Chauffeur
                            </button>
                        </div>

                        {/* Search and Filter Bar - Masquer si pas d'utilisateurs */}
                        {users.length > 0 && (
                            <div className="bg-white rounded-xl xl:rounded-2xl p-4 xl:p-6 mb-4 xl:mb-8 shadow-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom ou email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    >
                                        <option value="all">Tous les rôles</option>
                                        <option value="admin">Administrateur</option>
                                        <option value="Driver">Chauffeur</option>
                                        <option value="client">Client</option>
                                    </select>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    >
                                        <option value="all">Tous les statuts</option>
                                        <option value="online">En ligne</option>
                                        <option value="offline">Deconnecter</option>
                                        <option value="blocked">Bloqué</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <StatsCards users={users} stats={stats}/>

                    {/* Users Table ou Empty State */}
                    {users.length === 0 ? (
                        // État vide - aucun utilisateur dans la base
                        <div className="bg-white rounded-xl xl:rounded-2xl border border-gray-200 shadow-lg p-12 text-center">
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
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Créer le premier chauffeur
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        // Aucun résultat de recherche
                        <div className="bg-white rounded-xl xl:rounded-2xl border border-gray-200 shadow-lg p-12 text-center">
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
                    ) : (
                        // Tableau avec des utilisateurs
                        <UserTable
                            users={filteredUsers}
                            onDelete={handleDeleteUser}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
            {/* Sidebar - Toujours visible */}
            <div className="flex-shrink-0">
                <TripizSidebar
                    activeItem={activeItem}
                    onItemClick={setActiveItem}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />
            </div>

            {/* Main Content - Variable selon l'état */}
            <div className="flex-1 flex flex-col min-w-0">
                {renderMainContent()}
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