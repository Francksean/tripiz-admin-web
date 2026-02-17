import React from 'react';
import { MapPin, Clock, Users, ArrowRight, X, Route, Calendar, Info, Navigation, Timer } from 'lucide-react';

const ItineraireDetailsModal = ({ itineraire, isOpen, onClose, stations = [] }) => {
    if (!isOpen || !itineraire) return null;

    // Fonction pour obtenir le nom d'une station par son ID
    // Fonction pour obtenir le nom d'une station par son ID
    const getStationNameById = (stationId) => {
        if (!stationId) return 'Station non définie';
        const station = stations.find(s => s.stationId === stationId);
        return station ? station.stationName : stationId; // Retourne l'ID si le nom n'est pas trouvé
    };

    const getDirectionBadge = (direction) => {
        return direction === 'ALLER'
            ? 'bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium'
            : 'bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium';
    };

    // Utiliser les bonnes propriétés selon la structure de données
    const itineraireName = itineraire.itinerary_name || itineraire.itenary_name || 'Sans nom';
    const routeName = itineraire.route_name || 'Route non définie';
    const itineraireId = itineraire.itinerary_id || itineraire.itinerary_id || 'N/A';
    const distance = itineraire.distance || 0;
    const duration = itineraire.estimated_duration || 0;
    const direction = itineraire.direction || 'N/A';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* En-tête */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Route className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{itineraireName}</h2>
                                <p className="text-sm text-gray-600">{routeName} • ID: {itineraireId}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Statut et Direction */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className={getDirectionBadge(direction)}>
                            {direction}
                        </span>
                    </div>

                    {/* Informations générales */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            Informations générales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Navigation className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Distance totale</div>
                                        <div className="text-lg font-semibold text-gray-800">{distance} km</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Timer className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Durée estimée</div>
                                        <div className="text-lg font-semibold text-gray-800">
                                            {duration} min
                                            <span className="text-sm text-gray-500 ml-1">
                                                ({Math.floor(duration / 60)}h {duration % 60}min)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Vitesse moyenne</div>
                                        <div className="text-lg font-semibold text-gray-800">
                                            {duration > 0 ? Math.round((distance / duration) * 60) : 0} km/h
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parcours */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Parcours de l'itinéraire
                        </h3>

                        {/* Version responsive du parcours */}
                        <div className="space-y-4">
                            {/* Station de départ */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800 text-lg">Point de départ</div>
                                        <div className="text-gray-600">{getStationNameById(itineraire.departure_station)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Flèche de direction */}
                            <div className="flex items-center justify-center py-2">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="w-12 h-0.5 bg-gray-300"></div>
                                    <ArrowRight className="w-6 h-6" />
                                    <div className="w-12 h-0.5 bg-gray-300"></div>
                                </div>
                            </div>

                            {/* Informations du trajet */}
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-sm text-blue-700 font-medium">
                                    Trajet: {distance} km • {duration} minutes
                                </div>
                                <div className="text-xs text-blue-600 mt-1">
                                    Direction: {direction}
                                </div>
                            </div>

                            {/* Flèche de direction */}
                            <div className="flex items-center justify-center py-2">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="w-12 h-0.5 bg-gray-300"></div>
                                    <ArrowRight className="w-6 h-6" />
                                    <div className="w-12 h-0.5 bg-gray-300"></div>
                                </div>
                            </div>

                            {/* Station d'arrivée */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800 text-lg">Point d'arrivée</div>
                                        <div className="text-gray-600">{getStationNameById(itineraire.arrival_station)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraireDetailsModal;