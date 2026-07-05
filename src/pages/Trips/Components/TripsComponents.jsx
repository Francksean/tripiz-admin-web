import React, {useEffect, useState} from 'react';
import { Search, Filter, Eye, Edit, Trash2, Plus, Calendar, Clock, Users, MapPin, Bus, User } from 'lucide-react';
import { TripDetailModal } from "./DetailsModal.jsx";
import { EditTripModal }   from "./EditModal.jsx";
import { CreateTripModal } from "./AddModal.jsx";
import {busService} from "../../../Services/BusService.js";
import {userService} from "../../../Services/UserService.js";
import {itineraryService} from "../../../Services/ItineraireService.js";
import {trajetService} from "../../../Services/TrajetService.js";

const INITIAL_TRIPS = [
    { trip_id: 1, bus_number: 'BUS001', driver_name: 'Jean Mballa',  itinerary_name: 'Douala Central - Bonabéri', trip_date: '2024-12-15', schedule_departure_time: '07:30:00', actual_departure_time: '07:32:00', schedule_arrival_time: '08:15:00', actual_arrival_time: '08:18:00', trip_status: 'TERMINE',   passenger_count: 42, route_name: 'Ligne A' },
    { trip_id: 2, bus_number: 'BUS002', driver_name: 'Marie Nkomo',  itinerary_name: 'Akwa - Makepe',             trip_date: '2024-12-15', schedule_departure_time: '09:00:00', actual_departure_time: null,        schedule_arrival_time: '09:45:00', actual_arrival_time: null,        trip_status: 'EN_COURS',  passenger_count: 35, route_name: 'Ligne B' },
    { trip_id: 3, bus_number: 'BUS003', driver_name: 'Paul Etame',   itinerary_name: 'Bassa - Ndokoti',           trip_date: '2024-12-15', schedule_departure_time: '10:30:00', actual_departure_time: null,        schedule_arrival_time: '11:15:00', actual_arrival_time: null,        trip_status: 'PROGRAMME', passenger_count: 0,  route_name: 'Ligne C' },
    { trip_id: 4, bus_number: 'BUS001', driver_name: 'Jean Mballa',  itinerary_name: 'Bonabéri - Douala Central', trip_date: '2024-12-15', schedule_departure_time: '12:00:00', actual_departure_time: null,        schedule_arrival_time: '12:45:00', actual_arrival_time: null,        trip_status: 'ANNULE',   passenger_count: 0,  route_name: 'Ligne A' },
    { trip_id: 5, bus_number: 'BUS004', driver_name: 'Alice Fotso',  itinerary_name: 'Deido - Bonanjo',           trip_date: '2024-12-15', schedule_departure_time: '13:30:00', actual_departure_time: '13:45:00', schedule_arrival_time: '14:15:00', actual_arrival_time: '14:35:00', trip_status: 'TERMINE',   passenger_count: 28, route_name: 'Ligne D' },
    { trip_id: 6, bus_number: 'BUS005', driver_name: 'Pierre Ngono', itinerary_name: 'Logpom - Bonapriso',        trip_date: '2024-12-15', schedule_departure_time: '15:00:00', actual_departure_time: null,        schedule_arrival_time: '15:45:00', actual_arrival_time: null,        trip_status: 'PROGRAMME', passenger_count: 0,  route_name: 'Ligne E' },
];

const STATUS_STYLE = {
    PROGRAMME: 'bg-blue-50 text-blue-700',
    EN_COURS:  'bg-green-50 text-green-700',
    TERMINE:   'bg-gray-100 text-gray-600',
    ANNULE:    'bg-red-50 text-red-700',
};
const STATUS_DOT = {
    PROGRAMME: 'bg-blue-500',
    EN_COURS:  'bg-green-500',
    TERMINE:   'bg-gray-400',
    ANNULE:    'bg-red-500',
};
const STATUS_LABEL = {
    PROGRAMME: 'Programmé',
    EN_COURS:  'En cours',
    TERMINE:   'Terminé',
    ANNULE:    'Annulé',
};

const fmt = (t) => (t ? t.substring(0, 5) : '--:--');

const TripsManagement = () => {
    const [trips, setTrips]             = useState(INITIAL_TRIPS);
    const [searchTerm, setSearchTerm]   = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal]     = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTrip, setSelectedTrip]       = useState(null);
    const [tripToEdit, setTripToEdit]           = useState(null);

    const handleViewTrip   = (trip) => { setSelectedTrip(trip); setShowDetailModal(true); };
    const handleEditTrip   = (trip) => { setTripToEdit(trip);   setShowEditModal(true); };
    const handleDeleteTrip = (id)   => { if (window.confirm('Supprimer ce trajet ?')) setTrips(prev => prev.filter(t => t.trip_id !== id)); };
    const handleSaveEdit   = (trip) => setTrips(prev => prev.map(t => t.trip_id === trip.trip_id ? trip : t));
    const handleCreateTrip = async (tripData) => { await trajetService.createTrip(tripData);};

    const statsCards = [
        { label: 'Total Trajets',    value: trips.length,                                            color: 'bg-green-100 text-green-600',  Icon: Bus      },
        { label: 'Trajets Actifs',   value: trips.filter(t => t.trip_status === 'EN_COURS').length,  color: 'bg-orange-100 text-orange-600', Icon: Clock    },
        { label: 'Trajets Terminés', value: trips.filter(t => t.trip_status === 'TERMINE').length,   color: 'bg-purple-100 text-purple-600', Icon: Calendar },
        { label: 'Total Passagers',  value: trips.reduce((s, t) => s + t.passenger_count, 0),        color: 'bg-blue-100 text-blue-600',    Icon: Users    },
    ];

    const filtered = trips.filter(t =>
        (t.itinerary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.driver_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'Tous les statuts' || t.trip_status === statusFilter)
    );

    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadFormOptions();
    }, []);

    const loadFormOptions = async () => {
        const [busList, driverList, itineraryList] = await Promise.all([
            busService.getAllBuses(),
            userService.getAllDrivers(),
            itineraryService.getAllItineraries(),
        ]);

        // Bus : { busId, busNumber, matriculation, ... } → label lisible
        setBuses(busList.map(b => ({
            id: b.busId,
            label: `Bus ${b.busNumber} — ${b.matriculation}`,
        })));

        // Itinéraire : { itinerary_id, itinerary_name, route_name, ... }
        setItineraries(itineraryList.map(i => ({
            id: i.itinerary_id,
            label: `${i.itinerary_name} (${i.route_name})`,
        })));

        // Chauffeur : forme exacte à confirmer (voir remarque ci-dessous)
        setDrivers(driverList.map(d => ({
            id: d.userId ?? d.id ?? d.driver_id,
            label: [d.firstName, d.lastName].filter(Boolean).join(' ') || d.email,
        })));
    };


    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8">

                {/* Header */}
                <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Trajets</h1>
                        <p className="text-gray-500 mt-1 text-sm">Suivez et gérez tous les trajets en temps réel</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700
                                text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl
                                w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Nouveau Trajet
                    </button>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    {statsCards.map(({label, value, color, Icon}) => (
                        <div key={label} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs font-medium">{label}</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filtres ── */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un trajet, bus, chauffeur…"
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400 flex-shrink-0" />
                        <select
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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

            {/* ── Tableau ── */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {['Trajet', 'Bus / Chauffeur', 'Horaires', 'Passagers', 'Statut', 'Actions'].map(h => (
                                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-600">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filtered.map((trip) => (
                            <tr key={trip.trip_id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">
                                    <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                        <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                                        {trip.itinerary_name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{trip.route_name} · {trip.trip_date}</p>
                                </td>
                                <td className="py-3 px-4">
                                    <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                        <Bus size={12} className="text-gray-400" /> {trip.bus_number}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                        <User size={11} className="text-gray-300" /> {trip.driver_name}
                                    </p>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-xs space-y-0.5">
                                        <div className="flex justify-between gap-3">
                                            <span className="text-gray-400">Prévu</span>
                                            <span className="font-medium text-gray-700">{fmt(trip.schedule_departure_time)} – {fmt(trip.schedule_arrival_time)}</span>
                                        </div>
                                        {(trip.actual_departure_time || trip.actual_arrival_time) && (
                                            <div className="flex justify-between gap-3">
                                                <span className="text-gray-400">Réel</span>
                                                <span className="font-medium text-green-600">{fmt(trip.actual_departure_time)} – {fmt(trip.actual_arrival_time)}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                        <span className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                            <Users size={12} className="text-gray-400" /> {trip.passenger_count}
                                        </span>
                                </td>
                                <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[trip.trip_status] || 'bg-gray-100 text-gray-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[trip.trip_status] || 'bg-gray-400'}`} />
                                            {STATUS_LABEL[trip.trip_status] || trip.trip_status}
                                        </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleViewTrip(trip)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Voir">
                                            <Eye size={14} />
                                        </button>
                                        <button onClick={() => handleEditTrip(trip)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="Modifier">
                                            <Edit size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteTrip(trip.trip_id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Supprimer">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <Bus size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">Aucun trajet trouvé</p>
                        <p className="text-xs mt-1">Essayez de modifier vos critères de recherche</p>
                    </div>
                )}
            </div>

            {filtered.length > 0 && (
                <p className="mt-3 text-xs text-gray-400 text-center">
                    {filtered.length} trajet{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''} sur {trips.length}
                </p>
            )}

            {/* ── Modaux ── */}
            <TripDetailModal
                trip={selectedTrip}
                isOpen={showDetailModal}
                onClose={() => { setShowDetailModal(false); setSelectedTrip(null); }}
                onEdit={handleEditTrip}
            />

                <CreateTripModal
                    isOpen={showCreateModal} // ← ICI : On remplace isModalOpen par showCreateModal
                    onClose={() => setShowCreateModal(false)} // ← ICI : On remet le bon setter à false
                    onSave={handleCreateTrip}
                    buses={buses}
                    drivers={drivers}
                    itineraries={itineraries}
                />

            <EditTripModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setTripToEdit(null); }}
                onSave={handleSaveEdit}
                trip={tripToEdit}
            />
        </div>
        </div>
    );
};

export default TripsManagement;