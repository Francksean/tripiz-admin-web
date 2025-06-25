import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Clock, Users, Filter, Eye, QrCode, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import TicketDetailModal from "./DetailsModal.jsx";
import EditTicketModal from "./EditModal.jsx";

const initialTickets = [
    {
        ticket_id: 1,
        ticket_number: 'TKT_20241215_001',
        user_id: 1,
        user_name: 'Jean Dupont',
        route_id: 1,
        route_name: 'Douala Central - Bonabéri',
        departure_station: 'Gare Centrale',
        arrival_station: 'Marché Bonabéri',
        price_paid: 150.00,
        purchase_date: '2024-12-15 14:30:25',
        usage_date: null,
        expiration_date: '2024-12-16 14:30:25',
        ticket_status: 'VALIDE',
        qr_code: 'eyJ0aWNrZXRfaWQiOjEsInVzZXJfaWQiOjF9'
    },
    {
        ticket_id: 2,
        ticket_number: 'TRIPIZ_123456789',
        user_id: 2,
        user_name: 'Marie Nkomo',
        route_id: 2,
        route_name: 'Akwa - Makepe',
        departure_station: 'Rond-point Akwa',
        arrival_station: 'Carrefour Makepe',
        price_paid: 125.00,
        purchase_date: '2024-12-15 08:15:10',
        usage_date: '2024-12-15 09:00:00',
        expiration_date: '2024-12-16 08:15:10',
        ticket_status: 'UTILISE',
        qr_code: 'eyJ0aWNrZXRfaWQiOjIsInVzZXJfaWQiOjJ9'
    },
    {
        ticket_id: 3,
        ticket_number: 'TKT_20241214_045',
        user_id: 3,
        user_name: 'Paul Mbarga',
        route_id: 3,
        route_name: 'Bassa - Ndokoti',
        departure_station: 'Marché Bassa',
        arrival_station: 'Station Ndokoti',
        price_paid: 175.00,
        purchase_date: '2024-12-14 16:20:30',
        usage_date: null,
        expiration_date: '2024-12-14 23:59:59',
        ticket_status: 'EXPIRE',
        qr_code: 'eyJ0aWNrZXRfaWQiOjMsInVzZXJfaWQiOjN9'
    },
    {
        ticket_id: 4,
        ticket_number: 'TKT_20241215_032',
        user_id: 4,
        user_name: 'Sophie Ewodo',
        route_id: 4,
        route_name: 'Bonanjo - Kotto',
        departure_station: 'Place du Gouvernement',
        arrival_station: 'Marché Kotto',
        price_paid: 140.00,
        purchase_date: '2024-12-15 11:45:15',
        usage_date: null,
        expiration_date: '2024-12-16 11:45:15',
        ticket_status: 'ANNULE',
        qr_code: 'eyJ0aWNrZXRfaWQiOjQsInVzZXJfaWQiOjR9'
    },
    {
        ticket_id: 5,
        ticket_number: 'TKT_20241215_055',
        user_id: 1,
        user_name: 'Jean Dupont',
        route_id: 1,
        route_name: 'Douala Central - Bonabéri',
        departure_station: 'Gare Centrale',
        arrival_station: 'Marché Bonabéri',
        price_paid: 150.00,
        purchase_date: '2024-12-15 17:20:45',
        usage_date: null,
        expiration_date: '2024-12-16 17:20:45',
        ticket_status: 'VALIDE',
        qr_code: 'eyJ0aWNrZXRfaWQiOjUsInVzZXJfaWQiOjF9'
    }
];

const TicketsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTicketForDetail, setSelectedTicketForDetail] = useState(null);
    const [selectedTicketForEdit, setSelectedTicketForEdit] = useState(null);
    const [selectedTicketForQR, setSelectedTicketForQR] = useState(null); // AJOUTÉ
    const [ticketsList, setTicketsList] = useState(initialTickets);

    const showTicketDetails = (ticket) => {
        setSelectedTicketForDetail(ticket);
        setShowDetailModal(true);
    };

    const showEditTicket = (ticket) => {
        setSelectedTicketForEdit(ticket);
        setShowEditModal(true);
    };

    const showQRCode = (ticket) => {
        setSelectedTicketForQR(ticket); // CORRIGÉ
        setShowQRModal(true);
    };

    const handleSaveTicket = (updatedTicket) => {
        setTicketsList(prevTickets =>
            prevTickets.map(ticket =>
                ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket
            )
        );
        // Ici vous pouvez ajouter l'appel API pour sauvegarder en base
        console.log('Ticket mis à jour:', updatedTicket);
    };

    const stats = [
        { label: 'Total Tickets', value: '5', color: 'bg-blue-100 text-blue-600', icon: '🎫' },
        { label: 'Tickets Valides', value: '2', color: 'bg-green-100 text-green-600', icon: '✅' },
        { label: 'Tickets Utilisés', value: '1', color: 'bg-purple-100 text-purple-600', icon: '🚌' },
        { label: 'Revenus Jour', value: '740 FCFA', color: 'bg-orange-100 text-orange-600', icon: '💰' }
    ];

    const filteredTickets = ticketsList.filter(ticket =>
        (ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.route_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'Tous les statuts' || ticket.ticket_status === statusFilter)
    );

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'VALIDE':
                return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium';
            case 'UTILISE':
                return 'bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium';
            case 'EXPIRE':
                return 'bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium';
            case 'ANNULE':
                return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium';
            default:
                return 'bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium';
        }
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'VALIDE':
                return <CheckCircle size={14} className="text-green-500" />;
            case 'UTILISE':
                return <CheckCircle size={14} className="text-purple-500" />;
            case 'EXPIRE':
                return <AlertCircle size={14} className="text-orange-500" />;
            case 'ANNULE':
                return <XCircle size={14} className="text-red-500" />;
            default:
                return <AlertCircle size={14} className="text-gray-500" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
    };

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">
                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Tickets</h1>
                            <p className="text-gray-600 mt-1 text-sm">Gérez tous les tickets achetés par les utilisateurs</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            Nouveau Ticket
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                </div>
                                <div
                                    className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}/>
                            <input
                                type="text"
                                placeholder="Rechercher par numéro, utilisateur ou ligne..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-400"/>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option>Tous les statuts</option>
                                <option>VALIDE</option>
                                <option>UTILISE</option>
                                <option>EXPIRE</option>
                                <option>ANNULE</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des tickets */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Ticket</th>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Utilisateur</th>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Trajet</th>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Prix</th>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Dates</th>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Statut</th>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.ticket_id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-2 px-3">
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm">{ticket.ticket_number}</div>
                                            <div className="text-xs text-gray-500">ID: {ticket.ticket_id}</div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3">
                                        <div>
                                            <div className="font-medium text-gray-800 text-sm">{ticket.user_name}</div>
                                            <div className="text-xs text-gray-500">User ID: {ticket.user_id}</div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-800 text-sm">{ticket.route_name}</div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <MapPin size={12} className="text-green-500"/>
                                                <span className="text-gray-700">{ticket.departure_station}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <MapPin size={12} className="text-red-500"/>
                                                <span className="text-gray-700">{ticket.arrival_station}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3">
                                        <div className="text-blue-600 font-bold text-sm">{ticket.price_paid} FCFA</div>
                                    </td>
                                    <td className="py-2 px-3">
                                        <div className="space-y-1 text-xs">
                                            <div>
                                                <span className="text-gray-500">Achat:</span>
                                                <div className="text-gray-700">{formatDate(ticket.purchase_date)}</div>
                                            </div>
                                            {ticket.usage_date && (
                                                <div>
                                                    <span className="text-gray-500">Utilisé:</span>
                                                    <div className="text-gray-700">{formatDate(ticket.usage_date)}</div>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-gray-500">Expire:</span>
                                                <div className="text-gray-700">{formatDate(ticket.expiration_date)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ticket.ticket_status)}
                                            <span className={getStatusBadge(ticket.ticket_status)}>
                                                {ticket.ticket_status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => showQRCode(ticket)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Voir QR Code">
                                                <QrCode size={14}/>
                                            </button>
                                             <button
                                                onClick={() => showTicketDetails(ticket)}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                title="Voir détails">
                                                <Eye size={14}/>
                                            </button>
                                            <button
                                                onClick={() => showEditTicket(ticket)}
                                                className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                                title="Modifier">
                                                <Edit size={14}/>
                                            </button>
                                            <button
                                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Annuler">
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal QR Code */}
                {showQRModal && selectedTicketForQR && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">QR Code Ticket</h2>
                    <button
                    onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
            >
                ✕
            </button>
                    </div>
                        <div className="text-center space-y-4">
                            <div className="bg-gray-100 p-8 rounded-lg">
                                <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                                    <QrCode size={48} className="text-gray-400"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-semibold text-gray-800">{selectedTicketForQR.ticket_number}</div>
                                <div className="text-sm text-gray-600">{selectedTicketForQR.user_name}</div>
                                <div className="text-sm text-gray-600">{selectedTicketForQR.route_name}</div>
                                <div className="text-lg font-bold text-blue-600">{selectedTicketForQR.price_paid} FCFA</div>
                            </div>
                            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                                {selectedTicketForQR.qr_code}
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                {/* Modal d'ajout */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Nouveau Ticket</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateur</label>
                                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Sélectionner un utilisateur</option>
                                            <option>Jean Dupont</option>
                                            <option>Marie Nkomo</option>
                                            <option>Paul Mbarga</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ligne</label>
                                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Sélectionner une ligne</option>
                                            <option>Douala Central - Bonabéri</option>
                                            <option>Akwa - Makepe</option>
                                            <option>Bassa - Ndokoti</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Station de départ</label>
                                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Sélectionner une station</option>
                                            <option>Gare Centrale</option>
                                            <option>Rond-point Akwa</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Station d'arrivée</label>
                                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Sélectionner une station</option>
                                            <option>Marché Bonabéri</option>
                                            <option>Carrefour Makepe</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</label>
                                    <input type="number"
                                           placeholder="150"
                                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Créer le ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            <TicketDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                ticket={selectedTicketForDetail}
            />

            {/* Modal d'édition */}
            <EditTicketModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                ticket={selectedTicketForEdit}
                onSave={handleSaveTicket}
            />
        </div>
    );
};

export default TicketsPage;