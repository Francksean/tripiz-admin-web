import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Plus, Calendar, Clock, Users, MapPin, Bus, User, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import {EditTripModal} from "./EditModal.jsx";
import {CreateTripModal} from "./AddModal.jsx";

const TripsManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tripToEdit, setTripToEdit] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Données simulées basées sur le dictionnaire
    const trips = [
        {
            trip_id: 1,
            bus_number: "BUS001",
            driver_name: "Jean Mballa",
            itinerary_name: "Douala Central - Bonabéri",
            trip_date: "2024-12-15",
            schedule_departure_time: "07:30:00",
            actual_departure_time: "07:32:00",
            schedule_arrival_time: "08:15:00",
            actual_arrival_time: "08:18:00",
            trip_status: "TERMINE",
            passenger_count: 42,
            route_name: "Ligne A"
        },
        {
            trip_id: 2,
            bus_number: "BUS002",
            driver_name: "Marie Nkomo",
            itinerary_name: "Akwa - Makepe",
            trip_date: "2024-12-15",
            schedule_departure_time: "09:00:00",
            actual_departure_time: null,
            schedule_arrival_time: "09:45:00",
            actual_arrival_time: null,
            trip_status: "EN_COURS",
            passenger_count: 35,
            route_name: "Ligne B"
        },
        {
            trip_id: 3,
            bus_number: "BUS003",
            driver_name: "Paul Etame",
            itinerary_name: "Bassa - Ndokoti",
            trip_date: "2024-12-15",
            schedule_departure_time: "10:30:00",
            actual_departure_time: null,
            schedule_arrival_time: "11:15:00",
            actual_arrival_time: null,
            trip_status: "PROGRAMME",
            passenger_count: 0,
            route_name: "Ligne C"
        },
        {
            trip_id: 4,
            bus_number: "BUS001",
            driver_name: "Jean Mballa",
            itinerary_name: "Bonabéri - Douala Central",
            trip_date: "2024-12-15",
            schedule_departure_time: "12:00:00",
            actual_departure_time: null,
            schedule_arrival_time: "12:45:00",
            actual_arrival_time: null,
            trip_status: "ANNULE",
            passenger_count: 0,
            route_name: "Ligne A"
        },
        {
            trip_id: 5,
            bus_number: "BUS004",
            driver_name: "Alice Fotso",
            itinerary_name: "Deido - Bonanjo",
            trip_date: "2024-12-15",
            schedule_departure_time: "13:30:00",
            actual_departure_time: "13:45:00",
            schedule_arrival_time: "14:15:00",
            actual_arrival_time: "14:35:00",
            trip_status: "TERMINE",
            passenger_count: 28,
            route_name: "Ligne D"
        },
        {
            trip_id: 6,
            bus_number: "BUS005",
            driver_name: "Pierre Ngono",
            itinerary_name: "Logpom - Bonapriso",
            trip_date: "2024-12-15",
            schedule_departure_time: "15:00:00",
            actual_departure_time: null,
            schedule_arrival_time: "15:45:00",
            actual_arrival_time: null,
            trip_status: "PROGRAMME",
            passenger_count: 0,
            route_name: "Ligne E"
        }
    ];

    // Calcul des statistiques basé sur les vraies données
    const totalTrips = trips.length;
    const activeTrips = trips.filter(t => t.trip_status === 'EN_COURS').length;
    const completedTrips = trips.filter(t => t.trip_status === 'TERMINE').length;
    const totalPassengers = trips.reduce((sum, trip) => sum + trip.passenger_count, 0);

    const tripCards = [
        { label: 'Total Trajets', value: totalTrips.toString(), color: 'bg-green-100 text-green-600', icon: Bus },
        { label: 'Trajets Actifs', value: activeTrips.toString(), color: 'bg-orange-100 text-orange-600', icon: Clock },
        { label: 'Trajets Terminés', value: completedTrips.toString(), color: 'bg-purple-100 text-purple-600', icon: Calendar },
        { label: 'Total Passagers', value: totalPassengers.toString(), color: 'bg-blue-100 text-blue-600', icon: Users }
    ];

    const handleEditTrip = (trip) => {
        setTripToEdit(trip);
        setShowEditModal(true);
    };

    const handleCreateTrip = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleSaveNewTrip = (newTrip) => {
        setTrips(prevTrips => [...prevTrips, newTrip]);
        setShowCreateModal(false);
        console.log('Nouveau trajet créé avec succès:', newTrip);
    };

    const handleSaveTrip = (updatedTrip) => {
        setTrips(prevTrips =>
            prevTrips.map(trip =>
                trip.trip_id === updatedTrip.trip_id ? updatedTrip : trip
            )
        );
        setShowEditModal(false);
        setTripToEdit(null);

        // Optionnel : afficher un message de succès
        console.log('Trajet modifié avec succès:', updatedTrip);
    };

// 5. FONCTION POUR FERMER LE MODAL D'ÉDITION (à ajouter)
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setTripToEdit(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PROGRAMME': return 'bg-blue-100 text-blue-800';
            case 'EN_COURS': return 'bg-green-100 text-green-800';
            case 'TERMINE': return 'bg-gray-100 text-gray-800';
            case 'ANNULE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PROGRAMME': return 'Programmé';
            case 'EN_COURS': return 'En cours';
            case 'TERMINE': return 'Terminé';
            case 'ANNULE': return 'Annulé';
            default: return status;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        return timeString.substring(0, 5);
    };

    const handleViewTrip = (trip) => {
        setSelectedTrip(trip);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTrip(null);
    };

    const getDelayStatus = (scheduledTime, actualTime) => {
        if (!actualTime || !scheduledTime) return null;

        const scheduled = new Date(`2024-01-01T${scheduledTime}`);
        const actual = new Date(`2024-01-01T${actualTime}`);
        const diffMinutes = (actual - scheduled) / (1000 * 60);

        if (diffMinutes <= 5) return { status: 'on-time', text: 'À l\'heure', color: 'text-green-600' };
        if (diffMinutes <= 15) return { status: 'minor-delay', text: 'Léger retard', color: 'text-yellow-600' };
        return { status: 'major-delay', text: 'Retard important', color: 'text-red-600' };
    };

    const filteredTrips = trips.filter(trip => {
        const matchesSearch = trip.itinerary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.driver_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Tous les statuts' || trip.trip_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Trajets</h1>
                        <p className="text-gray-600 mt-1 text-sm">Suivez et gérez tous les trajets en temps réel</p>
                    </div>
                    <button
                        onClick={handleCreateTrip}
                        className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit disabled:opacity-50 disabled:cursor-not-allowed">
                        <Plus className="w-4 h-4 mr-2"/>
                        Nouveau Trajet
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {tripCards.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un trajet..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>Tous les statuts</option>
                            <option value="PROGRAMME">Programmé</option>
                            <option value="EN_COURS">En cours</option>
                            <option value="TERMINE">Terminé</option>
                            <option value="ANNULE">Annulé</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Trips Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Trajet</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Bus/Chauffeur</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Horaires</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Passagers</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Statut</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filteredTrips.map((trip) => (
                        <tr key={trip.trip_id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2 px-3">
                                <div>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                                        <MapPin size={14} className="text-gray-400"/>
                                        {trip.itinerary_name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {trip.route_name} • {trip.trip_date}
                                    </div>
                                </div>
                            </td>
                            <td className="py-2 px-3">
                                <div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                        <Bus size={14} className="text-gray-400"/>
                                        {trip.bus_number}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <User size={12} className="text-gray-400"/>
                                        {trip.driver_name}
                                    </div>
                                </div>
                            </td>
                            <td className="py-2 px-3">
                                <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Prévu:</span>
                                        <span className="font-medium">
                                {formatTime(trip.schedule_departure_time)} - {formatTime(trip.schedule_arrival_time)}
                            </span>
                                    </div>
                                    {(trip.actual_departure_time || trip.actual_arrival_time) && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Réel:</span>
                                            <span className="font-medium text-green-600">
                                    {formatTime(trip.actual_departure_time)} - {formatTime(trip.actual_arrival_time)}
                                </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="py-2 px-3">
                                <div className="flex items-center gap-1 text-sm">
                                    <Users size={14} className="text-gray-400"/>
                                    <span className="font-medium">{trip.passenger_count}</span>
                                </div>
                            </td>
                            <td className="py-2 px-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.trip_status)}`}>
                        {getStatusText(trip.trip_status)}
                    </span>
                            </td>
                            <td className="py-2 px-3">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleViewTrip(trip)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Voir"
                                    >
                                        <Eye size={14}/>
                                    </button>
                                    <button
                                        onClick={() => handleEditTrip(trip)}
                                        className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit size={14}/>
                                    </button>
                                    <button
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {filteredTrips.length === 0 && (
                    <div className="text-center py-8">
                        <Bus size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Aucun trajet trouvé</p>
                        <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos critères de recherche</p>
                    </div>
                )}
            </div>

            {/* Modal de détail */}
            {showModal && selectedTrip && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header du modal */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Détails du Trajet #{selectedTrip.trip_id}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Contenu du modal */}
                        <div className="p-6 space-y-6">
                            {/* Statut principal */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        selectedTrip.trip_status === 'TERMINE' ? 'bg-green-500' :
                                            selectedTrip.trip_status === 'EN_COURS' ? 'bg-blue-500' :
                                                selectedTrip.trip_status === 'PROGRAMME' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTrip.trip_status)}`}>
                                        {getStatusText(selectedTrip.trip_status)}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {selectedTrip.trip_date}
                                </div>
                            </div>

                            {/* Informations d'itinéraire */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <MapPin size={18} />
                                    Itinéraire
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Ligne:</span>
                                        <span className="font-medium">{selectedTrip.route_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Parcours:</span>
                                        <span className="font-medium">{selectedTrip.itinerary_name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Informations du véhicule et chauffeur */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Bus size={18} />
                                        Véhicule
                                    </h3>
                                    <div className="text-lg font-bold text-blue-600">
                                        {selectedTrip.bus_number}
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <User size={18} />
                                        Chauffeur
                                    </h3>
                                    <div className="text-lg font-bold text-green-600">
                                        {selectedTrip.driver_name}
                                    </div>
                                </div>
                            </div>

                            {/* Horaires détaillés */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Clock size={18} />
                                    Horaires
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Départ prévu</div>
                                            <div className="text-lg font-semibold">{formatTime(selectedTrip.schedule_departure_time)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Arrivée prévue</div>
                                            <div className="text-lg font-semibold">{formatTime(selectedTrip.schedule_arrival_time)}</div>
                                        </div>
                                    </div>

                                    {(selectedTrip.actual_departure_time || selectedTrip.actual_arrival_time) && (
                                        <div className="border-t pt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">Départ réel</div>
                                                    <div className="text-lg font-semibold text-green-600">
                                                        {formatTime(selectedTrip.actual_departure_time)}
                                                    </div>
                                                    {selectedTrip.actual_departure_time && (
                                                        <div className={`text-xs mt-1 ${getDelayStatus(selectedTrip.schedule_departure_time, selectedTrip.actual_departure_time)?.color}`}>
                                                            {getDelayStatus(selectedTrip.schedule_departure_time, selectedTrip.actual_departure_time)?.text}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">Arrivée réelle</div>
                                                    <div className="text-lg font-semibold text-green-600">
                                                        {formatTime(selectedTrip.actual_arrival_time)}
                                                    </div>
                                                    {selectedTrip.actual_arrival_time && (
                                                        <div className={`text-xs mt-1 ${getDelayStatus(selectedTrip.schedule_arrival_time, selectedTrip.actual_arrival_time)?.color}`}>
                                                            {getDelayStatus(selectedTrip.schedule_arrival_time, selectedTrip.actual_arrival_time)?.text}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Informations sur les passagers */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Users size={18} />
                                    Passagers
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-purple-600">
                                        {selectedTrip.passenger_count}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {selectedTrip.passenger_count > 0 ? 'passagers transportés' : 'aucun passager'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions rapides */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                    <Edit size={16} />
                                    Modifier
                                </button>
                                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <Calendar size={16} />
                                    Programmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Informations sur le total d'éléments */}
            {filteredTrips.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                    {filteredTrips.length} trajet{filteredTrips.length > 1 ? 's' : ''} affiché{filteredTrips.length > 1 ? 's' : ''} sur {totalTrips} au total
                </div>
            )}
            {/* Modal de création */}
            <CreateTripModal
                isOpen={showCreateModal}
                onClose={handleCloseCreateModal}
                onSave={handleSaveNewTrip}
            />

            {/* Modal d'édition */}
            <EditTripModal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                onSave={handleSaveTrip}
                trip={tripToEdit}
            />
        </div>
    );
};

export default TripsManagement;