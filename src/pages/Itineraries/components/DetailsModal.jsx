import React from 'react';
import { MapPin, Clock, Users, ArrowRight, X, Route, Calendar, CreditCard, Info } from 'lucide-react';

const ItineraireDetailsModal = ({ itineraire, isOpen, onClose }) => {
    if (!isOpen || !itineraire) return null;

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium';
            case 'MAINTENANCE':
                return 'bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium';
            case 'INACTIVE':
                return 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium';
            default:
                return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium';
        }
    };

    const getDirectionBadge = (direction) => {
        return direction === 'ALLER'
            ? 'bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium'
            : 'bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium';
    };

    const formatWeekdays = (weekdays) => {
        if (weekdays === 'LMMJVSD') return 'Tous les jours';
        if (weekdays === 'LMMJV') return 'Semaine';
        if (weekdays === 'SD') return 'Weekend';
        return weekdays;
    };

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
                                <h2 className="text-xl font-bold text-gray-800">{itineraire.itenary_name}</h2>
                                <p className="text-sm text-gray-600">{itineraire.route_name} • ID: {itineraire.itinary_id}</p>
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
                    <div className="flex items-center gap-4">
                        <span className={getStatusBadge(itineraire.status)}>
                            {itineraire.status}
                        </span>
                        <span className={getDirectionBadge(itineraire.direction)}>
                            {itineraire.direction}
                        </span>
                    </div>

                    {/* Informations générales */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            Informations générales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Distance</div>
                                <div className="text-lg font-semibold text-gray-800">{itineraire.distance} km</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Durée estimée</div>
                                <div className="text-lg font-semibold text-gray-800">{itineraire.estimated_duration} min</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Prix du ticket</div>
                                <div className="text-lg font-semibold text-blue-600">{itineraire.ticket_price} FCFA</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Horaires</div>
                                <div className="text-lg font-semibold text-gray-800">{itineraire.schedules.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* Parcours */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Parcours
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    <div>
                                        <div className="font-semibold text-gray-800">Station de départ</div>
                                        <div className="text-sm text-gray-600">{itineraire.departure_station}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 mx-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-gray-300"></div>
                                    <ArrowRight className="w-6 h-6 text-gray-400" />
                                    <div className="w-8 h-0.5 bg-gray-300"></div>
                                </div>
                                <div className="text-xs text-gray-500 text-center mt-1">
                                    {itineraire.distance} km
                                </div>
                            </div>
                            <div className="flex-1 text-right">
                                <div className="flex items-center gap-3 mb-2 justify-end">
                                    <div>
                                        <div className="font-semibold text-gray-800">Station d'arrivée</div>
                                        <div className="text-sm text-gray-600">{itineraire.arrival_station}</div>
                                    </div>
                                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horaires */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Horaires de service
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Départ</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Arrivée</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Jours</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Durée</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {itineraire.schedules.map((schedule, index) => (
                                        <tr key={index} className="border-b border-gray-100 last:border-b-0">
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-gray-800">{schedule.departure_time}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-gray-800">{schedule.arrival_time}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                                        {formatWeekdays(schedule.weekdays)}
                                                    </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-gray-600">{itineraire.estimated_duration} min</div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {itineraire.description && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-gray-700 leading-relaxed">{itineraire.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
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