import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Route, MapPin, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';

// ── Composants définis HORS du composant principal ───────────────────────────
const Field = ({ label, error, children, half = false }) => (
    <div className={half ? 'w-1/2 pr-1.5' : ''}>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    </div>
);

const inputCls = `w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`;

const ItineraireAddModal = ({ isOpen, onClose, onSubmit, stations = [], loadingStations = false }) => {
    const [formData, setFormData] = useState({
        itinerary_name: '',
        route_name: '',
        direction: '',
        departure_station: '',
        arrival_station: '',
        distance: '',
        estimated_duration: '',
        ticketPrice: '',
    });
    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Reset à chaque ouverture
    useEffect(() => {
        if (isOpen) {
            setFormData({
                itinerary_name: '',
                route_name: '',
                direction: '',
                departure_station: '',
                arrival_station: '',
                distance: '',
                estimated_duration: '',
                ticketPrice: '',
            });
            setErrors([]);
            setSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors.length > 0) setErrors([]);
    };

    const validate = () => {
        const errs = [];
        if (!formData.itinerary_name.trim())   errs.push("Le nom de l'itinéraire est requis");
        if (!formData.route_name.trim())        errs.push('Le nom de la ligne est requis');
        if (!formData.direction)                errs.push('La direction est requise');
        if (!formData.departure_station)        errs.push('La station de départ est requise');
        if (!formData.arrival_station)          errs.push("La station d'arrivée est requise");
        if (formData.departure_station && formData.arrival_station &&
            formData.departure_station === formData.arrival_station)
            errs.push("Les stations de départ et d'arrivée doivent être différentes");
        if (!formData.distance || parseFloat(formData.distance) <= 0)
            errs.push('La distance doit être un nombre positif');
        if (!formData.estimated_duration || parseInt(formData.estimated_duration) <= 0)
            errs.push('La durée estimée doit être un nombre positif');
        if (!formData.ticketPrice || parseInt(formData.ticketPrice) <= 0)
            errs.push('La prix du ticket doit être un nombre positif');
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (validationErrors.length > 0) { setErrors(validationErrors); return; }

        setSubmitting(true);
        setErrors([]);
        try {
            await onSubmit({
                itinerary_name:     formData.itinerary_name,
                route_name:         formData.route_name,
                direction:          formData.direction,
                departure_station:  formData.departure_station,
                arrival_station:    formData.arrival_station,
                distance:           parseFloat(formData.distance),
                estimated_duration: parseInt(formData.estimated_duration),
                ticketPrice: parseInt(formData.ticketPrice),
            });
            onClose();
        } catch (err) {
            setErrors([err.message || 'Erreur lors de la création']);
        } finally {
            setSubmitting(false);
        }
    };

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
                            <Route className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Nouvel itinéraire</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Remplir les informations du parcours</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                            text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">

                    {/* ── Erreurs ── */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex gap-3">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <ul className="space-y-0.5">
                                {errors.map((err, i) => (
                                    <li key={i} className="text-xs text-red-700">{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── Informations générales ── */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={FileText} title="Informations générales" />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Nom de l'itinéraire *">
                                <input
                                    type="text"
                                    name="itinerary_name"
                                    value={formData.itinerary_name}
                                    onChange={handleChange}
                                    placeholder="Centre-ville → Aéroport"
                                    className={inputCls}
                                    disabled={submitting}
                                />
                            </Field>
                            <Field label="Nom de la ligne *">
                                <input
                                    type="text"
                                    name="route_name"
                                    value={formData.route_name}
                                    onChange={handleChange}
                                    placeholder="Ligne A"
                                    className={inputCls}
                                    disabled={submitting}
                                />
                            </Field>
                        </div>
                        <Field label="Direction *" half>
                            <select
                                name="direction"
                                value={formData.direction}
                                onChange={handleChange}
                                className={inputCls}
                                disabled={submitting}
                            >
                                <option value="">Sélectionner…</option>
                                <option value="ALLER">Aller</option>
                                <option value="RETOUR">Retour</option>
                            </select>
                        </Field>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── Stations ── */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={MapPin} title="Stations" />
                        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                            <Field label="Départ *">
                                <select
                                    name="departure_station"
                                    value={formData.departure_station}
                                    onChange={handleChange}
                                    className={inputCls}
                                    disabled={submitting || loadingStations}
                                >
                                    <option value="">
                                        {loadingStations ? 'Chargement…' : 'Sélectionner…'}
                                    </option>
                                    {stations.map(s => (
                                        <option key={s.stationId} value={s.stationId}>{s.stationName}</option>
                                    ))}
                                </select>
                            </Field>

                            {/* Flèche centrale */}
                            <div className="flex items-center justify-center pb-2">
                                <div className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6h8M7 3l3 3-3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>

                            <Field label="Arrivée *">
                                <select
                                    name="arrival_station"
                                    value={formData.arrival_station}
                                    onChange={handleChange}
                                    className={inputCls}
                                    disabled={submitting || loadingStations}
                                >
                                    <option value="">
                                        {loadingStations ? 'Chargement…' : 'Sélectionner…'}
                                    </option>
                                    {stations.map(s => (
                                        <option key={s.stationId} value={s.stationId}>{s.stationName}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── Détails du parcours ── */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={Clock} title="Détails du parcours" />
                        <div className="grid grid-cols-3 gap-3">
                            <Field label="Distance *">
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="distance"
                                        value={formData.distance}
                                        onChange={handleChange}
                                        step="0.1" min="0"
                                        placeholder="12.5"
                                        className={`${inputCls} pr-10`}
                                        disabled={submitting}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">km</span>
                                </div>
                            </Field>
                            <Field label="Durée estimée *">
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="estimated_duration"
                                        value={formData.estimated_duration}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="45"
                                        className={`${inputCls} pr-12`}
                                        disabled={submitting}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">min</span>
                                </div>
                            </Field>
                            <Field label="Prix *">
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="ticketPrice"
                                        value={formData.ticketPrice}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="45"
                                        className={`${inputCls} pr-12`}
                                        disabled={submitting}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">FCFA</span>
                                </div>
                            </Field>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-2.5 pt-1 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl
                                hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                            {submitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Création…
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    Créer l'itinéraire
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default ItineraireAddModal;