import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import TicketDetailModal from "./DetailsModal.jsx";
import { trajetService }     from "../../../Services/TrajetService.js";
import { itineraryService }  from "../../../Services/ItineraireService.js";
import { userService }       from "../../../Services/UserService.js";
import {ticketService} from "../../../Services/TicketsService.js";

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

const TicketsPage = () => {
    const [tickets, setTickets]           = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [searchTerm, setSearchTerm]     = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket]   = useState(null);

    // Maps de résolution : userId → nom, tripId → libellé du trajet
    const [userMap, setUserMap] = useState({});
    const [tripMap, setTripMap] = useState({});

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [ticketsData, usersData, tripsData, itinerariesData] = await Promise.allSettled([
                ticketService.getAllTickets(),
                userService.getAllUsers ? userService.getAllUsers() : Promise.resolve([]),
                trajetService.getAllTrips(),
                itineraryService.getAllItineraries(),
            ]);

            // Map itinéraires (pour résoudre le nom de la ligne depuis un trip)
            const iMap = {};
            if (itinerariesData.status === 'fulfilled' && Array.isArray(itinerariesData.value)) {
                itinerariesData.value.forEach(i => {
                    const id = i.itinerary_id ?? i.itinaryId ?? i.id;
                    const label = `${i.itinerary_name || i.itinary_name || '?'} (${i.route_name || ''})`;
                    if (id !== undefined) iMap[String(id)] = label;
                });
            }

            // Map trips → libellé lisible (itinéraire + date/heure)
            const tMap = {};
            if (tripsData.status === 'fulfilled' && Array.isArray(tripsData.value)) {
                tripsData.value.forEach(t => {
                    const id = t.trip_id ?? t.tripId ?? t.id;
                    const itiId = t.itinerary_id ?? t.itineraryId;
                    const itiLabel = iMap[String(itiId)] || 'Itinéraire inconnu';
                    if (id !== undefined) tMap[String(id)] = itiLabel;
                });
            } else if (tripsData.status === 'rejected') {
                console.error('trajetService.getAllTrips() a échoué:', tripsData.reason);
            }
            setTripMap(tMap);

            // Map utilisateurs → nom
            const uMap = {};
            if (usersData.status === 'fulfilled' && Array.isArray(usersData.value)) {
                usersData.value.forEach(u => {
                    const id = u.userId ?? u.user_id ?? u.id;
                    const label = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || String(id);
                    if (id !== undefined) uMap[String(id)] = label;
                });
            } else if (usersData.status === 'rejected') {
                console.warn('userService.getAllUsers() a échoué ou n\'existe pas:', usersData.reason);
            }
            setUserMap(uMap);

            if (ticketsData.status === 'fulfilled') {
                setTickets(ticketsData.value);
                if (ticketsData.value.length > 0) {
                    console.log('Exemple ticket brut:', ticketsData.value[0]);
                }
            } else {
                setError('Impossible de charger les tickets.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    };

    const resolveUser = (id) => userMap[id] || (id ? `#${String(id).slice(0, 8)}` : '—');
    const resolveTrip = (id) => tripMap[id] || (id ? `Trajet #${String(id).slice(0, 8)}` : '—');

    const openDetail = (ticket) => { setSelectedTicket(ticket); setShowDetailModal(true); };

    // Stats calculées à partir des données réelles
    const statsCards = [
        { label: 'Total Tickets',    value: tickets.length,                                                       color: 'bg-blue-100 text-blue-600',    icon: '🎫' },
        { label: 'Tickets Valides',  value: tickets.filter(t => (t.status || '').toUpperCase() === 'VALIDE').length,   color: 'bg-green-100 text-green-600',  icon: '✅' },
        { label: 'Tickets Utilisés', value: tickets.filter(t => (t.status || '').toUpperCase() === 'UTILISE').length,  color: 'bg-purple-100 text-purple-600', icon: '🚌' },
        { label: 'Revenus',          value: `${tickets.reduce((s, t) => s + (Number(t.price) || 0), 0)} FCFA`,     color: 'bg-orange-100 text-orange-600', icon: '💰' },
    ];

    const filtered = tickets.filter(t => {
        const status = (t.status || '').toUpperCase();
        const userLabel = resolveUser(t.userId).toLowerCase();
        const tripLabel = resolveTrip(t.tripId).toLowerCase();
        const q = searchTerm.toLowerCase();
        const matchSearch = !q || userLabel.includes(q) || tripLabel.includes(q) || String(t.ticketId).toLowerCase().includes(q);
        const matchStatus = statusFilter === 'Tous les statuts' || status === statusFilter;
        return matchSearch && matchStatus;
    });

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

                {/* Erreur */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
                        <span>{error}</span>
                        <button onClick={loadAll} className="underline font-medium">Réessayer</button>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {statsCards.map((s, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                                    <p className="text-xl font-bold text-gray-800 mt-1">
                                        {loading ? <span className="inline-block w-8 h-5 bg-gray-200 rounded animate-pulse" /> : s.value}
                                    </p>
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
                                placeholder="Rechercher par utilisateur, trajet ou ID…"
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
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        {[120, 100, 140, 60, 100, 80, 40].map((w, j) => (
                                            <td key={j} className="py-2.5 px-3">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: w }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                filtered.map((ticket) => {
                                    const status = (ticket.status || '').toUpperCase();
                                    return (
                                        <tr key={ticket.ticketId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-2.5 px-3">
                                                <p className="text-xs font-semibold text-gray-800">#{String(ticket.ticketId).slice(0, 8)}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{ticket.paymentMethod}</p>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <p className="text-xs font-medium text-gray-800">{resolveUser(ticket.userId)}</p>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <p className="text-xs font-medium text-gray-800 flex items-center gap-1">
                                                    <MapPin size={10} className="text-blue-500 flex-shrink-0" />
                                                    {resolveTrip(ticket.tripId)}
                                                </p>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className="text-sm font-bold text-blue-600">{ticket.price}</span>
                                                <span className="text-xs text-gray-400 ml-1">FCFA</span>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <div className="space-y-1 text-xs">
                                                    <div>
                                                        <span className="text-gray-400">Achat: </span>
                                                        <span className="text-gray-700">{formatDate(ticket.purchaseDate)}</span>
                                                    </div>
                                                    {ticket.useDate && (
                                                        <div>
                                                            <span className="text-gray-400">Utilisé: </span>
                                                            <span className="text-gray-700">{formatDate(ticket.useDate)}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="text-gray-400">Expire: </span>
                                                        <span className="text-gray-700">{formatDate(ticket.expirationDate)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-600'}`}>
                                                        <StatusIcon status={status} />
                                                        {STATUS_LABEL[status] || ticket.status}
                                                    </span>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => openDetail(ticket)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Détails">
                                                        <Eye size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && filtered.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <div className="text-3xl mb-2">🎫</div>
                            <p className="text-sm font-medium">Aucun ticket trouvé</p>
                            <p className="text-xs mt-1">Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}
                </div>
            </div>

            <TicketDetailModal
                isOpen={showDetailModal}
                onClose={() => { setShowDetailModal(false); setSelectedTicket(null); }}
                ticket={selectedTicket}
                resolveUser={resolveUser}
                resolveTrip={resolveTrip}
            />
        </div>
    );
};

export default TicketsPage;