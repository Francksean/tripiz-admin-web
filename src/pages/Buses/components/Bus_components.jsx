import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Users, Filter, Eye, Bus, Navigation, AlertTriangle, CheckCircle, MapPinned } from 'lucide-react';
import {ModalAjout} from "./AjoutModal.jsx";
import {ModalDetails} from "./Detail_modal.jsx";
import {stationService} from "../../../Services/StationService.js";
import {busService} from "../../../Services/BusService.js";

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

const BusStationsPage = () => {
    const [activeTab, setActiveTab] = useState('bus');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingItem, setEditingItem] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsItem, setDetailsItem] = useState(null);

    // États pour les données
    const [busData, setBusData] = useState([]);
    const [stationsData, setStationsData] = useState([]);

    // Stats bus : valeurs brutes + définition de l'icône/couleur, séparément
    const [busStats, setBusStats] = useState({ enService: '0', enMaintenance: '0', capaciteTotale: '0' });
    const [stationStats, setStationStats] = useState({ total: '0', actives: '0', enMaintenance: '0' });

    // État de chargement et d'erreur
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour charger les données des bus
    const loadBusData = async () => {
        try {
            setLoading(true);
            const buses = await busService.getAllBuses();
            setBusData(buses);

            const [inServiceCount, inMaintenanceCount, totalCapacity] = await Promise.all([
                busService.countInServiceBuses(),
                busService.countInMaintenanceBuses(),
                busService.getTotalCapacity()
            ]);

            console.log('Statistiques bus récupérées:', { inServiceCount, inMaintenanceCount, totalCapacity });

            setBusStats({
                enService: inServiceCount.count.toString(),
                enMaintenance: inMaintenanceCount.count.toString(),
                capaciteTotale: totalCapacity.capacity.toString(),
            });
        } catch (err) {
            console.error('Erreur lors du chargement des bus:', err);
            setError('Erreur lors du chargement des données des bus');
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour charger les données des stations
    const loadStationsData = async () => {
        try {
            setLoading(true);
            const stations = await stationService.getAllStations();
            setStationsData(stations);

            const [totalCount, inServiceCount, inMaintenanceCount] = await Promise.all([
                stationService.countAllStations(),
                stationService.countInServiceStations(),
                stationService.countInMaintenanceStations()
            ]);

            console.log('Statistiques stations récupérées:', { totalCount, inServiceCount, inMaintenanceCount });

            setStationStats({
                total: totalCount.count.toString(),
                actives: inServiceCount.count.toString(),
                enMaintenance: inMaintenanceCount.count.toString(),
            });
        } catch (err) {
            console.error('Erreur lors du chargement des stations:', err);
            setError('Erreur lors du chargement des données des stations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'bus') {
            loadBusData();
        } else {
            loadStationsData();
        }
    }, [activeTab]);

    // Cartes affichées, avec icône lucide + accent coloré (comme StatisticsPage.jsx)
    const currentStatCards = activeTab === 'bus'
        ? [
            { label: 'En Service',       value: busStats.enService,       Icon: CheckCircle,  accent: { bar: 'linear-gradient(135deg, #16A34A, #4ADE80)', bg: '#16A34A14', icon: '#16A34A' } },
            { label: 'En Maintenance',   value: busStats.enMaintenance,   Icon: AlertTriangle, accent: { bar: 'linear-gradient(135deg, #F59E0B, #FBBF24)', bg: '#F59E0B14', icon: '#F59E0B' } },
            { label: 'Capacité Totale',  value: busStats.capaciteTotale,  Icon: Users,         accent: { bar: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', bg: '#8B5CF614', icon: '#8B5CF6' } },
        ]
        : [
            { label: 'Total Stations',   value: stationStats.total,          Icon: MapPinned,    accent: { bar: GRADIENT, bg: `${BRAND.blue}14`, icon: BRAND.blue } },
            { label: 'Stations Actives', value: stationStats.actives,        Icon: CheckCircle,  accent: { bar: 'linear-gradient(135deg, #16A34A, #4ADE80)', bg: '#16A34A14', icon: '#16A34A' } },
            { label: 'En Maintenance',   value: stationStats.enMaintenance,  Icon: AlertTriangle, accent: { bar: 'linear-gradient(135deg, #F59E0B, #FBBF24)', bg: '#F59E0B14', icon: '#F59E0B' } },
        ];

    // Fonction pour gérer la sauvegarde (ajout/modification)
    const handleSave = async (data, mode) => {
        try {
            setLoading(true);

            if (activeTab === 'bus') {
                if (mode === 'edit') {
                    if (!data.id) throw new Error('ID du bus manquant pour la modification');
                    const { id, ...busDataWithoutId } = data;
                    await busService.updateBus(id, busDataWithoutId);
                } else {
                    await busService.createBus(data);
                }
                await loadBusData();
            } else {
                if (mode === 'edit') {
                    if (!data.id) throw new Error('ID de la station manquant pour la modification');
                    const { id, ...stationDataWithoutId } = data;
                    await stationService.updateStation(id, stationDataWithoutId);
                } else {
                    await stationService.createStation(data);
                }
                await loadStationsData();
            }

            alert(`${activeTab === 'bus' ? 'Bus' : 'Station'} ${mode === 'edit' ? 'modifié(e)' : 'ajouté(e)'} avec succès !`);
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
            alert(`Erreur lors de la sauvegarde: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer la suppression
    const handleDelete = async (item) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ce ${activeTab === 'bus' ? 'bus' : 'cette station'} ?`)) {
            return;
        }

        try {
            setLoading(true);

            if (activeTab === 'bus') {
                await busService.deleteBus(item.id || item.busId);
                await loadBusData();
            } else {
                await stationService.deleteStation(item.id || item.stationId);
                await loadStationsData();
            }

            alert(`${activeTab === 'bus' ? 'Bus' : 'Station'} supprimé(e) avec succès !`);
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            alert(`Erreur lors de la suppression: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const currentData = activeTab === 'bus' ? busData : stationsData;

    const filteredData = currentData.filter(item => {
        const searchField = activeTab === 'bus' ?
            (item.bus_number || item.busNumber || '').toString() :
            (item.station_name || item.stationName || '');

        const matchesSearch = searchField.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Tous les statuts' || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleShowDetails = (item) => {
        setDetailsItem(item);
        setShowDetailsModal(true);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'En service': 'bg-green-100 text-green-700',
            'En maintenance': 'bg-orange-100 text-orange-700',
            'ACTIVE': 'bg-green-100 text-green-700',
            'INACTIVE': 'bg-red-100 text-red-700',
            'MAINTENANCE': 'bg-orange-100 text-orange-700'
        };

        return `${statusMap[status] || 'bg-gray-100 text-gray-700'} px-2 py-1 rounded-full text-xs font-medium`;
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'En service': 'En service',
            'En maintenance': 'En maintenance',
            'ACTIVE': 'Actif',
            'INACTIVE': 'Inactif',
            'MAINTENANCE': 'Maintenance'
        };
        return statusLabels[status] || status;
    };

    const getStationTypeLabel = (type) => {
        const typeLabels = {
            'TERMINUS': 'Terminus',
            'DEPARTURE': 'Depart',
            'STOP': 'Arrêt Normal'
        };
        return typeLabels[type] || type;
    };

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">
                {/* Affichage des erreurs */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRADIENT }}>
                                <Bus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold" style={{ color: BRAND.dark }}>Gestion des Bus & Stations</h1>
                                <p className="text-gray-500 mt-0.5 text-sm">Gérez votre flotte de bus et le réseau de stations</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setModalMode('add');
                                setEditingItem(null);
                                setShowAddModal(true);
                            }}
                            disabled={loading}
                            className="flex items-center px-4 sm:px-5 py-3 text-sm text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: GRADIENT }}
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            {activeTab === 'bus' ? 'Nouveau Bus' : 'Nouvelle Station'}
                        </button>
                    </div>
                </div>

                {/* Onglets */}
                <div className="mb-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 inline-flex gap-1">
                        <button
                            onClick={() => setActiveTab('bus')}
                            disabled={loading}
                            className="flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-50"
                            style={activeTab === 'bus' ? { background: GRADIENT, color: '#fff' } : { color: '#6B7280' }}
                        >
                            <Bus className="w-4 h-4 mr-2" />
                            Bus
                        </button>
                        <button
                            onClick={() => setActiveTab('stations')}
                            disabled={loading}
                            className="flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-50"
                            style={activeTab === 'stations' ? { background: GRADIENT, color: '#fff' } : { color: '#6B7280' }}
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            Stations
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {currentStatCards.map((stat, index) => (
                        <StatCard key={index} {...stat} loading={loading} />
                    ))}
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
                            <input
                                type="text"
                                placeholder={`Rechercher ${activeTab === 'bus' ? 'un bus' : 'une station'}...`}
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
                                {activeTab === 'bus' ? (
                                    <>
                                        <option>En service</option>
                                        <option>En maintenance</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="ACTIVE">Actif</option>
                                        <option value="MAINTENANCE">En Maintenance</option>
                                        <option value="INACTIVE">Inactif</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des bus/stations */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BRAND.blue }}></div>
                            <span className="ml-2 text-gray-600">Chargement...</span>
                        </div>
                    )}

                    {!loading && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {activeTab === 'bus' ? (
                                        <>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Bus</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Capacité</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Statut</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Station</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Adresse</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Type</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Coordonnées</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Statut</th>
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Actions</th>
                                        </>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === 'bus' ? 4 : 6} className="text-center py-8 text-gray-500">
                                            Aucun {activeTab === 'bus' ? 'bus' : 'station'} trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={activeTab === 'bus' ? (item.id || item.busId) : (item.id || item.stationId)}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            {activeTab === 'bus' ? (
                                                <>
                                                    <td className="py-2 px-3">
                                                        <div>
                                                            <div className="font-semibold text-blue-600 text-sm">
                                                                {item.bus_number || item.busNumber}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {item.immatriculation || item.matriculation || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium text-gray-700">
                                                                {item.capacity} places
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs">
                                                                <Users size={12} className="text-gray-400"/>
                                                                <span className="text-gray-700">{item.capacity}/{item.capacity}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <span className={getStatusBadge(item.status)}>
                                                            {getStatusLabel(item.status)}
                                                        </span>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="py-2 px-3">
                                                        <div>
                                                            <div className="font-semibold text-blue-600 text-sm">
                                                                {item.stationName || item.stationName}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <div className="text-sm text-gray-700">{item.address}</div>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <div className="text-sm text-gray-700">
                                                            {getStationTypeLabel(item.stationType || item.stationType)}
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <MapPin size={12} className="text-gray-400"/>
                                                            <span className="text-gray-700">{item.latitude}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <MapPin size={12} className="text-gray-400"/>
                                                            <span className="text-gray-700">{item.longitude}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <span className={getStatusBadge(item.status)}>
                                                            {getStatusLabel(item.status)}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            <td className="py-2 px-3">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Voir"
                                                        onClick={() => handleShowDetails(item)}
                                                    >
                                                        <Eye size={14}/>
                                                    </button>
                                                    <button
                                                        className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                                        title="Modifier"
                                                        onClick={() => {
                                                            setModalMode('edit');
                                                            setEditingItem(item);
                                                            setShowAddModal(true);
                                                        }}
                                                    >
                                                        <Edit size={14}/>
                                                    </button>
                                                    <button
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Supprimer"
                                                        onClick={() => handleDelete(item)}
                                                    >
                                                        <Trash2 size={14}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ModalDetails
                activeTab={activeTab}
                showDetailsModal={showDetailsModal}
                setShowDetailsModal={setShowDetailsModal}
                detailsItem={detailsItem}
            />

            <ModalAjout
                activeTab={activeTab}
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                modalMode={modalMode}
                editingItem={editingItem}
                onSave={handleSave}
            />
        </div>
    );
};

export default BusStationsPage;