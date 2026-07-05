import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Calendar, Clock, MapPin, Bus, User, AlertCircle, Map } from 'lucide-react';

const EMPTY_FORM = {
    bus_id: '',
    driver_id: '',
    itinerary_id: '',
    trip_date: '',
    schedule_departure: '',
    schedule_arrival: '',
    trip_status: 'PROGRAMME',
    passenger_count: 0
};

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

// Ajout des propriétés buses, drivers, itineraries reçues du parent
export const CreateTripModal = ({ isOpen, onClose, onSave, buses = [], drivers = [], itineraries = [] }) => {
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
        if (!formData.bus_id)             e.bus_id = 'Requis';
        if (!formData.driver_id)          e.driver_id = 'Requis';
        if (!formData.itinerary_id)       e.itinerary_id = 'Requis';
        if (!formData.trip_date)          e.trip_date = 'Requise';
        if (!formData.schedule_departure) e.schedule_departure = 'Requise';
        if (!formData.schedule_arrival)   e.schedule_arrival = 'Requise';

        if (formData.schedule_departure && formData.schedule_arrival &&
            formData.schedule_departure >= formData.schedule_arrival) {
            e.schedule_arrival = "L'arrivée doit être après le départ";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            // Ajout des secondes attendues par les formats Time de l'API (:00)
            const payload = {
                ...formData,
                schedule_departure: formData.schedule_departure.length === 5 ? `${formData.schedule_departure}:00` : formData.schedule_departure,
                schedule_arrival: formData.schedule_arrival.length === 5 ? `${formData.schedule_arrival}:00` : formData.schedule_arrival,
                actual_departure: "08:05:00", // Valeur par défaut requise ou optionnelle selon votre logique
                passenger_count: Number(formData.passenger_count) || 0
            };

            await onSave(payload);
            onClose();
        } catch (err) {
            console.error(err);
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

                {/* En-tête */}
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

                    {hasErrors && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700">Veuillez corriger les champs manquants ou erronés.</p>
                        </div>
                    )}

                    {/* Affectation Bus & Chauffeur */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={Bus} title="Affectation" />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Sélectionner le bus *" icon={Bus} error={errors.bus_id}>
                                <select
                                    value={formData.bus_id}
                                    onChange={(e) => handleChange('bus_id', e.target.value)}
                                    className={getInputCls(!!errors.bus_id)}
                                >
                                    <option value="">Sélectionner…</option>
                                    {buses.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                                </select>
                            </Field>
                            <Field label="Chauffeur *" icon={User} error={errors.driver_id}>
                                <select
                                    value={formData.driver_id}
                                    onChange={(e) => handleChange('driver_id', e.target.value)}
                                    className={getInputCls(!!errors.driver_id)}
                                >
                                    <option value="">Sélectionner…</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                                </select>
                            </Field>
                        </div>
                    </div>

                    {/* Parcours / Itinéraire */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={MapPin} title="Parcours" />
                        <Field label="Itinéraire de la ligne *" icon={MapPin} error={errors.itinerary_id}>
                            <select
                                value={formData.itinerary_id}
                                onChange={(e) => handleChange('itinerary_id', e.target.value)}
                                className={getInputCls(!!errors.itinerary_id)}
                            >
                                <option value="">Sélectionner un itinéraire…</option>
                                {itineraries.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                            </select>
                        </Field>
                    </div>

                    {/* Planification Temporelle */}
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

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Départ prévu *" icon={Clock} error={errors.schedule_departure}>
                                <input
                                    type="time"
                                    value={formData.schedule_departure}
                                    onChange={(e) => handleChange('schedule_departure', e.target.value)}
                                    className={getInputCls(!!errors.schedule_departure)}
                                />
                            </Field>
                            <Field label="Arrivée prévue *" icon={Clock} error={errors.schedule_arrival}>
                                <input
                                    type="time"
                                    value={formData.schedule_arrival}
                                    onChange={(e) => handleChange('schedule_arrival', e.target.value)}
                                    className={getInputCls(!!errors.schedule_arrival)}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-2.5 pt-1 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={14} />
                            {submitting ? 'Création...' : 'Créer le trajet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};