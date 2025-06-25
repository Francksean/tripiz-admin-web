import React, { useState, useEffect } from 'react';
import { X, Save, Route, MapPin, Clock, CreditCard, FileText } from 'lucide-react';

const ItineraireEditModal = ({ itineraire, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        itenary_name: '',
        route_id: '',
        direction: '',
        departure_station: '',
        arrival_station: '',
        distance: '',
        estimated_duration: '',
        ticket_price: '',
        status: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    // Initialiser les données du formulaire quand l'itinéraire change
    useEffect(() => {
        if (itineraire) {
            setFormData({
                itenary_name: itineraire.itenary_name || '',
                route_id: itineraire.route_id || '',
                direction: itineraire.direction || '',
                departure_station: itineraire.departure_station || '',
                arrival_station: itineraire.arrival_station || '',
                distance: itineraire.distance || '',
                estimated_duration: itineraire.estimated_duration || '',
                ticket_price: itineraire.ticket_price || '',
                status: itineraire.status || '',
                description: itineraire.description || ''
            });
        }
    }, [itineraire]);

    if (!isOpen || !itineraire) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Ici vous pouvez ajouter la logique de sauvegarde
            await onSave({ ...itineraire, ...formData });
            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const routes = [
        { id: 1, name: 'Ligne A' },
        { id: 2, name: 'Ligne B' },
        { id: 3, name: 'Ligne C' },
        { id: 4, name: 'Ligne D' }
    ];

    const stations = [
        'Gare Centrale',
        'Rond-point Akwa',
        'Marché Bassa',
        'Place du Gouvernement',
        'Marché Bonabéri',
        'Carrefour Makepe',
        'Station Ndokoti',
        'Marché Kotto'
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* En-tête */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Route className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Modifier l'itinéraire</h2>
                                <p className="text-sm text-gray-600">{itineraire.route_name} • ID: {itineraire.itinary_id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Informations générales */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-orange-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Informations générales</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de l'itinéraire *
                                </label>
                                <input
                                    type="text"
                                    name="itenary_name"
                                    value={formData.itenary_name}
                                    onChange={handleInputChange}
                                    placeholder="ex: Centre-ville → Aéroport"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ligne associée *
                                </label>
                                <select
                                    name="route_id"
                                    value={formData.route_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionner une ligne</option>
                                    {routes.map(route => (
                                        <option key={route.id} value={route.id}>{route.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Direction *
                                </label>
                                <select
                                    name="direction"
                                    value={formData.direction}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionner une direction</option>
                                    <option value="ALLER">ALLER</option>
                                    <option value="RETOUR">RETOUR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionner un statut</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="MAINTENANCE">MAINTENANCE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Stations */}
                    <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-orange-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Stations</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Station de départ *
                                </label>
                                <select
                                    name="departure_station"
                                    value={formData.departure_station}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionner la station de départ</option>
                                    {stations.map(station => (
                                        <option key={station} value={station}>{station}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Station d'arrivée *
                                </label>
                                <select
                                    name="arrival_station"
                                    value={formData.arrival_station}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionner la station d'arrivée</option>
                                    {stations.map(station => (
                                        <option key={station} value={station}>{station}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Détails du parcours */}
                    <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Détails du parcours</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Distance (km) *
                                </label>
                                <input
                                    type="number"
                                    name="distance"
                                    value={formData.distance}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    placeholder="12.5"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Durée estimée (minutes) *
                                </label>
                                <input
                                    type="number"
                                    name="estimated_duration"
                                    value={formData.estimated_duration}
                                    onChange={handleInputChange}
                                    placeholder="45"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prix du ticket (FCFA) *
                                </label>
                                <input
                                    type="number"
                                    name="ticket_price"
                                    value={formData.ticket_price}
                                    onChange={handleInputChange}
                                    placeholder="500"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Description de l'itinéraire..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
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