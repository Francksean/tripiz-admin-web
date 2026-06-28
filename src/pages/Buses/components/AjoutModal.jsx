import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bus, Navigation, X, Save, MapPin } from 'lucide-react';
import LocationAutocomplete from "./LocationAutoCompletion.jsx";

// ── Composants définis HORS du composant principal pour éviter
//    la perte de focus à chaque keystroke ─────────────────────────────────────
const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const Section = ({ title }) => (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
);

// inputCls est une fonction pure, pas un composant, donc elle peut rester dedans
// mais on la sort quand même pour la clarté
const getInputCls = (hasError) =>
    `w-full px-3 py-2 text-sm border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
    ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`;

// ─────────────────────────────────────────────────────────────────────────────
export const ModalAjout = ({ activeTab, showAddModal, setShowAddModal, modalMode = 'add', editingItem = null, onSave }) => {
    const [formData, setFormData] = useState({
        id: null,
        busNumber: '', matriculation: '', capacity: '', busStatus: 'En service',
        stationName: '', address: '', stationType: 'DEPARTURE', stationStatus: 'ACTIVE',
        location: null,
    });
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setFormData({
            id: null,
            busNumber: '', matriculation: '', capacity: '', busStatus: 'En service',
            stationName: '', address: '', stationType: 'DEPARTURE', stationStatus: 'ACTIVE',
            location: null,
        });
        setErrors({});
    };

    useEffect(() => {
        if (modalMode === 'edit' && editingItem) {
            if (activeTab === 'bus') {
                setFormData({
                    id: editingItem.id || editingItem.busId,
                    busNumber: editingItem.bus_number || editingItem.busNumber || '',
                    matriculation: editingItem.immatriculation || editingItem.matriculation || '',
                    capacity: editingItem.capacity ? String(editingItem.capacity) : '',
                    busStatus: editingItem.status || 'En service',
                    stationName: '', address: '', stationType: 'DEPARTURE', stationStatus: 'ACTIVE', location: null,
                });
            } else {
                const existingLocation = (editingItem.latitude && editingItem.longitude) ? {
                    name: editingItem.address || editingItem.stationName || 'Localisation existante',
                    latitude: parseFloat(editingItem.latitude),
                    longitude: parseFloat(editingItem.longitude),
                } : null;
                setFormData({
                    id: editingItem.id || editingItem.stationId,
                    busNumber: '', matriculation: '', capacity: '', busStatus: 'En service',
                    stationName: editingItem.stationName || editingItem.station_name || editingItem.name || '',
                    address: editingItem.address || '',
                    stationType: editingItem.stationType || editingItem.station_type || 'DEPARTURE',
                    stationStatus: editingItem.status || 'ACTIVE',
                    location: existingLocation,
                });
            }
        } else if (modalMode === 'add') {
            resetForm();
        }
    }, [modalMode, editingItem, activeTab, showAddModal]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleLocationChange = (locationObj) => {
        setFormData(prev => ({ ...prev, location: locationObj }));
        if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (activeTab === 'bus') {
            if (!formData.busNumber || isNaN(parseInt(formData.busNumber)) || parseInt(formData.busNumber) <= 0)
                newErrors.busNumber = 'Le numéro doit être un entier positif';
            if (!String(formData.matriculation || '').trim())
                newErrors.matriculation = "L'immatriculation est requise";
            if (!formData.capacity || parseInt(formData.capacity) <= 0)
                newErrors.capacity = 'La capacité doit être supérieure à 0';
        } else {
            if (!String(formData.stationName || '').trim())
                newErrors.stationName = 'Le nom de la station est requis';
            if (!String(formData.address || '').trim())
                newErrors.address = "L'adresse est requise";
            if (!formData.location?.latitude)
                newErrors.location = 'Veuillez sélectionner une localisation dans la liste';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const itemId = formData.id;
        if (modalMode === 'edit' && !itemId) { alert('Erreur: ID manquant'); return; }

        const dataToSave = activeTab === 'bus' ? {
            busNumber: parseInt(formData.busNumber),
            matriculation: formData.matriculation,
            capacity: parseInt(formData.capacity),
            status: formData.busStatus,
        } : {
            stationName: formData.stationName,
            address: formData.address,
            stationType: formData.stationType,
            status: formData.stationStatus,
            latitude: formData.location.latitude,
            longitude: formData.location.longitude,
        };
        if (modalMode === 'edit') dataToSave.id = itemId;
        if (onSave) onSave(dataToSave, modalMode);
        handleClose();
    };

    const handleClose = () => { setShowAddModal(false); resetForm(); };

    if (!showAddModal) return null;

    const isBus = activeTab === 'bus';

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* ── En-tête ── */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            {isBus
                                ? <Bus className="w-4 h-4 text-blue-600" />
                                : <Navigation className="w-4 h-4 text-blue-600" />
                            }
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                {modalMode === 'edit' ? 'Modifier' : 'Nouveau'} {isBus ? 'bus' : 'station'}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {modalMode === 'edit' ? 'Modifier les informations' : 'Remplir les informations'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                            text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">
                    {isBus ? (
                        <>
                            {/* ── Bus : Informations ── */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <Section title="Informations générales" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Numéro du bus *" error={errors.busNumber}>
                                        <input
                                            type="number" min="1" step="1" placeholder="1"
                                            value={formData.busNumber}
                                            onChange={(e) => handleInputChange('busNumber', e.target.value)}
                                            className={getInputCls(!!errors.busNumber)}
                                        />
                                    </Field>
                                    <Field label="Immatriculation *" error={errors.matriculation}>
                                        <input
                                            type="text" placeholder="DLA-2001-CM"
                                            value={formData.matriculation}
                                            onChange={(e) => handleInputChange('matriculation', e.target.value)}
                                            className={getInputCls(!!errors.matriculation)}
                                        />
                                    </Field>
                                </div>
                                <Field label="Capacité (places) *" error={errors.capacity}>
                                    <div className="relative">
                                        <input
                                            type="number" min="1" placeholder="50"
                                            value={formData.capacity}
                                            onChange={(e) => handleInputChange('capacity', e.target.value)}
                                            className={`${getInputCls(!!errors.capacity)} pr-14`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">places</span>
                                    </div>
                                </Field>
                            </div>

                            {/* ── Bus : Statut ── */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <Section title="Statut" />
                                <Field label="Statut actuel *">
                                    <select
                                        value={formData.busStatus}
                                        onChange={(e) => handleInputChange('busStatus', e.target.value)}
                                        className={getInputCls(false)}
                                    >
                                        <option value="En service">En service</option>
                                        <option value="En maintenance">En maintenance</option>
                                    </select>
                                </Field>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* ── Station : Informations ── */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <Section title="Informations générales" />
                                <Field label="Nom de la station *" error={errors.stationName}>
                                    <input
                                        type="text" placeholder="Gare Centrale"
                                        value={formData.stationName}
                                        onChange={(e) => handleInputChange('stationName', e.target.value)}
                                        className={getInputCls(!!errors.stationName)}
                                    />
                                </Field>
                                <Field label="Adresse complète *" error={errors.address}>
                                    <textarea
                                        placeholder="Avenue de la Liberté, Akwa, Douala"
                                        rows="2"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className={`${getInputCls(!!errors.address)} resize-none`}
                                    />
                                </Field>
                                <LocationAutocomplete
                                    label="Localisation"
                                    value={formData.location}
                                    onChange={handleLocationChange}
                                    placeholder="Ex: Bastos, Yaoundé ou Akwa, Douala"
                                    required
                                    error={errors.location}
                                />
                                {formData.location?.latitude && (
                                    <div className="p-2.5 bg-green-50 border border-green-100 rounded-lg flex items-start gap-2">
                                        <MapPin size={13} className="text-green-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-green-700">
                                            <p className="font-medium">{formData.location.name}</p>
                                            <p className="font-mono text-green-500 text-[11px]">
                                                {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Station : Configuration ── */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <Section title="Configuration" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Type de station *">
                                        <select
                                            value={formData.stationType}
                                            onChange={(e) => handleInputChange('stationType', e.target.value)}
                                            className={getInputCls(false)}
                                        >
                                            <option value="STOP">Arrêt normal</option>
                                            <option value="TERMINUS">Terminus</option>
                                            <option value="DEPARTURE">Départ</option>
                                        </select>
                                    </Field>
                                    <Field label="Statut *">
                                        <select
                                            value={formData.stationStatus}
                                            onChange={(e) => handleInputChange('stationStatus', e.target.value)}
                                            className={getInputCls(false)}
                                        >
                                            <option value="ACTIVE">Actif</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="INACTIVE">Inactif</option>
                                        </select>
                                    </Field>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-2.5 pt-1 border-t border-gray-100">
                        <button
                            type="button" onClick={handleClose}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <Save size={14} />
                            {modalMode === 'edit' ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};