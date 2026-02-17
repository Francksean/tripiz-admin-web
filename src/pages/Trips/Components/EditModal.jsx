// Modal pour modifier un trajet existant
import {useEffect, useState} from "react";
import {X, Bus, User, Route, MapPin, Calendar, Clock, Save} from 'lucide-react';

export const EditTripModal = ({ isOpen, onClose, onSave, trip }) => {
    const [formData, setFormData] = useState({
        bus_number: '',
        driver_name: '',
        itinerary_name: '',
        trip_date: '',
        schedule_departure_time: '',
        schedule_arrival_time: '',
        actual_departure_time: '',
        actual_arrival_time: '',
        route_name: '',
        trip_status: 'PROGRAMME',
        passenger_count: 0
    });

    const [errors, setErrors] = useState({});

    // Données simulées pour les sélecteurs
    const buses = ['BUS001', 'BUS002', 'BUS003', 'BUS004', 'BUS005'];
    const drivers = ['Jean Mballa', 'Marie Nkomo', 'Paul Etame', 'Alice Ngono', 'Pierre Fouda'];
    const routes = ['Ligne A', 'Ligne B', 'Ligne C', 'Ligne D'];
    const itineraries = [
        'Douala Central - Bonabéri',
        'Akwa - Makepe',
        'Bassa - Ndokoti',
        'Bonamoussadi - New Bell',
        'Makepe - Bonabéri'
    ];

    // Charger les données du trajet quand le modal s'ouvre
    useEffect(() => {
        if (isOpen && trip) {
            setFormData({
                bus_number: trip.bus_number || '',
                driver_name: trip.driver_name || '',
                itinerary_name: trip.itinerary_name || '',
                trip_date: trip.trip_date || '',
                schedule_departure_time: trip.schedule_departure_time || '',
                schedule_arrival_time: trip.schedule_arrival_time || '',
                actual_departure_time: trip.actual_departure_time || '',
                actual_arrival_time: trip.actual_arrival_time || '',
                route_name: trip.route_name || '',
                trip_status: trip.trip_status || 'PROGRAMME',
                passenger_count: trip.passenger_count || 0
            });
        }
    }, [isOpen, trip]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bus_number) newErrors.bus_number = 'Le numéro du bus est requis';
        if (!formData.driver_name) newErrors.driver_name = 'Le chauffeur est requis';
        if (!formData.itinerary_name) newErrors.itinerary_name = 'L\'itinéraire est requis';
        if (!formData.trip_date) newErrors.trip_date = 'La date est requise';
        if (!formData.schedule_departure_time) newErrors.schedule_departure_time = 'L\'heure de départ prévue est requise';
        if (!formData.schedule_arrival_time) newErrors.schedule_arrival_time = 'L\'heure d\'arrivée prévue est requise';
        if (!formData.route_name) newErrors.route_name = 'La ligne est requise';

        // Validation des heures prévues
        if (formData.schedule_departure_time && formData.schedule_arrival_time) {
            if (formData.schedule_departure_time >= formData.schedule_arrival_time) {
                newErrors.schedule_arrival_time = 'L\'heure d\'arrivée prévue doit être après l\'heure de départ prévue';
            }
        }

        // Validation des heures réelles si renseignées
        if (formData.actual_departure_time && formData.actual_arrival_time) {
            if (formData.actual_departure_time >= formData.actual_arrival_time) {
                newErrors.actual_arrival_time = 'L\'heure d\'arrivée réelle doit être après l\'heure de départ réelle';
            }
        }

        // Validation du nombre de passagers
        if (formData.passenger_count < 0) {
            newErrors.passenger_count = 'Le nombre de passagers ne peut pas être négatif';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const updatedTrip = {
                ...trip,
                ...formData,
                passenger_count: parseInt(formData.passenger_count)
            };
            onSave(updatedTrip);
            onClose();
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen || !trip) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Modifier le Trajet #{trip.trip_id}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Première ligne - Bus et Chauffeur */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Bus size={16} className="text-gray-400" />
                                Numéro du Bus
                            </label>
                            <select
                                value={formData.bus_number}
                                onChange={(e) => handleChange('bus_number', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.bus_number ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Sélectionner un bus</option>
                                {buses.map(bus => (
                                    <option key={bus} value={bus}>{bus}</option>
                                ))}
                            </select>
                            {errors.bus_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.bus_number}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <User size={16} className="text-gray-400" />
                                Chauffeur
                            </label>
                            <select
                                value={formData.driver_name}
                                onChange={(e) => handleChange('driver_name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.driver_name ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Sélectionner un chauffeur</option>
                                {drivers.map(driver => (
                                    <option key={driver} value={driver}>{driver}</option>
                                ))}
                            </select>
                            {errors.driver_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.driver_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Deuxième ligne - Ligne et Itinéraire */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Route size={16} className="text-gray-400" />
                                Ligne
                            </label>
                            <select
                                value={formData.route_name}
                                onChange={(e) => handleChange('route_name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.route_name ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Sélectionner une ligne</option>
                                {routes.map(route => (
                                    <option key={route} value={route}>{route}</option>
                                ))}
                            </select>
                            {errors.route_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.route_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <MapPin size={16} className="text-gray-400" />
                                Itinéraire
                            </label>
                            <select
                                value={formData.itinerary_name}
                                onChange={(e) => handleChange('itinerary_name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.itinerary_name ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Sélectionner un itinéraire</option>
                                {itineraries.map(itinerary => (
                                    <option key={itinerary} value={itinerary}>{itinerary}</option>
                                ))}
                            </select>
                            {errors.itinerary_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.itinerary_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Troisième ligne - Date, Statut et Passagers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Calendar size={16} className="text-gray-400" />
                                Date du Trajet
                            </label>
                            <input
                                type="date"
                                value={formData.trip_date}
                                onChange={(e) => handleChange('trip_date', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.trip_date ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.trip_date && (
                                <p className="text-red-500 text-sm mt-1">{errors.trip_date}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Statut
                            </label>
                            <select
                                value={formData.trip_status}
                                onChange={(e) => handleChange('trip_status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="PROGRAMME">Programmé</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="TERMINE">Terminé</option>
                                <option value="ANNULE">Annulé</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <User size={16} className="text-gray-400" />
                                Nombre de Passagers
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.passenger_count}
                                onChange={(e) => handleChange('passenger_count', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.passenger_count ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.passenger_count && (
                                <p className="text-red-500 text-sm mt-1">{errors.passenger_count}</p>
                            )}
                        </div>
                    </div>

                    {/* Section Horaires Prévus */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Horaires Prévus</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock size={16} className="text-gray-400" />
                                    Heure de Départ Prévue
                                </label>
                                <input
                                    type="time"
                                    value={formData.schedule_departure_time}
                                    onChange={(e) => handleChange('schedule_departure_time', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.schedule_departure_time ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.schedule_departure_time && (
                                    <p className="text-red-500 text-sm mt-1">{errors.schedule_departure_time}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock size={16} className="text-gray-400" />
                                    Heure d'Arrivée Prévue
                                </label>
                                <input
                                    type="time"
                                    value={formData.schedule_arrival_time}
                                    onChange={(e) => handleChange('schedule_arrival_time', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.schedule_arrival_time ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.schedule_arrival_time && (
                                    <p className="text-red-500 text-sm mt-1">{errors.schedule_arrival_time}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section Horaires Réels */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Horaires Réels (Optionnel)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock size={16} className="text-green-400" />
                                    Heure de Départ Réelle
                                </label>
                                <input
                                    type="time"
                                    value={formData.actual_departure_time}
                                    onChange={(e) => handleChange('actual_departure_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock size={16} className="text-green-400" />
                                    Heure d'Arrivée Réelle
                                </label>
                                <input
                                    type="time"
                                    value={formData.actual_arrival_time}
                                    onChange={(e) => handleChange('actual_arrival_time', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.actual_arrival_time ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.actual_arrival_time && (
                                    <p className="text-red-500 text-sm mt-1">{errors.actual_arrival_time}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Save size={16} />
                            Sauvegarder les Modifications
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};