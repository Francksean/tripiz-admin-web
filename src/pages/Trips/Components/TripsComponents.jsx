import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Plus, Calendar, Clock, Users, MapPin, Bus, User } from 'lucide-react';
import { TripDetailModal } from "./DetailsModal.jsx";
import { EditTripModal }   from "./EditModal.jsx";
import { CreateTripModal } from "./AddModal.jsx";
import { busService }        from "../../../Services/BusService.js";
import { userService }       from "../../../Services/UserService.js";
import { itineraryService }  from "../../../Services/ItineraireService.js";
import { trajetService }     from "../../../Services/TrajetService.js";


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

const fmt = (t) => (t ? String(t).substring(0, 5) : '--:--');

const TripsManagement = () => {
    const [trips, setTrips]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [searchTerm, setSearchTerm]     = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');

    // Modaux
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal]     = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTrip, setSelectedTrip]       = useState(null);
    const [tripToEdit, setTripToEdit]           = useState(null);

    // Lookups pour résoudre les UUIDs en noms lisibles
    const [busMap, setBusMap]             = useState({});   // { uuid → 'Bus 12 — DLA-001' }
    const [driverMap, setDriverMap]       = useState({});   // { uuid → 'Jean Mballa' }
    const [itineraryMap, setItineraryMap] = useState({});   // { uuid → 'Douala - Bonabéri (Ligne A)' }

    // Listes pour les selects des modaux
    const [buses, setBuses]           = useState([]);
    const [drivers, setDrivers]       = useState([]);
    const [itineraries, setItineraries] = useState([]);

    // Stats dynamiques depuis le backend
    const [stats, setStats] = useState({
        total: 0, active: 0, completed: 0, passengers: 0,
    });


    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            // Charger tout en parallèle
            const [tripsData, busList, driverList, itineraryList, statsData, totalTrips] =
                await Promise.allSettled([
                    trajetService.getAllTrips(),
                    busService.getAllBuses(),
                    userService.getAllDrivers ? userService.getAllDrivers() : Promise.resolve([]),
                    itineraryService.getAllItineraries(),
                    trajetService.getStatistics(),
                    //trajetService.countAllPassengers(),
                    trajetService.countTrips(),
                ]);

            // --- Construction des maps, version robuste ---
            const bMap = {};
            const bList = [];
            if (busList.status === 'fulfilled' && Array.isArray(busList.value)) {
                busList.value.forEach(b => {
                    const id = b.busId ?? b.id ?? b.bus_id;
                    const label = `Bus ${b.busNumber ?? b.bus_number ?? '?'} - ${b.matriculation || b.immatriculation || ''}`.trim();
                    if (id !== undefined) bMap[String(id)] = label; // clé toujours en string
                    bList.push({ id, label });
                });
            } else if (busList.status === 'rejected') {
                console.error('busService.getAllBuses() a échoué:', busList.reason);
            }
            setBusMap(bMap);
            setBuses(bList);

            const dMap = {};
            const dList = [];
            if (driverList.status === 'fulfilled' && Array.isArray(driverList.value)) {
                driverList.value.forEach(d => {
                    const id = d.userId ?? d.id ?? d.driver_id;
                    const label = [d.firstName, d.lastName].filter(Boolean).join(' ') || d.email || String(id);
                    if (id !== undefined) dMap[String(id)] = label;
                    dList.push({ id, label });
                });
            } else if (driverList.status === 'rejected') {
                console.error('userService.getAllDrivers() a échoué:', driverList.reason);
            }
            setDriverMap(dMap);
            setDrivers(dList);

            const iMap = {};
            const iList = [];
            if (itineraryList.status === 'fulfilled' && Array.isArray(itineraryList.value)) {
                itineraryList.value.forEach(i => {
                    const id = i.itinerary_id ?? i.itinaryId ?? i.itinary_id ?? i.id;
                    const label = `${i.itinerary_name || i.itinary_name || '?'}`;
                    if (id !== undefined) iMap[String(id)] = label;
                    iList.push({ id, label });
                });
            } else if (itineraryList.status === 'rejected') {
                console.error('itineraryService.getAllItineraries() a échoué:', itineraryList.reason);
            }
            setItineraryMap(iMap);
            setItineraries(iList);


            if (tripsData.status === 'fulfilled') {
                setTrips(tripsData.value);
                console.log('Exemple trip:', tripsData.value?.[0]);
                console.log('busMap:', bMap);
                console.log('driverMap:', dMap);
                console.log('itineraryMap:', iMap);
            } else {
                setError('Impossible de charger les trajets.');
            }


            const s = statsData.status === 'fulfilled' ? statsData.value : {};
            //const p = passengersData.status === 'fulfilled' ? passengersData.value : 0;
            const t = totalTrips.status === 'fulfilled' ? totalTrips.value : 0;
            setStats({
                total:      typeof t === 'number' ? t : (t?.count ?? 0),
                active:     s.ongoing    ?? 0,
                completed:  s.completed  ?? 0,
                //passengers: typeof p === 'number' ? p : (p?.count ?? 0),
            });

        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    };

    const resolveBus        = (id) => busMap[id]       || id || '—';
    const resolveDriver     = (id) => driverMap[id]    || id || '—';
    const resolveItinerary  = (id) => itineraryMap[id] || id || '—';

    const handleViewTrip   = (trip) => { setSelectedTrip(trip); setShowDetailModal(true); };
    const handleEditTrip   = (trip) => { setTripToEdit(trip);   setShowEditModal(true); };

    const handleDeleteTrip = async (id) => {
        if (!window.confirm('Supprimer ce trajet ?')) return;
        try {
            await trajetService.deleteTrip(id);
            setTrips(prev => prev.filter(t => (t.trip_id || t.id) !== id));
        } catch (err) {
            alert('Erreur suppression : ' + err.message);
        }
    };

    const handleSaveEdit = async (trip) => {
        try {
            await trajetService.updateTrip(trip.trip_id || trip.id, trip);
            setTrips(prev => prev.map(t => (t.trip_id || t.id) === (trip.trip_id || trip.id) ? trip : t));
        } catch (err) {
            alert('Erreur modification : ' + err.message);
        }
    };

    const handleCreateTrip = async (tripData) => {
        try {
            const created = await trajetService.createTrip(tripData);
            await loadAll();
            return created;
        } catch (err) {
            throw err;
        }
    };

    const statsCards = [
        { label: 'Total Trajets',    value: stats.total,      color: 'bg-green-100 text-green-600',  Icon: Bus      },
        { label: 'Trajets Actifs',   value: stats.active,     color: 'bg-orange-100 text-orange-600', Icon: Clock    },
        { label: 'Trajets Terminés', value: stats.completed,  color: 'bg-purple-100 text-purple-600', Icon: Calendar },
        //{ label: 'Total Passagers',  value: stats.passengers, color: 'bg-blue-100 text-blue-600',    Icon: Users    },
    ];

    const filtered = trips.filter(t => {
        const busLabel  = resolveBus(t.bus_id || t.busId).toLowerCase();
        const drvLabel  = resolveDriver(t.driver_id || t.driverId).toLowerCase();
        const itiLabel  = resolveItinerary(t.itinerary_id || t.itineraryId).toLowerCase();
        const q = searchTerm.toLowerCase();
        const matchSearch  = busLabel.includes(q) || drvLabel.includes(q) || itiLabel.includes(q);
        const matchStatus  = statusFilter === 'Tous les statuts' || t.trip_status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">

                {/* En-tête */}
                <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Trajets</h1>
                        <p className="text-gray-500 mt-1 text-sm">Suivez et gérez tous les trajets en temps réel</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700
                            text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Nouveau Trajet
                    </button>
                </div>

                {/* Erreur */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
                        <span>{error}</span>
                        <button onClick={loadAll} className="underline font-medium">Réessayer</button>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                    {statsCards.map(({ label, value, color, Icon }) => (
                        <div key={label} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium">{label}</p>
                                    <p className="text-xl font-bold text-gray-800 mt-1">
                                        {loading ? <span className="inline-block w-8 h-5 bg-gray-200 rounded animate-pulse" /> : value}
                                    </p>
                                </div>
                                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtres */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher un trajet, bus, chauffeur…"
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400 flex-shrink-0" />
                            <select
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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

                {/* Tableau */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {['Trajet', 'Bus / Chauffeur', 'Depart', 'Statut', 'Actions'].map(h => (
                                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-600">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        {[140, 120, 100, 40, 80, 70].map((w, j) => (
                                            <td key={j} className="py-3 px-4">
                                                <div className={`h-4 bg-gray-200 rounded animate-pulse`} style={{ width: w }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                filtered.map((trip) => {
                                    const tripId  = trip.trip_id || trip.id;
                                    const busId   = trip.bus_id  || trip.busId;
                                    const drvId   = trip.driver_id || trip.driverId;
                                    const itiId   = trip.itinerary_id || trip.itineraryId;
                                    const status  = trip.trip_status || trip.status;

                                    return (
                                        <tr key={tripId} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4">
                                                <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                                    <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                                                    <span className="truncate max-w-[160px]">{resolveItinerary(itiId)}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{trip.trip_date}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                                    <Bus size={12} className="text-gray-400" />
                                                    <span className="truncate max-w-[120px]">{resolveBus(busId)}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                    <User size={11} className="text-gray-300" />
                                                    <span className="truncate max-w-[120px]">{resolveDriver(drvId)}</span>
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-xs space-y-0.5">
                                                    <div className="flex justify-between gap-3">
                                                        {/*<span className="text-gray-400"></span>*/}
                                                        <span className="font-medium text-gray-700">
                                                                {fmt(trip.schedule_departure)}
                                                            </span>
                                                    </div>
                                                </div>
                                            </td>
                                            {/*<td className="py-3 px-4">*/}
                                            {/*        <span className="text-sm font-medium text-gray-800 flex items-center gap-1">*/}
                                            {/*            <Users size={12} className="text-gray-400" />*/}
                                            {/*            {trip.passenger_count ?? 0}*/}
                                            {/*        </span>*/}
                                            {/*</td>*/}
                                            <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-600'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[status] || 'bg-gray-400'}`} />
                                                        {STATUS_LABEL[status] || status}
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
                                                    <button onClick={() => handleDeleteTrip(tripId)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Supprimer">
                                                        <Trash2 size={14} />
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
                            <Bus size={36} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">Aucun trajet trouvé</p>
                            <p className="text-xs mt-1">Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}
                </div>



                {/* Modaux */}
                <TripDetailModal
                    trip={selectedTrip}
                    isOpen={showDetailModal}
                    onClose={() => { setShowDetailModal(false); setSelectedTrip(null); }}
                    onEdit={handleEditTrip}
                    resolveBus={resolveBus}
                    resolveDriver={resolveDriver}
                    resolveItinerary={resolveItinerary}
                />

                <CreateTripModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
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
                    buses={buses}
                    drivers={drivers}
                    itineraries={itineraries}
                />
            </div>
        </div>
    );

};

export default TripsManagement;