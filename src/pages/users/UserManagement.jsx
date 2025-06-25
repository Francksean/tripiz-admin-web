import {Filter, Plus, Search} from "lucide-react";
import TripizSidebar from "../components/sidebar.jsx";
import React, {useEffect, useState} from "react";
import {StatsCards} from "./components/stats.jsx";
import {UserTable} from "./components/table.jsx";
import {UserModal} from "./Forms/users.jsx";

const TripizUserManagement = () => {
    const [activeItem, setActiveItem] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedUser, setSelectedUser] = useState(null)

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

    // Sample users data
    const [users, setUsers] = useState([
        {
            id: 'USR001',
            name: 'Jean Dupont',
            email: 'jean.dupont@email.com',
            phone: '+237 677 88 99 00',
            role: 'user',
            status: 'active',
            createdAt: '2024-01-15'
        },
        {
            id: 'USR002',
            name: 'Marie Kamga',
            email: 'marie.kamga@email.com',
            phone: '+237 655 44 33 22',
            role: 'admin',
            status: 'active',
            createdAt: '2024-02-20'
        },
        {
            id: 'USR003',
            name: 'Paul Mbarga',
            email: 'paul.mbarga@email.com',
            phone: '+237 699 11 22 33',
            role: 'driver',
            status: 'blocked',
            createdAt: '2024-03-10'
        },
        {
            id: 'USR004',
            name: 'Sarah Nkomo',
            email: 'sarah.nkomo@email.com',
            phone: '+237 688 55 66 77',
            role: 'user',
            status: 'active',
            createdAt: '2024-05-01'
        }
    ]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleCreateUser = () => {
        setModalMode('create');
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEditUser = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) {
            setUsers(users.filter(u => u.id !== user.id));
        }
    };

    const handleToggleStatus = (user) => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        setUsers(users.map(u =>
            u.id === user.id ? { ...u, status: newStatus } : u
        ));
    };

    const handleSaveUser = (userData) => {
        if (modalMode === 'create') {
            const newUser = {
                ...userData,
                id: `USR${String(users.length + 1).padStart(3, '0')}`,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setUsers([...users, newUser]);
        } else {
            setUsers(users.map(u =>
                u.id === selectedUser.id ? { ...u, ...userData } : u
            ));
        }
    };

    return (
        <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
            {/* Sidebar - Fixed */}
            <div className="flex-shrink-0">
                <TripizSidebar
                    activeItem={activeItem}
                    onItemClick={setActiveItem}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex flex-col min-w-0">
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
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouvel Utilisateur
                                </button>
                            </div>

                            {/* Search and Filter Bar */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-4">
                                <div className="flex flex-col lg:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un itinéraire..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Filter size={18} className="text-gray-400" />
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">Tous les statuts</option>
                                            <option value="active">Actifs</option>
                                            <option value="blocked">Bloqués</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <StatsCards users={users} />

                        {/* Users Table */}
                        <UserTable
                            users={filteredUsers}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                            onToggleStatus={handleToggleStatus}
                        />

                        {/* Empty State */}
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                    Aucun utilisateur trouvé
                                </h3>
                                <p className="text-gray-600">
                                    {searchQuery || filterStatus !== 'all'
                                        ? 'Essayez de modifier vos critères de recherche'
                                        : 'Commencez par créer votre premier utilisateur'}
                                </p>
                            </div>
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
                mode={modalMode}
            />
        </div>
    );
};

export default TripizUserManagement;