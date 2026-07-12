import React, { useState, useEffect } from 'react';
import { X, Save, Route, MapPin, Clock, FileText, AlertCircle } from 'lucide-react';

const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs text-gray-500 mb-1.5 font-medium">{label}</label>
        {children}
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

const inputCls = `w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
    bg-white text-gray-800 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:bg-gray-50 transition-colors`;

const ItineraireEditModal = ({ itineraire, isOpen, onClose, onSave, stations = [] }) => {
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

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (itineraire) {
            setFormData({
                itinerary_name: itineraire.itinerary_name || itineraire.itenary_name || '',
                route_name: itineraire.route_name || '',
                direction: itineraire.direction || '',
                departure_station: itineraire.departure_station || '',
                arrival_station: itineraire.arrival_station || '',
                distance: itineraire.distance || '',
                estimated_duration: itineraire.estimated_duration || '',
                // Le backend renvoie "ticket_price" (snake_case) — on garde ticketPrice en fallback
                // au cas où d'autres endpoints renverraient du camelCase.
                ticketPrice: itineraire.ticket_price ?? itineraire.ticketPrice ?? '',
            });
        }
    }, [itineraire]);

    useEffect(() => {
        if (isOpen) setErrors([]);
    }, [isOpen]);

    if (!isOpen || !itineraire) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors.length > 0) setErrors([]);
    };

    const validateForm = () => {
        const newErrors = [];
        if (!formData.itinerary_name.trim())        newErrors.push("Le nom de l'itinéraire est requis");
        if (!formData.route_name.trim())             newErrors.push('Le nom de la ligne est requis');
        if (!formData.direction)                     newErrors.push('La direction est requise');
        if (!formData.departure_station)             newErrors.push('La station de départ est requise');
        if (!formData.arrival_station)               newErrors.push("La station d'arrivée est requise");
        if (formData.departure_station && formData.arrival_station &&
            formData.departure_station === formData.arrival_station)
            newErrors.push("Les stations de départ et d'arrivée doivent être différentes");
        if (!formData.distance || parseFloat(formData.distance) <= 0)
            newErrors.push('La distance doit être un nombre positif');
        if (!formData.estimated_duration || parseInt(formData.estimated_duration) <= 0)
            newErrors.push('La durée estimée doit être un nombre positif');
        if (!formData.ticketPrice || parseInt(formData.ticketPrice) <= 0)
            newErrors.push('La prix du ticket doit être un nombre positif');
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (validationErrors.length > 0) { setErrors(validationErrors); return; }

        setIsLoading(true);
        setErrors([]);
        try {
            const updatedItineraire = {
                ...itineraire,
                itinerary_name:     formData.itinerary_name,
                route_name:         formData.route_name,
                direction:          formData.direction,
                departure_station:  formData.departure_station,
                arrival_station:    formData.arrival_station,
                distance:           parseFloat(formData.distance),
                estimated_duration: parseInt(formData.estimated_duration),
                // On renvoie ticket_price (nom attendu par le backend), en gardant
                // ticketPrice aussi au cas où un endpoint attendrait le camelCase.
                ticket_price: parseInt(formData.ticketPrice),
                ticketPrice:  parseInt(formData.ticketPrice),
            };
            await onSave(updatedItineraire);
            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setErrors([error.message || 'Erreur lors de la sauvegarde']);
        } finally {
            setIsLoading(false);
        }
    };

    const getStationNameById = (stationId) => {
        if (!stationId) return 'Station non définie';
        const station = stations.find(s => s.stationId === stationId);
        return station ? station.stationName : stationId;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* ── En-tête ── */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Route className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Modifier l'itinéraire</h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {itineraire.route_name}
                                    <span className="mx-1.5">·</span>
                                    ID : {itineraire.itinerary_id || itineraire.itinary_id}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
                                text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">

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

                    {/* ── Section : Informations générales ── */}
                    <section>
                        <SectionHeader icon={FileText} title="Informations générales" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <Field label="Nom de l'itinéraire *">
                                <input
                                    type="text"
                                    name="itinerary_name"
                                    value={formData.itinerary_name}
                                    onChange={handleInputChange}
                                    placeholder="Centre-ville → Aéroport"
                                    className={inputCls}
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field label="Nom de la ligne *">
                                <input
                                    type="text"
                                    name="route_name"
                                    value={formData.route_name}
                                    onChange={handleInputChange}
                                    placeholder="Ligne A"
                                    className={inputCls}
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                        </div>
                        <div className="w-1/2 pr-1.5">
                            <Field label="Direction *">
                                <select
                                    name="direction"
                                    value={formData.direction}
                                    onChange={handleInputChange}
                                    className={inputCls}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Sélectionner…</option>
                                    <option value="ALLER">ALLER</option>
                                    <option value="RETOUR">RETOUR</option>
                                </select>
                            </Field>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* ── Section : Stations ── */}
                    <section>
                        <SectionHeader icon={MapPin} title="Stations" />
                        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                            <Field label="Départ *">
                                <select
                                    name="departure_station"
                                    value={formData.departure_station}
                                    onChange={handleInputChange}
                                    className={inputCls}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Sélectionner…</option>
                                    {stations.map(s => (
                                        <option key={s.stationId} value={s.stationId}>{s.stationName}</option>
                                    ))}
                                </select>
                                {formData.departure_station && (
                                    <p className="text-xs text-gray-400 mt-1 truncate">
                                        {getStationNameById(formData.departure_station)}
                                    </p>
                                )}
                            </Field>

                            {/* Flèche centrale */}
                            <div className="flex items-center justify-center pb-2">
                                <div className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6h8M7 3l3 3-3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>

                            <Field label="Arrivée *">
                                <select
                                    name="arrival_station"
                                    value={formData.arrival_station}
                                    onChange={handleInputChange}
                                    className={inputCls}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Sélectionner…</option>
                                    {stations.map(s => (
                                        <option key={s.stationId} value={s.stationId}>{s.stationName}</option>
                                    ))}
                                </select>
                                {formData.arrival_station && (
                                    <p className="text-xs text-gray-400 mt-1 truncate">
                                        {getStationNameById(formData.arrival_station)}
                                    </p>
                                )}
                            </Field>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* ── Section : Détails du parcours ── */}
                    <section>
                        <SectionHeader icon={Clock} title="Détails du parcours" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Field label="Distance *">
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="distance"
                                        value={formData.distance}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        placeholder="12.5"
                                        className={`${inputCls} pr-10`}
                                        required
                                        disabled={isLoading}
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
                                        onChange={handleInputChange}
                                        min="1"
                                        placeholder="45"
                                        className={`${inputCls} pr-12`}
                                        required
                                        disabled={isLoading}
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
                                        onChange={handleInputChange}
                                        min="1"
                                        placeholder="45"
                                        className={`${inputCls} pr-12`}
                                        required
                                        disabled={isLoading}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">FCFA</span>
                                </div>
                            </Field>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl
                                hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-xl
                                hover:bg-blue-700 transition-colors flex items-center gap-2
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sauvegarde…
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    Sauvegarder
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItineraireEditModal;