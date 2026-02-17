import React, {useEffect, useState} from 'react';
import { Bus, Navigation, X, Save } from 'lucide-react';

// Composant Modal d'ajout
export const ModalAjout = ({activeTab, showAddModal, setShowAddModal, modalMode = 'add', editingItem = null, onSave}) => {
    const [formData, setFormData] = useState({
        // ID field for editing
        id: null,
        // Bus fields
        busNumber: '',
        matriculation: '',
        capacity: '',
        busStatus: 'En service',
        // Station fields
        stationName: '',
        address: '',
        stationType: 'DEPARTURE',
        stationStatus: 'ACTIVE',
        latitude: '',
        longitude: ''
    });

    const [errors, setErrors] = useState({});

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        setFormData({
            id: null,
            busNumber: '',
            matriculation: '',
            capacity: '',
            busStatus: 'En service',
            stationName: '',
            address: '',
            stationType: 'DEPARTURE',
            stationStatus: 'ACTIVE',
            latitude: '',
            longitude: ''
        });
        setErrors({});
    };

    // Effet pour gérer le mode édition/ajout
    useEffect(() => {
        if (modalMode === 'edit' && editingItem) {
            console.log('EditingItem reçu:', editingItem); // Debug

            if (activeTab === 'bus') {
                // Priorité à 'id' puis 'busId'
                const busId = editingItem.id || editingItem.busId;
                console.log('Bus ID trouvé:', busId); // Debug

                setFormData({
                    id: busId,
                    busNumber: editingItem.bus_number || editingItem.busNumber || '',
                    matriculation: editingItem.immatriculation || editingItem.matriculation || '',
                    capacity: editingItem.capacity ? String(editingItem.capacity) : '',
                    busStatus: editingItem.status || 'En service',
                    // Reset station fields
                    stationName: '',
                    address: '',
                    stationType: 'DEPARTURE',
                    latitude: '',
                    longitude: '',
                    stationStatus: 'ACTIVE',
                });
            } else {
                // Pour les stations
                const stationId = editingItem.id || editingItem.stationId;
                console.log('Station ID trouvé:', stationId); // Debug

                setFormData({
                    id: stationId,
                    // Reset bus fields
                    busNumber: '',
                    matriculation: '',
                    capacity: '',
                    busStatus: 'En service',
                    // Station fields - attention aux noms de propriétés
                    stationName: editingItem.stationName || editingItem.station_name || editingItem.name || '',
                    address: editingItem.address || '',
                    stationType: editingItem.stationType || editingItem.station_type || editingItem.type || 'DEPARTURE',
                    latitude: editingItem.latitude ? String(editingItem.latitude) : '',
                    longitude: editingItem.longitude ? String(editingItem.longitude) : '',
                    stationStatus: editingItem.status || 'ACTIVE',
                });
            }
        } else if (modalMode === 'add') {
            resetForm();
        }
    }, [modalMode, editingItem, activeTab, showAddModal]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (activeTab === 'bus') {
            // Validate bus number as integer
            if (!formData.busNumber || !String(formData.busNumber).trim() || isNaN(parseInt(formData.busNumber)) || parseInt(formData.busNumber) <= 0) {
                newErrors.busNumber = 'Le numéro du bus doit être un entier positif';
            }
            if (!String(formData.matriculation || '').trim()) newErrors.matriculation = 'L\'immatriculation est requise';
            if (!formData.capacity || parseInt(formData.capacity) <= 0) newErrors.capacity = 'La capacité doit être supérieure à 0';
        } else {
            if (!String(formData.stationName || '').trim()) newErrors.stationName = 'Le nom de la station est requis';
            if (!String(formData.address || '').trim()) newErrors.address = 'L\'adresse est requise';

            // Validation des coordonnées
            const lat = parseFloat(formData.latitude);
            const lng = parseFloat(formData.longitude);

            if (!formData.latitude || isNaN(lat)) {
                newErrors.latitude = 'La latitude est requise et doit être un nombre';
            } else if (lat < -90 || lat > 90) {
                newErrors.latitude = 'La latitude doit être entre -90 et 90';
            }

            if (!formData.longitude || isNaN(lng)) {
                newErrors.longitude = 'La longitude est requise et doit être un nombre';
            } else if (lng < -180 || lng > 180) {
                newErrors.longitude = 'La longitude doit être entre -180 et 180';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Récupération sécurisée de l'ID
            const itemId = formData.id;

            console.log('=== DEBUG SUBMIT ===');
            console.log('Item ID:', itemId);
            console.log('Modal mode:', modalMode);
            console.log('Form data:', formData);

            // Vérification critique pour le mode édition
            if (modalMode === 'edit' && !itemId) {
                console.error('ERREUR: Pas d\'ID pour la modification!');
                alert('Erreur: Impossible de modifier - ID manquant');
                return;
            }

            // Préparer les données selon le type et le DTO
            // IMPORTANT: Ne pas inclure l'ID dans le body, il est dans l'URL
            const dataToSave = activeTab === 'bus' ? {
                // Respecter le DTO UpdateBusRequestDTO (sans ID)
                busNumber: parseInt(formData.busNumber),
                matriculation: formData.matriculation,
                capacity: parseInt(formData.capacity),
                status: formData.busStatus
            } : {
                // Respecter le DTO CreateStationRequestDTO (sans ID)
                stationName: formData.stationName,
                address: formData.address,
                stationType: formData.stationType,
                status: formData.stationStatus,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            console.log('Données à sauvegarder (sans ID):', dataToSave);

            // Pour le mode édition, passer l'ID séparément
            if (modalMode === 'edit') {
                // Ajouter l'ID comme propriété séparée pour la fonction onSave
                dataToSave.id = itemId;
            }

            // Appeler la fonction de sauvegarde
            if (onSave) {
                onSave(dataToSave, modalMode);
            }

            handleClose();
        }
    };


    const handleClose = () => {
        setShowAddModal(false);
        resetForm();
    };

    if (!showAddModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        {activeTab === 'bus' ? <Bus className="w-6 h-6 text-blue-600"/> :
                            <Navigation className="w-6 h-6 text-blue-600"/>}
                        {modalMode === 'edit' ? 'Modifier' : 'Nouveau'} {activeTab === 'bus' ? 'Bus' : 'Station'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === 'bus' ? (
                        <>
                            {/* Informations générales du bus */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Informations générales</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Numéro du bus *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            placeholder="ex: 1"
                                            value={formData.busNumber}
                                            onChange={(e) => handleInputChange('busNumber', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.busNumber ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.busNumber && <p className="text-red-500 text-xs mt-1">{errors.busNumber}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Plaque d'immatriculation *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: DLA-2001-CM"
                                            value={formData.matriculation}
                                            onChange={(e) => handleInputChange('matriculation', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.matriculation ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.matriculation && <p className="text-red-500 text-xs mt-1">{errors.matriculation}</p>}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Capacité (places) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="ex: 50"
                                        value={formData.capacity}
                                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.capacity ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                                </div>
                            </div>

                            {/* Affectation et statut */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Affectation et statut</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
                                    <select
                                        value={formData.busStatus}
                                        onChange={(e) => handleInputChange('busStatus', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="En service">En Service</option>
                                        <option value="En maintenance">En maintenance</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Informations générales de la station */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Informations générales</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom de la station *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ex: Gare Centrale"
                                        value={formData.stationName}
                                        onChange={(e) => handleInputChange('stationName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.stationName ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.stationName && <p className="text-red-500 text-xs mt-1">{errors.stationName}</p>}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adresse complète *
                                    </label>
                                    <textarea
                                        placeholder="ex: Avenue de la Liberté, Akwa, Douala"
                                        rows="3"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.address ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Latitude *
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="ex: 3.8480"
                                            value={formData.latitude}
                                            onChange={(e) => handleInputChange('latitude', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.latitude ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Longitude *
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="ex: 11.5021"
                                            value={formData.longitude}
                                            onChange={(e) => handleInputChange('longitude', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.longitude ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Configuration de la station */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type de station *</label>
                                        <select
                                            value={formData.stationType}
                                            onChange={(e) => handleInputChange('stationType', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="STOP">Arrêt Normal</option>
                                            <option value="TERMINUS">Terminus</option>
                                            <option value="DEPARTURE">Depart</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
                                        <select
                                            value={formData.stationStatus}
                                            onChange={(e) => handleInputChange('stationStatus', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="ACTIVE">Actif</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="INACTIVE">Inactif</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2"/>
                            {modalMode === 'edit' ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};