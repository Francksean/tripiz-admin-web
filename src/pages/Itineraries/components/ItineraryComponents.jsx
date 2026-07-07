import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Filter, Eye, ArrowRight, Route, Ruler, Bus } from 'lucide-react';
import { itineraryService } from "../../../Services/ItineraireService.js";
import { stationService } from "../../../Services/StationService.js";
import ItineraireAddModal from "./ItineraireAddModal.jsx";
import ItineraireEditModal from "./EditModal.jsx";
import ItineraireDetailsModal from "./DetailsModal.jsx";

// ── Charte TRIPIZ (cohérente avec StatisticsPage.jsx) ───────────────────────
const BRAND = {
    blue:      '#3A68C4',
    lightBlue: '#498BD2',
    dark:      '#2C2C2C',
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.lightBlue} 100%)`;

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

const ItinerairesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [directionFilter, setDirectionFilter] = useState('Toutes les directions');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItineraire, setSelectedItineraire] = useState(null);

    const [itineraires, setItineraires] = useState([]);
    const [stations, setStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, totalDistance: 0 });

    useEffect(() => {
        loadData();
        loadStations();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await itineraryService.getAllItineraries();
            setItineraires(data);
            const total = data.length;
            const totalDistance = parseFloat(
                data.reduce((sum, it) => sum + (parseFloat(it.distance) || 0), 0).toFixed(1)
            );
            setStats({ total, totalDistance });
        } catch (err) {
            console.error('Erreur chargement itinéraires:', err);
            setItineraires([]);
            setStats({ total: 0, totalDistance: 0 });
        } finally {
            setLoading(false);
        }
    };

    const loadStations = async () => {
        setLoadingStations(true);
        try {
            const data = await stationService.getAllStations();
            setStations(data);
        } catch (err) {
            console.error('Erreur chargement stations:', err);
            setStations([]);
        } finally {
            setLoadingStations(false);
        }
    };

    const handleViewDetails = (itineraire) => {
        setSelectedItineraire(itineraire);
        setShowDetailsModal(true);
    };

    const handleEditItineraire = (itineraire) => {
        setSelectedItineraire(itineraire);
        setShowEditModal(true);
    };

    const handleDeleteItineraire = async (itineraireId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet itinéraire ?')) return;
        try {
            await itineraryService.deleteItinerary(itineraireId);
            await loadData();
        } catch (err) {
            alert('Erreur lors de la suppression : ' + err.message);
        }
    };

    const handleSaveItineraire = async (updatedItineraire) => {
        try {
            await itineraryService.updateItinerary(updatedItineraire.itinerary_id, updatedItineraire);
            setShowEditModal(false);
            setSelectedItineraire(null);
            await loadData();
        } catch (err) {
            console.error('Erreur sauvegarde:', err);
            alert('Erreur lors de la sauvegarde : ' + err.message);
        }
    };

    const handleSubmitNewItinerary = async (payload) => {
        await itineraryService.createItinerary(payload);
        await loadData();
    };

    const filteredItineraires = itineraires.filter(it =>
        (it.itinerary_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            it.route_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (directionFilter === 'Toutes les directions' || it.direction === directionFilter)
    );

    const getStationNameById = (id) => {
        if (!id) return 'Station non définie';
        const s = stations.find(s => s.stationId === id);
        return s ? s.stationName : id;
    };

    const getDirectionBadge = (direction) =>
        direction === 'ALLER'
            ? 'bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium'
            : 'bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium';

    const statsCards = [
        { label: 'Total Itinéraires', value: stats.total.toString(),      Icon: Route, accent: { bar: GRADIENT, bg: `${BRAND.blue}14`, icon: BRAND.blue } },
        { label: 'Distance Totale',   value: `${stats.totalDistance} km`, Icon: Ruler, accent: { bar: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', bg: '#8B5CF614', icon: '#8B5CF6' } },
    ];

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">

                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRADIENT }}>
                                <Route className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold" style={{ color: BRAND.dark }}>Gestion des Itinéraires</h1>
                                <p className="text-gray-500 mt-0.5 text-sm">Gérez les itinéraires, lignes et parcours de bus</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center px-4 sm:px-5 py-3 text-sm text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit"
                            style={{ background: GRADIENT }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvel Itinéraire
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                                placeholder="Rechercher un itinéraire ou une ligne..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={directionFilter}
                                onChange={(e) => setDirectionFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option>Toutes les directions</option>
                                <option value="ALLER">Aller</option>
                                <option value="RETOUR">Retour</option>
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
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Itinéraire</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Parcours</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Détails</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        {[32, 28, 24, 20].map((w, j) => (
                                            <td key={j} className="py-3 px-4">
                                                <div className="space-y-2">
                                                    <div className={`h-3 bg-gray-200 rounded animate-pulse w-${w}`} />
                                                    <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                filteredItineraires.map((it) => (
                                    <tr key={it.itinerary_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-gray-800 text-sm">
                                                {it.itinerary_name || it.itenary_name || 'Sans nom'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">{it.route_name || '—'}</div>
                                            <span className={`mt-1 inline-block ${getDirectionBadge(it.direction)}`}>
                                                    {it.direction || 'N/A'}
                                                </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <MapPin size={11} className="text-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700 font-medium truncate max-w-[120px]">
                                                            {getStationNameById(it.departure_station)}
                                                        </span>
                                                </div>
                                                <ArrowRight size={12} className="text-gray-300 ml-1" />
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <MapPin size={11} className="text-red-500 flex-shrink-0" />
                                                    <span className="text-gray-700 font-medium truncate max-w-[120px]">
                                                            {getStationNameById(it.arrival_station)}
                                                        </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-gray-700 space-y-1">
                                            <div><span className="font-medium">Distance :</span> {it.distance || 0} km</div>
                                            <div><span className="font-medium">Durée :</span> {it.estimated_duration || 0} min</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleViewDetails(it)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditItineraire(it)}
                                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItineraire(it.itinerary_id || it.itinary_id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {filteredItineraires.length === 0 && !loading && (
                        <div className="text-center py-10 text-gray-400">
                            <Bus size={36} className="mx-auto mb-3 opacity-30" />
                            {itineraires.length === 0 ? (
                                <>
                                    <p className="text-sm font-medium">Aucun itinéraire configuré</p>
                                    <p className="text-xs mt-1">Commencez par créer votre premier itinéraire</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium">Aucun résultat</p>
                                    <p className="text-xs mt-1">Essayez de modifier vos critères de recherche</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modals ── */}
            <ItineraireAddModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleSubmitNewItinerary}
                stations={stations}
                loadingStations={loadingStations}
            />

            <ItineraireDetailsModal
                itineraire={selectedItineraire}
                isOpen={showDetailsModal}
                stations={stations}
                onClose={() => { setShowDetailsModal(false); setSelectedItineraire(null); }}
            />

            <ItineraireEditModal
                itineraire={selectedItineraire}
                isOpen={showEditModal}
                stations={stations}
                onClose={() => { setShowEditModal(false); setSelectedItineraire(null); }}
                onSave={handleSaveItineraire}
            />
        </div>
    );
};

export default ItinerairesPage;