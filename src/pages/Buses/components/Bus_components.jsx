import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Clock, Users, Filter, Eye, Settings, Bus, Navigation, Battery, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import {ModalAjout} from "./AjoutModal.jsx";
import {ModalDetails} from "./Detail_modal.jsx";

const BusStationsPage = () => {
    const [activeTab, setActiveTab] = useState('bus');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
    const [editingItem, setEditingItem] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsItem, setDetailsItem] = useState(null);

    // Données d'exemple pour les lignes (routes)
    const routesData = [
        { route_id: 1, route_name: 'Ligne A', description: 'Douala Central - Bonabéri', status: 'ACTIVE', ticket_price: 500.00 },
        { route_id: 2, route_name: 'Ligne B', description: 'Akwa - Makepe', status: 'ACTIVE', ticket_price: 600.00 },
        { route_id: 3, route_name: 'Ligne C', description: 'Bassa - Ndokoti', status: 'ACTIVE', ticket_price: 550.00 }
    ];

    // Données d'exemple pour les bus (conforme à la structure BDD)
    const busData = [
        {
            bus_id: 1,
            bus_number: 'BUS001',
            immatriculation: 'DLA-2001-CM',
            capacity: 85,
            status: 'EN_SERVICE',
            // Données additionnelles pour l'affichage
            modele: 'Mercedes Citaro',
            position: 'Gare Centrale',
            route_name: 'Ligne A',
            chauffeur: 'Pierre Mbarga',
            passagersActuels: 42,
            derniereMaintenance: '15/05/2024'
        },
        {
            bus_id: 2,
            bus_number: 'BUS002',
            immatriculation: 'DLA-2002-CM',
            capacity: 75,
            status: 'EN_SERVICE',
            modele: 'Volvo 7900',
            position: 'Rond-point Akwa',
            route_name: 'Ligne B',
            chauffeur: 'Marie Essomba',
            passagersActuels: 28,
            derniereMaintenance: '10/05/2024'
        },
        {
            bus_id: 3,
            bus_number: 'BUS003',
            immatriculation: 'DLA-2003-CM',
            capacity: 90,
            status: 'MAINTENANCE',
            modele: 'Scania Citywide',
            position: 'Dépôt Principal',
            route_name: '-',
            chauffeur: '-',
            passagersActuels: 0,
            derniereMaintenance: '20/06/2024'
        },
        {
            bus_id: 4,
            bus_number: 'BUS004',
            immatriculation: 'DLA-2004-CM',
            capacity: 80,
            status: 'EN_SERVICE',
            modele: 'Mercedes eCitaro',
            position: 'Place du Gouvernement',
            route_name: 'Ligne A',
            chauffeur: 'Jean Fotso',
            passagersActuels: 35,
            derniereMaintenance: '08/06/2024'
        }
    ];

    // Données d'exemple pour les stations (conforme à la structure BDD)
    const stationsData = [
        {
            station_id: 1,
            station_name: 'Gare Centrale',
            address: 'Avenue de la Liberté, Akwa, Douala',
            station_type: 'TERMINUS',
            status: 'ACTIVE',
            gps_coordinates: '4.0511°N, 9.7679°E',
            // Données additionnelles pour l'affichage
            quartier: 'Akwa',
            nbRoutes: 2,
            affluence: 'Très élevée',
            equipements: ['Abri', 'Bancs', 'Éclairage', 'Panneau info'],
            passagersJour: 850,
            derniereMaintenance: '12/06/2024'
        },
        {
            station_id: 2,
            station_name: 'Marché Bonabéri',
            address: 'Rue du Commerce, Bonabéri, Douala',
            station_type: 'ARRET_NORMAL',
            status: 'ACTIVE',
            gps_coordinates: '4.0623°N, 9.7234°E',
            quartier: 'Bonabéri',
            nbRoutes: 1,
            affluence: 'Élevée',
            equipements: ['Abri', 'Bancs', 'Éclairage'],
            passagersJour: 620,
            derniereMaintenance: '08/06/2024'
        },
        {
            station_id: 3,
            station_name: 'Rond-point Akwa',
            address: 'Rond-point Akwa, Douala',
            station_type: 'CORRESPONDANCE',
            status: 'MAINTENANCE',
            gps_coordinates: '4.0486°N, 9.7623°E',
            quartier: 'Akwa',
            nbRoutes: 2,
            affluence: 'Moyenne',
            equipements: ['Abri', 'Éclairage'],
            passagersJour: 450,
            derniereMaintenance: '20/06/2024'
        },
        {
            station_id: 4,
            station_name: 'Station Ndokoti',
            address: 'Carrefour Ndokoti, Douala',
            station_type: 'ARRET_NORMAL',
            status: 'ACTIVE',
            gps_coordinates: '4.0334°N, 9.7456°E',
            quartier: 'Ndokoti',
            nbRoutes: 1,
            affluence: 'Élevée',
            equipements: ['Abri', 'Bancs', 'Éclairage', 'Panneau info', 'WC'],
            passagersJour: 720,
            derniereMaintenance: '05/06/2024'
        }
    ];

    const busStats = [
        { label: 'Total Bus', value: '4', color: 'bg-blue-100 text-blue-600', icon: '🚌' },
        { label: 'En Service', value: '3', color: 'bg-green-100 text-green-600', icon: '✅' },
        { label: 'En Maintenance', value: '1', color: 'bg-orange-100 text-orange-600', icon: '⚠️' },
        { label: 'Capacité Totale', value: '330', color: 'bg-purple-100 text-purple-600', icon: '👥' }
    ];

    const stationStats = [
        { label: 'Total Stations', value: '4', color: 'bg-blue-100 text-blue-600', icon: '🚏' },
        { label: 'Stations Actives', value: '3', color: 'bg-green-100 text-green-600', icon: '✅' },
        { label: 'En Maintenance', value: '1', color: 'bg-orange-100 text-orange-600', icon: '⚠️' },
        { label: 'Passagers/jour', value: '2640', color: 'bg-purple-100 text-purple-600', icon: '📊' }
    ];

    const currentData = activeTab === 'bus' ? busData : stationsData;
    const currentStats = activeTab === 'bus' ? busStats : stationStats;

    const filteredData = currentData.filter(item =>
        (activeTab === 'bus' ? item.bus_number : item.station_name).toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'Tous les statuts' || item.status === statusFilter)
    );

    const handleShowDetails = (item) => {
        setDetailsItem(item);
        setShowDetailsModal(true);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'EN_SERVICE': 'bg-green-100 text-green-700',
            'DISPONIBLE': 'bg-blue-100 text-blue-700',
            'MAINTENANCE': 'bg-orange-100 text-orange-700',
            'HORS_SERVICE': 'bg-red-100 text-red-700',
            'ACTIVE': 'bg-green-100 text-green-700',
            'INACTIVE': 'bg-red-100 text-red-700'
        };

        const statusLabels = {
            'EN_SERVICE': 'En Service',
            'DISPONIBLE': 'Disponible',
            'MAINTENANCE': 'Maintenance',
            'HORS_SERVICE': 'Hors Service',
            'ACTIVE': 'Actif',
            'INACTIVE': 'Inactif'
        };

        return `${statusMap[status] || 'bg-gray-100 text-gray-700'} px-2 py-1 rounded-full text-xs font-medium`;
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'EN_SERVICE': 'En Service',
            'DISPONIBLE': 'Disponible',
            'MAINTENANCE': 'Maintenance',
            'HORS_SERVICE': 'Hors Service',
            'ACTIVE': 'Actif',
            'INACTIVE': 'Inactif'
        };
        return statusLabels[status] || status;
    };

    const getStationTypeLabel = (type) => {
        const typeLabels = {
            'TERMINUS': 'Terminus',
            'ARRET_NORMAL': 'Arrêt Normal',
            'CORRESPONDANCE': 'Correspondance'
        };
        return typeLabels[type] || type;
    };

    const getAffluenceColor = (affluence) => {
        switch (affluence) {
            case 'Très élevée': return 'text-red-600 font-medium';
            case 'Élevée': return 'text-orange-600 font-medium';
            case 'Moyenne': return 'text-yellow-600 font-medium';
            case 'Faible': return 'text-green-600 font-medium';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">
                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Bus & Stations</h1>
                            <p className="text-gray-600 mt-1 text-sm">Gérez votre flotte de bus et le réseau de
                                stations</p>
                        </div>
                        <button
                            onClick={() => {
                                setModalMode('add');
                                setEditingItem(null);
                                setShowAddModal(true);
                            }}
                            className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit"
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
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
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
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {currentStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
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
                                        <option>EN_SERVICE</option>
                                        <option>DISPONIBLE</option>
                                        <option>MAINTENANCE</option>
                                        <option>HORS_SERVICE</option>
                                    </>
                                ) : (
                                    <>
                                        <option>ACTIVE</option>
                                        <option>MAINTENANCE</option>
                                        <option>INACTIVE</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des bus/stations */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {activeTab === 'bus' ? (
                                    <>
                                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Bus</th>
                                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Ligne</th>
                                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Position</th>
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
                            {filteredData.map((item) => (
                                <tr key={activeTab === 'bus' ? item.bus_id : item.station_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    {activeTab === 'bus' ? (
                                        <>
                                            <td className="py-2 px-3">
                                                <div>
                                                    <div className="font-semibold text-blue-600 text-sm">{item.bus_number}</div>
                                                    <div className="text-xs text-gray-500">{item.immatriculation}</div>
                                                    <div className="text-xs text-gray-500">{item.modele}</div>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="text-sm text-gray-700">{item.route_name}</div>
                                                <div className="text-xs text-gray-500">Chauffeur: {item.chauffeur}</div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <MapPin size={12} className="text-blue-500"/>
                                                    <span className="text-gray-700">{item.position}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-gray-700">{item.capacity} places</div>
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <Users size={12} className="text-gray-400"/>
                                                        <span className="text-gray-700">{item.passagersActuels}/{item.capacity}</span>
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
                                                    <div className="font-semibold text-blue-600 text-sm">{item.station_name}</div>
                                                    <div className="text-xs text-gray-500">ID: {item.station_id}</div>
                                                    <div className="text-xs text-gray-500">{item.quartier}</div>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="text-sm text-gray-700">{item.address}</div>
                                                <div className="text-xs text-gray-500 mt-1">{item.equipements?.length || 0} équipements</div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="text-sm text-gray-700">{getStationTypeLabel(item.station_type)}</div>
                                                <div className="text-xs text-gray-500">{item.nbRoutes} ligne{item.nbRoutes > 1 ? 's' : ''}</div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <MapPin size={12} className="text-gray-400"/>
                                                    <span className="text-gray-700">{item.gps_coordinates}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">{item.passagersJour}/jour</div>
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
                                                onClick={()=> handleShowDetails(item)}
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
                                                title="Supprimer">
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
            </div>
            {/*Modal to see the details of stations or buses*/}
            <ModalDetails
                activeTab={activeTab}
                showDetailsModal={showDetailsModal}
                setShowDetailsModal={setShowDetailsModal}
                detailsItem={detailsItem}
                routesData={routesData}
            />

            {/*Modal to add or edit stations or buses*/}
            <ModalAjout
                activeTab={activeTab}
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                routesData={routesData}
                modalMode={modalMode}
                editingItem={editingItem}
            />
        </div>
    );
};

export default BusStationsPage;