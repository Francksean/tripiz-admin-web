import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Plus, MapPin, QrCode, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import TicketDetailModal  from "./DetailsModal.jsx";
import EditTicketModal    from "./EditModal.jsx";
import { QRCodeModal }    from "./QRCodeModal.jsx";
import { AddTicketModal } from "./AddModal.jsx";

// ── Données & helpers hors composant ─────────────────────────────────────────
const INITIAL_TICKETS = [
    { ticket_id: 1, ticket_number: 'TKT_20241215_001', user_id: 1, user_name: 'Jean Dupont',  route_id: 1, route_name: 'Douala Central - Bonabéri', departure_station: 'Gare Centrale',          arrival_station: 'Marché Bonabéri',   price_paid: 150, purchase_date: '2024-12-15 14:30:25', usage_date: null,                  expiration_date: '2024-12-16 14:30:25', ticket_status: 'VALIDE',  qr_code: 'eyJ0aWNrZXRfaWQiOjEsInVzZXJfaWQiOjF9' },
    { ticket_id: 2, ticket_number: 'TRIPIZ_123456789', user_id: 2, user_name: 'Marie Nkomo',  route_id: 2, route_name: 'Akwa - Makepe',             departure_station: 'Rond-point Akwa',        arrival_station: 'Carrefour Makepe',  price_paid: 125, purchase_date: '2024-12-15 08:15:10', usage_date: '2024-12-15 09:00:00', expiration_date: '2024-12-16 08:15:10', ticket_status: 'UTILISE', qr_code: 'eyJ0aWNrZXRfaWQiOjIsInVzZXJfaWQiOjJ9' },
    { ticket_id: 3, ticket_number: 'TKT_20241214_045', user_id: 3, user_name: 'Paul Mbarga',  route_id: 3, route_name: 'Bassa - Ndokoti',           departure_station: 'Marché Bassa',           arrival_station: 'Station Ndokoti',   price_paid: 175, purchase_date: '2024-12-14 16:20:30', usage_date: null,                  expiration_date: '2024-12-14 23:59:59', ticket_status: 'EXPIRE',  qr_code: 'eyJ0aWNrZXRfaWQiOjMsInVzZXJfaWQiOjN9' },
    { ticket_id: 4, ticket_number: 'TKT_20241215_032', user_id: 4, user_name: 'Sophie Ewodo', route_id: 4, route_name: 'Bonanjo - Kotto',           departure_station: 'Place du Gouvernement',  arrival_station: 'Marché Kotto',      price_paid: 140, purchase_date: '2024-12-15 11:45:15', usage_date: null,                  expiration_date: '2024-12-16 11:45:15', ticket_status: 'ANNULE',  qr_code: 'eyJ0aWNrZXRfaWQiOjQsInVzZXJfaWQiOjR9' },
    { ticket_id: 5, ticket_number: 'TKT_20241215_055', user_id: 1, user_name: 'Jean Dupont',  route_id: 1, route_name: 'Douala Central - Bonabéri', departure_station: 'Gare Centrale',          arrival_station: 'Marché Bonabéri',   price_paid: 150, purchase_date: '2024-12-15 17:20:45', usage_date: null,                  expiration_date: '2024-12-16 17:20:45', ticket_status: 'VALIDE',  qr_code: 'eyJ0aWNrZXRfaWQiOjUsInVzZXJfaWQiOjF9' },
];

const STATUS_STYLE = {
    VALIDE:  'bg-green-50 text-green-700',
    UTILISE: 'bg-purple-50 text-purple-700',
    EXPIRE:  'bg-amber-50 text-amber-700',
    ANNULE:  'bg-red-50 text-red-700',
};
const STATUS_LABEL = { VALIDE: 'Valide', UTILISE: 'Utilisé', EXPIRE: 'Expiré', ANNULE: 'Annulé' };

const StatusIcon = ({ status }) => {
    const p = { size: 13 };
    if (status === 'VALIDE')  return <CheckCircle {...p} className="text-green-500" />;
    if (status === 'UTILISE') return <CheckCircle {...p} className="text-purple-500" />;
    if (status === 'EXPIRE')  return <AlertCircle {...p} className="text-amber-500" />;
    if (status === 'ANNULE')  return <XCircle     {...p} className="text-red-500" />;
    return <AlertCircle {...p} className="text-gray-400" />;
};

const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// ── Page principale ───────────────────────────────────────────────────────────
const TicketsPage = () => {
    const [tickets, setTickets]       = useState(INITIAL_TICKETS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');

    const [showAddModal, setShowAddModal]       = useState(false);
    const [showQRModal, setShowQRModal]         = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal]     = useState(false);

    const [selectedTicket, setSelectedTicket] = useState(null);

    // Handlers
    const openDetail = (t) => { setSelectedTicket(t); setShowDetailModal(true); };
    const openEdit   = (t) => { setSelectedTicket(t); setShowEditModal(true); };
    const openQR     = (t) => { setSelectedTicket(t); setShowQRModal(true); };
    const handleSave = (t) => setTickets(prev => prev.map(x => x.ticket_id === t.ticket_id ? t : x));
    const handleAdd  = (t) => setTickets(prev => [...prev, t]);
    const handleDelete = (id) => { if (window.confirm('Annuler ce ticket ?')) setTickets(prev => prev.filter(t => t.ticket_id !== id)); };

    // Stats dynamiques
    const statsCards = [
        { label: 'Total Tickets',    value: tickets.length,                                            color: 'bg-blue-100 text-blue-600',   icon: '🎫' },
        { label: 'Tickets Valides',  value: tickets.filter(t => t.ticket_status === 'VALIDE').length,  color: 'bg-green-100 text-green-600',  icon: '✅' },
        { label: 'Tickets Utilisés', value: tickets.filter(t => t.ticket_status === 'UTILISE').length, color: 'bg-purple-100 text-purple-600', icon: '🚌' },
        { label: 'Revenus Jour',     value: `${tickets.reduce((s, t) => s + (t.price_paid || 0), 0)} FCFA`, color: 'bg-orange-100 text-orange-600', icon: '💰' },
    ];

    const filtered = tickets.filter(t =>
        (t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.route_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'Tous les statuts' || t.ticket_status === statusFilter)
    );

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">

                {/* En-tête */}
                <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Tickets</h1>
                        <p className="text-gray-500 mt-1 text-sm">Gérez tous les tickets achetés par les utilisateurs</p>
                    </div>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {statsCards.map((s, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                                    <p className="text-xl font-bold text-gray-800 mt-1">{s.value}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher par numéro, utilisateur ou ligne…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option>Tous les statuts</option>
                                <option value="VALIDE">Valide</option>
                                <option value="UTILISE">Utilisé</option>
                                <option value="EXPIRE">Expiré</option>
                                <option value="ANNULE">Annulé</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tableau */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {['Ticket', 'Utilisateur', 'Trajet', 'Prix', 'Dates', 'Statut', 'Actions'].map(h => (
                                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-600">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((ticket) => (
                                <tr key={ticket.ticket_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-3">
                                        <p className="text-xs font-semibold text-gray-800">{ticket.ticket_number}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">ID: {ticket.ticket_id}</p>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <p className="text-xs font-medium text-gray-800">{ticket.user_name}</p>
                                        {/*<p className="text-xs text-gray-400 mt-0.5">User #{ticket.user_id}</p>*/}
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <p className="text-xs font-medium text-gray-800 mb-1">{ticket.route_name}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <MapPin size={10} className="text-green-500 flex-shrink-0" /> {ticket.departure_station}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                            <MapPin size={10} className="text-red-500 flex-shrink-0" /> {ticket.arrival_station}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <span className="text-sm font-bold text-blue-600">{ticket.price_paid}</span>
                                        <span className="text-xs text-gray-400 ml-1">FCFA</span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <div className="space-y-1 text-xs">
                                            <div>
                                                <span className="text-gray-400">Achat: </span>
                                                <span className="text-gray-700">{formatDate(ticket.purchase_date)}</span>
                                            </div>
                                            {ticket.usage_date && (
                                                <div>
                                                    <span className="text-gray-400">Utilisé: </span>
                                                    <span className="text-gray-700">{formatDate(ticket.usage_date)}</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-gray-400">Expire: </span>
                                                <span className="text-gray-700">{formatDate(ticket.expiration_date)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[ticket.ticket_status] || 'bg-gray-100 text-gray-600'}`}>
                                                <StatusIcon status={ticket.ticket_status} />
                                                {STATUS_LABEL[ticket.ticket_status] || ticket.ticket_status}
                                            </span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openDetail(ticket)} className="p-1.5 text-blue-600  hover:bg-blue-50   rounded transition-colors" title="Détails"><Eye     size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <div className="text-3xl mb-2">🎫</div>
                            <p className="text-sm font-medium">Aucun ticket trouvé</p>
                            <p className="text-xs mt-1">Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modaux ── */}
            <AddTicketModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAdd}
            />
            <QRCodeModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                ticket={selectedTicket}
            />
            <TicketDetailModal
                isOpen={showDetailModal}
                onClose={() => { setShowDetailModal(false); setSelectedTicket(null); }}
                ticket={selectedTicket}
            />
            <EditTicketModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedTicket(null); }}
                ticket={selectedTicket}
                onSave={handleSave}
            />
        </div>
    );
};

export default TicketsPage;