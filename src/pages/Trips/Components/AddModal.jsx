import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {X, Save, Calendar, Clock, MapPin, Bus, User, Route, AlertCircle, Map} from 'lucide-react';

const BUSES       = ['BUS001', 'BUS002', 'BUS003', 'BUS004', 'BUS005'];
const DRIVERS     = ['Jean Mballa', 'Marie Nkomo', 'Paul Etame', 'Alice Ngono', 'Pierre Fouda'];
const ROUTES      = ['Ligne A', 'Ligne B', 'Ligne C', 'Ligne D'];
const ITINERARIES = [
    'Douala Central - Bonabéri',
    'Akwa - Makepe',
    'Bassa - Ndokoti',
    'Bonamoussadi - New Bell',
    'Makepe - Bonabéri',
];

const EMPTY_FORM = {
    bus_number: '',
    driver_name: '',
    itinerary_name: '',
    trip_date: '',
    schedule_departure_time: '',
    schedule_arrival_time: '',
    route_name: '',
    trip_status: 'PROGRAMME',
};

// ── Composants hors composant principal ──────────────────────────────────────
const Field = ({ label, icon: Icon, error, children }) => (
    <div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
            {Icon && <Icon size={13} className="text-gray-400" />}
            {label}
        </label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const getInputCls = (hasError) =>
    `w-full px-3 py-2 text-sm border rounded-lg bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
    ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`;

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
    </div>
);

// ── Composant principal ───────────────────────────────────────────────────────
export const CreateTripModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors]     = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(EMPTY_FORM);
            setErrors({});
            setSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!formData.bus_number)              e.bus_number = 'Requis';
        if (!formData.driver_name)             e.driver_name = 'Requis';
        if (!formData.route_name)              e.route_name = 'Requis';
        if (!formData.itinerary_name)          e.itinerary_name = 'Requis';
        if (!formData.trip_date)               e.trip_date = 'Requise';
        if (!formData.schedule_departure_time) e.schedule_departure_time = 'Requise';
        if (!formData.schedule_arrival_time)   e.schedule_arrival_time = 'Requise';
        if (formData.schedule_departure_time && formData.schedule_arrival_time &&
            formData.schedule_departure_time >= formData.schedule_arrival_time)
            e.schedule_arrival_time = "L'arrivée doit être après le départ";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            onSave({
                ...formData,
                trip_id: Date.now(),
                actual_departure_time: null,
                actual_arrival_time: null,
                passenger_count: 0,
            });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    const hasErrors = Object.keys(errors).length > 0;

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* ── En-tête ── */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Map className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Nouveau trajet</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Planifier un nouveau trajet</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                            text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

                    {/* Erreurs globales */}
                    {hasErrors && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700">Veuillez corriger les champs manquants.</p>
                        </div>
                    )}

                    {/* ── Bus & Chauffeur ── */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={Bus} title="Affectation" />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Numéro du bus *" icon={Bus} error={errors.bus_number}>
                                <select
                                    value={formData.bus_number}
                                    onChange={(e) => handleChange('bus_number', e.target.value)}
                                    className={getInputCls(!!errors.bus_number)}
                                >
                                    <option value="">Sélectionner…</option>
                                    {BUSES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </Field>
                            <Field label="Chauffeur *" icon={User} error={errors.driver_name}>
                                <select
                                    value={formData.driver_name}
                                    onChange={(e) => handleChange('driver_name', e.target.value)}
                                    className={getInputCls(!!errors.driver_name)}
                                >
                                    <option value="">Sélectionner…</option>
                                    {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </Field>
                        </div>
                    </div>

                    {/* ── Ligne & Itinéraire ── */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={MapPin} title="Parcours" />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Ligne *" icon={Route} error={errors.route_name}>
                                <select
                                    value={formData.route_name}
                                    onChange={(e) => handleChange('route_name', e.target.value)}
                                    className={getInputCls(!!errors.route_name)}
                                >
                                    <option value="">Sélectionner…</option>
                                    {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </Field>
                            <Field label="Itinéraire *" icon={MapPin} error={errors.itinerary_name}>
                                <select
                                    value={formData.itinerary_name}
                                    onChange={(e) => handleChange('itinerary_name', e.target.value)}
                                    className={getInputCls(!!errors.itinerary_name)}
                                >
                                    <option value="">Sélectionner…</option>
                                    {ITINERARIES.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </Field>
                        </div>
                    </div>

                    {/* ── Date & Statut ── */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={Calendar} title="Planification" />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Date du trajet *" icon={Calendar} error={errors.trip_date}>
                                <input
                                    type="date"
                                    value={formData.trip_date}
                                    onChange={(e) => handleChange('trip_date', e.target.value)}
                                    className={getInputCls(!!errors.trip_date)}
                                />
                            </Field>
                            <Field label="Statut">
                                <select
                                    value={formData.trip_status}
                                    onChange={(e) => handleChange('trip_status', e.target.value)}
                                    className={getInputCls(false)}
                                >
                                    <option value="PROGRAMME">Programmé</option>
                                    <option value="EN_COURS">En cours</option>
                                    <option value="TERMINE">Terminé</option>
                                    <option value="ANNULE">Annulé</option>
                                </select>
                            </Field>
                        </div>

                        {/* Horaires */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Départ prévu *" icon={Clock} error={errors.schedule_departure_time}>
                                <input
                                    type="time"
                                    value={formData.schedule_departure_time}
                                    onChange={(e) => handleChange('schedule_departure_time', e.target.value)}
                                    className={getInputCls(!!errors.schedule_departure_time)}
                                />
                            </Field>
                            <Field label="Arrivée prévue *" icon={Clock} error={errors.schedule_arrival_time}>
                                <input
                                    type="time"
                                    value={formData.schedule_arrival_time}
                                    onChange={(e) => handleChange('schedule_arrival_time', e.target.value)}
                                    className={getInputCls(!!errors.schedule_arrival_time)}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-2.5 pt-1 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl
                                hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white
                                bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={14} />
                            Créer le trajet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};