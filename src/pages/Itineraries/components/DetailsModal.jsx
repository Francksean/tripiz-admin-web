import React from 'react';
import { MapPin, Clock, X, Route, Navigation, Timer } from 'lucide-react';

const ItineraireDetailsModal = ({ itineraire, isOpen, onClose, stations = [] }) => {
    if (!isOpen || !itineraire) return null;

    const getStationNameById = (stationId) => {
        if (!stationId) return 'Station non définie';
        const station = stations.find(s => s.stationId === stationId);
        return station ? station.stationName : stationId;
    };

    const itineraireName = itineraire.itinerary_name || itineraire.itenary_name || 'Sans nom';
    const routeName      = itineraire.route_name || 'Route non définie';
    const itineraireId   = itineraire.itinerary_id || 'N/A';
    const distance       = itineraire.distance || 0;
    const duration       = itineraire.estimated_duration || 0;
    const direction      = itineraire.direction || 'N/A';
    const avgSpeed       = duration > 0 ? Math.round((distance / duration) * 60) : 0;
    const hours          = Math.floor(duration / 60);
    const minutes        = duration % 60;
    const durationLabel  = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;

    const isAller = direction === 'ALLER';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">

                {/* ── En-tête ── */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Route className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-gray-900 truncate">{itineraireName}</h2>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {routeName}
                                <span className="mx-1.5">·</span>
                                ID : {itineraireId}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            isAller
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-purple-50 text-purple-700'
                        }`}>
                            {direction}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                                text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <div className="px-5 py-4 space-y-4">

                    {/* ── Métriques ── */}
                    <div className="grid grid-cols-3 gap-2.5">
                        {[
                            { icon: Navigation, label: 'Distance', value: distance, unit: 'km',   color: 'text-blue-600',   bg: 'bg-blue-50' },
                            { icon: Timer,      label: 'Durée',    value: durationLabel, unit: null, color: 'text-green-600',  bg: 'bg-green-50' },
                            { icon: Clock,      label: 'Vitesse moy.', value: avgSpeed, unit: 'km/h', color: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map(({ icon: Icon, label, value, unit, color, bg }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3">
                                <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                                </div>
                                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                <p className="text-base font-semibold text-gray-900 leading-tight">
                                    {value}{unit && <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Parcours ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-4">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            Parcours
                        </p>

                        <div className="flex gap-3">
                            {/* Timeline verticale */}
                            <div className="flex flex-col items-center pt-1 flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100" />
                                <div className="w-px flex-1 bg-gray-300 my-1.5" style={{ minHeight: '32px' }} />
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100" />
                            </div>

                            {/* Stations */}
                            <div className="flex-1 flex flex-col justify-between" style={{ gap: '24px' }}>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Départ</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getStationNameById(itineraire.departure_station)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Arrivée</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getStationNameById(itineraire.arrival_station)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Action ── */}
                    <div className="flex justify-end pt-1 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl
                                hover:bg-gray-50 transition-colors"
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