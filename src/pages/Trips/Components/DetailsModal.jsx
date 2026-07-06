import React from 'react';
import { createPortal } from 'react-dom';
import { X, Edit, Bus, User, Users, MapPin, Clock } from 'lucide-react';

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

export const TripDetailModal = ({ trip, isOpen, onClose, onEdit, resolveBus, resolveDriver, resolveItinerary }) => {
    if (!isOpen || !trip) return null;

    const busId   = trip.bus_id || trip.busId;
    const drvId   = trip.driver_id || trip.driverId;
    const itiId   = trip.itinerary_id || trip.itineraryId;
    const status  = trip.trip_status || trip.status;

    const busLabel = resolveBus ? resolveBus(busId) : (trip.bus_number || busId || '—');
    const drvLabel = resolveDriver ? resolveDriver(drvId) : (trip.driver_name || drvId || '—');
    const itiLabel = resolveItinerary ? resolveItinerary(itiId) : (trip.itinerary_name || itiId || '—');

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* En-tête */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Bus className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Trajet <span className="text-gray-400 font-normal">#{trip.trip_id || trip.id}</span>
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">{trip.trip_date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[status] || 'bg-gray-400'}`} />
                            {STATUS_LABEL[status] || status}
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

                    {/* Métriques */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                                <Bus className="w-3.5 h-3.5 text-blue-600"/>
                            </div>
                            <p className="text-[10px] text-gray-400">Bus</p>
                            <p className="text-sm font-semibold text-gray-900">{busLabel}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center mb-2">
                                <User className="w-3.5 h-3.5 text-green-600"/>
                            </div>
                            <p className="text-[10px] text-gray-400">Chauffeur</p>
                            <p className="text-xs font-semibold text-gray-900 leading-tight">{drvLabel}</p>
                        </div>
                    </div>

                    {/* Parcours */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
                            <MapPin className="w-3.5 h-3.5 text-blue-600"/>
                            Parcours
                        </p>
                        <div className="flex items-start justify-between py-1.5">
                            <span className="text-xs text-gray-400 flex-shrink-0">Itinéraire</span>
                            <span className="text-xs font-medium text-gray-800 text-right ml-4">{itiLabel}</span>
                        </div>
                    </div>

                    {/* Horaires */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
                            <Clock className="w-3.5 h-3.5 text-blue-600"/>
                            Heure de départ
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <p className="text-[10px] text-gray-400 mb-0.5">Départ</p>
                                <p className="text-base font-semibold text-gray-900">{fmt(trip.schedule_departure)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-1 border-t border-gray-100">
                        <button
                            onClick={() => onEdit && onEdit(trip)}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <Edit size={14} />
                            Modifier
                        </button>
                        <button
                            onClick={onClose}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};