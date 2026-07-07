import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, MapPin, CheckCircle, XCircle, AlertCircle, Ticket, Bus, Wallet, Calendar, X } from 'lucide-react';
import TicketDetailModal from "./DetailsModal.jsx";
import { trajetService }     from "../../../Services/TrajetService.js";
import { itineraryService }  from "../../../Services/ItineraireService.js";
import { userService }       from "../../../Services/UserService.js";
import {ticketService} from "../../../Services/TicketsService.js";

// ── Charte TRIPIZ (cohérente avec StatisticsPage.jsx) ───────────────────────
const BRAND = {
    blue:      '#3A68C4',
    lightBlue: '#498BD2',
    dark:      '#2C2C2C',
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.lightBlue} 100%)`;

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

// Convertit une date (Date | string) en clé "YYYY-MM-DD" locale, pour comparer avec un <input type="date">
const toDateKey = (d) => {
    if (!d) return null;
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

// ── Carte de statistique (même style que StatisticsPage.jsx) ────────────────
const StatCard = ({ label, value, Icon, accent, loading }) => (
    <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent.bar }} />
        <div className="flex items-center justify-between">
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 tracking-wide">{label}</p>
                <p className="text-2xl font-bold mt-1 truncate" style={{ color: BRAND.dark }}>
                    {loading ? '…' : value}
                </p>
            </div>
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
                style={{ background: accent.bg }}
            >
                <Icon className="w-5 h-5" style={{ color: accent.icon }} />
            </div>
        </div>
    </div>
);

const TicketsPage = () => {
    const [tickets, setTickets]           = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [searchTerm, setSearchTerm]     = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');

    // Filtre par plage de dates (sur la date d'achat)
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo]     = useState('');

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket]   = useState(null);

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

            const iMap = {};
            if (itinerariesData.status === 'fulfilled' && Array.isArray(itinerariesData.value)) {
                itinerariesData.value.forEach(i => {
                    const id = i.itinerary_id ?? i.itinaryId ?? i.id;
                    const label = `${i.itinerary_name || i.itinary_name || '?'} (${i.route_name || ''})`;
                    if (id !== undefined) iMap[String(id)] = label;
                });
            }

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

    const resetDateFilter = () => { setDateFrom(''); setDateTo(''); };

    // Stats calculées à partir des données réelles
    const statsCards = [
        { label: 'Total Tickets',    value: tickets.length,
            Icon: Ticket, accent: { bar: GRADIENT, bg: `${BRAND.blue}14`, icon: BRAND.blue } },
        { label: 'Tickets Valides',  value: tickets.filter(t => (t.status || '').toUpperCase() === 'VALIDE').length,
            Icon: CheckCircle, accent: { bar: 'linear-gradient(135deg, #16A34A, #4ADE80)', bg: '#16A34A14', icon: '#16A34A' } },
        { label: 'Tickets Utilisés', value: tickets.filter(t => (t.status || '').toUpperCase() === 'UTILISE').length,
            Icon: Bus, accent: { bar: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', bg: '#8B5CF614', icon: '#8B5CF6' } },
        { label: 'Revenus',          value: `${tickets.reduce((s, t) => s + (Number(t.price) || 0), 0)} FCFA`,
            Icon: Wallet, accent: { bar: 'linear-gradient(135deg, #F59E0B, #FBBF24)', bg: '#F59E0B14', icon: '#F59E0B' } },
    ];

    const filtered = tickets.filter(t => {
        const status = (t.status || '').toUpperCase();
        const userLabel = resolveUser(t.userId).toLowerCase();
        const tripLabel = resolveTrip(t.tripId).toLowerCase();
        const q = searchTerm.toLowerCase();
        const matchSearch = !q || userLabel.includes(q) || tripLabel.includes(q) || String(t.ticketId).toLowerCase().includes(q);
        const matchStatus = statusFilter === 'Tous les statuts' || status === statusFilter;

        // Filtre par date d'achat (bornes incluses, comparaison sur la date locale seule)
        const purchaseKey = toDateKey(t.purchaseDate);
        const matchDateFrom = !dateFrom || (purchaseKey && purchaseKey >= dateFrom);
        const matchDateTo = !dateTo || (purchaseKey && purchaseKey <= dateTo);

        return matchSearch && matchStatus && matchDateFrom && matchDateTo;
    });

    const hasDateFilter = Boolean(dateFrom || dateTo);

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">

                {/* En-tête */}
                <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRADIENT }}>
                            <Ticket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold" style={{ color: BRAND.dark }}>Gestion des Tickets</h1>
                            <p className="text-gray-500 mt-0.5 text-sm">Gérez tous les tickets achetés par les utilisateurs</p>
                        </div>
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {statsCards.map((stat, i) => (
                        <StatCard key={i} {...stat} loading={loading} />
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

                        {/* Filtre par plage de dates (date d'achat) */}
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                            <input
                                type="date"
                                value={dateFrom}
                                max={dateTo || undefined}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Date de début"
                            />
                            <span className="text-gray-400 text-sm">→</span>
                            <input
                                type="date"
                                value={dateTo}
                                min={dateFrom || undefined}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Date de fin"
                            />
                            {hasDateFilter && (
                                <button
                                    onClick={resetDateFilter}
                                    title="Réinitialiser les dates"
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            )}
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
                                                    <MapPin size={10} style={{ color: BRAND.blue }} className="flex-shrink-0" />
                                                    {resolveTrip(ticket.tripId)}
                                                </p>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className="text-sm font-bold" style={{ color: BRAND.blue }}>{ticket.price}</span>
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
                            <Ticket size={36} className="mx-auto mb-3 opacity-30" />
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