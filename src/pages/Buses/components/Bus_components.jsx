import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Clock, Users, Filter, Eye, Settings, Bus, Navigation, Battery, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import {ModalAjout} from "./AjoutModal.jsx";
import {ModalDetails} from "./Detail_modal.jsx";
import {stationService} from "../../../Services/StationService.js";
import {busService} from "../../../Services/BusService.js";

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
    const [busStats, setBusStats] = useState([
        { label: 'En Service', value: '0', color: 'bg-green-100 text-green-600', icon: '✅' },
        { label: 'En Maintenance', value: '0', color: 'bg-orange-100 text-orange-600', icon: '⚠️' },
        { label: 'Capacité Totale', value: '0', color: 'bg-purple-100 text-purple-600', icon: '👥' }
    ]);
    const [stationStats, setStationStats] = useState([
        { label: 'Total Stations', value: '0', color: 'bg-blue-100 text-blue-600', icon: '🚏' },
        { label: 'Stations Actives', value: '0', color: 'bg-green-100 text-green-600', icon: '✅' },
        { label: 'En Maintenance', value: '0', color: 'bg-orange-100 text-orange-600', icon: '⚠️' },
    ]);

    // État de chargement et d'erreur
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour charger les données des bus
    const loadBusData = async () => {
        try {
            setLoading(true);
            const buses = await busService.getAllBuses();
            setBusData(buses);

            // Charger les statistiques des bus avec des logs pour le débogage
            const [inServiceCount, inMaintenanceCount, totalCapacity] = await Promise.all([
                busService.countInServiceBuses(),
                busService.countInMaintenanceBuses(),
                busService.getTotalCapacity()
            ]);

            // Logs pour débogage
            console.log('Statistiques bus récupérées:', {
                inServiceCount,
                inMaintenanceCount,
                totalCapacity
            });

            setBusStats([
                {
                    label: 'En Service',
                    value: inServiceCount.count.toString(),
                    color: 'bg-green-100 text-green-600',
                    icon: '✅'
                },
                {
                    label: 'En Maintenance',
                    value: inMaintenanceCount.count.toString(),
                    color: 'bg-orange-100 text-orange-600',
                    icon: '⚠️'
                },
                {
                    label: 'Capacité Totale',
                    value: totalCapacity.capacity.toString(),
                    color: 'bg-purple-100 text-purple-600',
                    icon: '👥'
                }
            ]);
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

            // Charger les statistiques des stations avec des logs pour le débogage
            const [totalCount, inServiceCount, inMaintenanceCount] = await Promise.all([
                stationService.countAllStations(),
                stationService.countInServiceStations(),
                stationService.countInMaintenanceStations()
            ]);

            // Logs pour débogage
            console.log('Statistiques stations récupérées:', {
                totalCount,
                inServiceCount,
                inMaintenanceCount
            });

            setStationStats([
                {
                    label: 'Total Stations',
                    value: totalCount.count.toString(),
                    color: 'bg-blue-100 text-blue-600',
                    icon: '🚏'
                },
                {
                    label: 'Stations Actives',
                    value: inServiceCount.count.toString(),
                    color: 'bg-green-100 text-green-600',
                    icon: '✅'
                },
                {
                    label: 'En Maintenance',
                    value: inMaintenanceCount.count.toString(),
                    color: 'bg-orange-100 text-orange-600',
                    icon: '⚠️'
                },
            ]);
        } catch (err) {
            console.error('Erreur lors du chargement des stations:', err);
            setError('Erreur lors du chargement des données des stations');
        } finally {
            setLoading(false);
        }
    };

    // Charger les données au montage du composant et lors du changement d'onglet
    useEffect(() => {
        if (activeTab === 'bus') {
            loadBusData();
        } else {
            loadStationsData();
        }
    }, [activeTab]);

    // Fonction pour gérer la sauvegarde (ajout/modification)
    const handleSave = async (data, mode) => {
        try {
            setLoading(true);
            console.log('=== DEBUG HANDLE SAVE ===');
            console.log('Data reçue:', data);
            console.log('Mode:', mode);
            console.log('Active tab:', activeTab);

            if (activeTab === 'bus') {
                if (mode === 'edit') {
                    // Vérification de l'ID
                    if (!data.id) {
                        throw new Error('ID du bus manquant pour la modification');
                    }
                    console.log('Modification bus avec ID:', data.id);

                    // Séparer l'ID du body de la requête
                    const { id, ...busDataWithoutId } = data;
                    console.log('Body de la requête (sans ID):', busDataWithoutId);

                    await busService.updateBus(id, busDataWithoutId);
                } else {
                    console.log('Création nouveau bus');
                    // Pour la création, pas d'ID
                    await busService.createBus(data);
                }
                await loadBusData();
            } else {
                if (mode === 'edit') {
                    // Vérification de l'ID
                    if (!data.id) {
                        throw new Error('ID de la station manquant pour la modification');
                    }
                    console.log('Modification station avec ID:', data.id);

                    // Séparer l'ID du body de la requête
                    const { id, ...stationDataWithoutId } = data;
                    console.log('Body de la requête (sans ID):', stationDataWithoutId);

                    await stationService.updateStation(id, stationDataWithoutId);
                } else {
                    console.log('Création nouvelle station');
                    // Pour la création, pas d'ID
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
    const currentStats = activeTab === 'bus' ? busStats : stationStats;

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
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Bus & Stations</h1>
                            <p className="text-gray-600 mt-1 text-sm">Gérez votre flotte de bus et le réseau de stations</p>
                        </div>
                        <button
                            onClick={() => {
                                setModalMode('add');
                                setEditingItem(null);
                                setShowAddModal(true);
                            }}
                            disabled={loading}
                            className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            Nouveau {activeTab === 'bus' ? 'Bus' : 'Station'}
                        </button>
                    </div>
                </div>

                {/* Onglets */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab('bus')}
                            disabled={loading}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 ${
                                activeTab === 'bus'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <Bus className="w-4 h-4 mr-2" />
                            Bus
                        </button>
                        <button
                            onClick={() => setActiveTab('stations')}
                            disabled={loading}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 ${
                                activeTab === 'stations'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            Stations
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {currentStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-800 mt-1">
                                        {loading ? '...' : stat.value}
                                    </p>
                                </div>
                                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg`}>
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
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

            {/*Modal to see the details of stations or buses*/}
            <ModalDetails
                activeTab={activeTab}
                showDetailsModal={showDetailsModal}
                setShowDetailsModal={setShowDetailsModal}
                detailsItem={detailsItem}
            />

            {/*Modal to add or edit stations or buses*/}
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