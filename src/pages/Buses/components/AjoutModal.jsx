import React, {useEffect, useState} from 'react';
import { Bus, Navigation, X, Save } from 'lucide-react';

// Composant Modal d'ajout
export const ModalAjout = ({activeTab, showAddModal, setShowAddModal, routesData, modalMode = 'add', editingItem = null, onSave}) => {
    const [formData, setFormData] = useState({
        // Bus fields
        bus_number: '',
        immatriculation: '',
        capacity: '',
        status: 'DISPONIBLE',
        modele: '',
        route_id: '',
        chauffeur: '',
        // Station fields
        station_name: '',
        address: '',
        station_type: 'ARRET_NORMAL',
        gps_coordinates: '',
        quartier: '',
        equipements: []
    });

    const [errors, setErrors] = useState({});

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        setFormData({
            bus_number: '',
            immatriculation: '',
            capacity: '',
            status: 'DISPONIBLE',
            modele: '',
            route_id: '',
            chauffeur: '',
            station_name: '',
            address: '',
            station_type: 'ARRET_NORMAL',
            gps_coordinates: '',
            quartier: '',
            equipements: []
        });
        setErrors({});
    };

    // Effet pour gérer le mode édition/ajout
    useEffect(() => {
        if (modalMode === 'edit' && editingItem) {
            if (activeTab === 'bus') {
                setFormData({
                    bus_number: editingItem.bus_number || '',
                    immatriculation: editingItem.immatriculation || '',
                    capacity: editingItem.capacity ? String(editingItem.capacity) : '',
                    status: editingItem.status || 'DISPONIBLE',
                    modele: editingItem.modele || '',
                    route_id: editingItem.route_id || '',
                    chauffeur: editingItem.chauffeur || '',
                    // Garder les champs station vides
                    station_name: '',
                    address: '',
                    station_type: 'ARRET_NORMAL',
                    gps_coordinates: '',
                    quartier: '',
                    equipements: []
                });
            } else {
                setFormData({
                    // Garder les champs bus vides
                    bus_number: '',
                    immatriculation: '',
                    capacity: '',
                    status: 'DISPONIBLE',
                    modele: '',
                    route_id: '',
                    chauffeur: '',
                    // Pré-remplir les champs station
                    station_name: editingItem.station_name || '',
                    address: editingItem.address || '',
                    station_type: editingItem.station_type || 'ARRET_NORMAL',
                    gps_coordinates: editingItem.gps_coordinates || '',
                    quartier: editingItem.quartier || '',
                    equipements: Array.isArray(editingItem.equipements) ? editingItem.equipements : []
                });
            }
        } else if (modalMode === 'add') {
            // Mode ajout - réinitialiser le formulaire
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

    const handleEquipementChange = (equipement) => {
        setFormData(prev => ({
            ...prev,
            equipements: prev.equipements.includes(equipement)
                ? prev.equipements.filter(e => e !== equipement)
                : [...prev.equipements, equipement]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (activeTab === 'bus') {
            if (!formData.bus_number.trim()) newErrors.bus_number = 'Le numéro du bus est requis';
            if (!formData.immatriculation.trim()) newErrors.immatriculation = 'L\'immatriculation est requise';
            if (!formData.capacity || parseInt(formData.capacity) <= 0) newErrors.capacity = 'La capacité doit être supérieure à 0';
            if (!formData.modele.trim()) newErrors.modele = 'Le modèle est requis';
        } else {
            if (!formData.station_name.trim()) newErrors.station_name = 'Le nom de la station est requis';
            if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
            if (!formData.gps_coordinates.trim()) newErrors.gps_coordinates = 'Les coordonnées GPS sont requises';
            if (!formData.quartier.trim()) newErrors.quartier = 'Le quartier est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Préparer les données selon le type
            const dataToSave = activeTab === 'bus' ? {
                bus_number: formData.bus_number,
                immatriculation: formData.immatriculation,
                capacity: parseInt(formData.capacity),
                status: formData.status,
                modele: formData.modele,
                route_id: formData.route_id || null,
                chauffeur: formData.chauffeur || null,
                // Inclure l'ID si c'est une édition
                ...(modalMode === 'edit' && editingItem ? { id: editingItem.id } : {})
            } : {
                station_name: formData.station_name,
                address: formData.address,
                station_type: formData.station_type,
                gps_coordinates: formData.gps_coordinates,
                quartier: formData.quartier,
                equipements: formData.equipements,
                status: formData.status || 'ACTIVE',
                // Inclure l'ID si c'est une édition
                ...(modalMode === 'edit' && editingItem ? { id: editingItem.id } : {})
            };

            // Appeler la fonction de sauvegarde si elle est fournie
            if (onSave) {
                onSave(dataToSave, modalMode);
            } else {
                // Fallback - afficher dans la console
                console.log('Données à sauvegarder:', dataToSave);
                alert(`${activeTab === 'bus' ? 'Bus' : 'Station'} ${modalMode === 'edit' ? 'modifié(e)' : 'ajouté(e)'} avec succès !`);
            }

            handleClose();
        }
    };

    const handleClose = () => {
        setShowAddModal(false);
        resetForm();
    };

    const equipementsDisponibles = ['Abri', 'Bancs', 'Éclairage', 'Panneau info', 'WC', 'Distributeur', 'Wi-Fi', 'Caméra'];

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
                                            type="text"
                                            placeholder="ex: BUS001"
                                            value={formData.bus_number}
                                            onChange={(e) => handleInputChange('bus_number', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.bus_number ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.bus_number && <p className="text-red-500 text-xs mt-1">{errors.bus_number}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Plaque d'immatriculation *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: DLA-2001-CM"
                                            value={formData.immatriculation}
                                            onChange={(e) => handleInputChange('immatriculation', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.immatriculation ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.immatriculation && <p className="text-red-500 text-xs mt-1">{errors.immatriculation}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Modèle du bus *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: Mercedes Citaro"
                                            value={formData.modele}
                                            onChange={(e) => handleInputChange('modele', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.modele ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.modele && <p className="text-red-500 text-xs mt-1">{errors.modele}</p>}
                                    </div>
                                    <div>
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
                            </div>

                            {/* Affectation et statut */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Affectation et statut</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="DISPONIBLE">Disponible</option>
                                            <option value="EN_SERVICE">En Service</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="HORS_SERVICE">Hors Service</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ligne assignée</label>
                                        <select
                                            value={formData.route_id}
                                            onChange={(e) => handleInputChange('route_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Sélectionner une ligne</option>
                                            {routesData && routesData.map((route) => (
                                                <option key={route.route_id} value={route.route_id}>
                                                    {route.route_name} - {route.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chauffeur assigné</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Pierre Mbarga"
                                        value={formData.chauffeur}
                                        onChange={(e) => handleInputChange('chauffeur', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
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
                                        value={formData.station_name}
                                        onChange={(e) => handleInputChange('station_name', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.station_name ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.station_name && <p className="text-red-500 text-xs mt-1">{errors.station_name}</p>}
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
                                            Quartier *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: Akwa"
                                            value={formData.quartier}
                                            onChange={(e) => handleInputChange('quartier', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.quartier ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.quartier && <p className="text-red-500 text-xs mt-1">{errors.quartier}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Coordonnées GPS *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: 4.0511°N, 9.7679°E"
                                            value={formData.gps_coordinates}
                                            onChange={(e) => handleInputChange('gps_coordinates', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.gps_coordinates ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.gps_coordinates && <p className="text-red-500 text-xs mt-1">{errors.gps_coordinates}</p>}
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
                                            value={formData.station_type}
                                            onChange={(e) => handleInputChange('station_type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="ARRET_NORMAL">Arrêt Normal</option>
                                            <option value="TERMINUS">Terminus</option>
                                            <option value="CORRESPONDANCE">Correspondance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="ACTIVE">Actif</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="INACTIVE">Inactif</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Équipements */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Équipements disponibles</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {equipementsDisponibles.map((equipement) => (
                                        <label key={equipement} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.equipements.includes(equipement)}
                                                onChange={() => handleEquipementChange(equipement)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{equipement}</span>
                                        </label>
                                    ))}
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