import React from 'react';
import { createPortal } from 'react-dom';
import { X, Edit, Bus, User, Users, MapPin, Clock } from 'lucide-react';

// ── Helpers hors composant ────────────────────────────────────────────────────
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

const getDelay = (scheduled, actual) => {
    if (!actual || !scheduled) return null;
    const diff = (new Date(`2024-01-01T${actual}`) - new Date(`2024-01-01T${scheduled}`)) / 60000;
    if (diff <= 5)  return { text: "À l'heure",      cls: 'text-green-600' };
    if (diff <= 15) return { text: 'Léger retard',    cls: 'text-amber-600' };
    return            { text: 'Retard important', cls: 'text-red-600' };
};

// ── Composant ─────────────────────────────────────────────────────────────────
export const TripDetailModal = ({ trip, isOpen, onClose, onEdit }) => {
    if (!isOpen || !trip) return null;

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* ── En-tête ── */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Bus className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Trajet <span className="text-gray-400 font-normal">#{trip.trip_id}</span>
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">{trip.trip_date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${STATUS_STYLE[trip.trip_status] || 'bg-gray-100 text-gray-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[trip.trip_status] || 'bg-gray-400'}`} />
                            {STATUS_LABEL[trip.trip_status] || trip.trip_status}
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
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                                <Bus className="w-3.5 h-3.5 text-blue-600"/>
                            </div>
                            <p className="text-[10px] text-gray-400">Bus</p>
                            <p className="text-sm font-semibold text-gray-900">{trip.bus_number}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center mb-2">
                                <User className="w-3.5 h-3.5 text-green-600"/>
                            </div>
                            <p className="text-[10px] text-gray-400">Chauffeur</p>
                            <p className="text-xs font-semibold text-gray-900 leading-tight">{trip.driver_name}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center mb-2">
                                <Users className="w-3.5 h-3.5 text-purple-600"/>
                            </div>
                            <p className="text-[10px] text-gray-400">Passagers</p>
                            <p className="text-sm font-semibold text-gray-900">{trip.passenger_count}</p>
                        </div>
                    </div>

                    {/* ── Parcours ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
                            <MapPin className="w-3.5 h-3.5 text-blue-600"/>
                            Parcours
                        </p>
                        <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                            <span className="text-xs text-gray-400">Ligne</span>
                            <span className="text-xs font-medium text-gray-800">{trip.route_name}</span>
                        </div>
                        <div className="flex items-start justify-between py-1.5">
                            <span className="text-xs text-gray-400 flex-shrink-0">Itinéraire</span>
                            <span
                                className="text-xs font-medium text-gray-800 text-right ml-4">{trip.itinerary_name}</span>
                        </div>
                    </div>

                    {/* ── Horaires ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
                            <Clock className="w-3.5 h-3.5 text-blue-600"/>
                            Horaires
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            {[
                                {label: 'Départ prévu', time: trip.schedule_departure_time},
                                {label: 'Arrivée prévue', time: trip.schedule_arrival_time},
                            ].map(({label, time}) => (
                                <div key={label}>
                                    <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                                    <p className="text-base font-semibold text-gray-900">{fmt(time)}</p>
                                </div>
                            ))}
                        </div>
                        {(trip.actual_departure_time || trip.actual_arrival_time) && (
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                                {[
                                    {
                                        label: 'Départ réel',
                                        scheduled: trip.schedule_departure_time,
                                        actual: trip.actual_departure_time
                                    },
                                    {
                                        label: 'Arrivée réelle',
                                        scheduled: trip.schedule_arrival_time,
                                        actual: trip.actual_arrival_time
                                    },
                                ].map(({label, scheduled, actual}) => {
                                    const delay = getDelay(scheduled, actual);
                                    return (
                                        <div key={label}>
                                            <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                                            <p className="text-base font-semibold text-green-600">{fmt(actual)}</p>
                                            {delay && <p className={`text-[10px] mt-0.5 ${delay.cls}`}>{delay.text}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-1 border-t border-gray-100">
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