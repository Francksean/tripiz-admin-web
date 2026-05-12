import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Clock, Users, Filter, Eye, Settings, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { itineraryService } from "../../../Services/ItineraireService.js";
import ItineraireEditModal from "./EditModal.jsx";
import ItineraireDetailsModal from "./DetailsModal.jsx";
import { stationService } from "../../../Services/StationService.js";


const ItinerairesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [directionFilter, setDirectionFilter] = useState('Toutes les directions');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItineraire, setSelectedItineraire] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    // États à ajouter (s'ils ne sont pas déjà présents)
    const [stations, setStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(false);

    // useEffect modifié
    useEffect(() => {
        loadData();
        testApiConnection();
        loadStations(); // Utilise loadStations
    }, []);

    // États pour les données de l'API
    const [itineraires, setItineraires] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        maintenance: 0,
        totalDistance: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiConnected, setApiConnected] = useState(false);

    // États pour le formulaire d'ajout
    const [formData, setFormData] = useState({
        route_name: '',
        direction: '',
        itinerary_name: '',
        departure_station: '', // UUID de la station de départ
        arrival_station: '',   // UUID de la station d'arrivée
        distance: '',
        estimated_duration: '',
    });
    const [formErrors, setFormErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const testApiConnection = async () => {
        try {
            await itineraryService.testConnection();
            setApiConnected(true);
        } catch (error) {
            console.warn('API non disponible, mode déconnecté');
            setApiConnected(false);
        }
    };

    // Fonction pour obtenir le nom d'une station par son ID
    const getStationNameById = (stationId) => {
        if (!stationId) return 'Station non définie';
        const station = stations.find(s => s.stationId === stationId);
        return station ? station.stationName : stationId; // Retourne l'ID si le nom n'est pas trouvé
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Charger tous les itinéraires
            const itinerariesData = await itineraryService.getAllItineraries();
            setItineraires(itinerariesData);

            // Calculer les statistiques
            await calculateStats(itinerariesData);

        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setError('Impossible de charger les données. ' + error.message);
            // En cas d'erreur, initialiser avec des données vides
            setItineraires([]);
            setStats({ total: 0, active: 0, maintenance: 0, totalDistance: 0 });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = async (itinerariesData) => {
        try {
            // Calculs locaux en cas d'échec des endpoints spécifiques
            const total = itinerariesData.length;
            const active = itinerariesData.filter(it => it.status === 'ACTIVE').length;
            const maintenance = itinerariesData.filter(it => it.status === 'MAINTENANCE').length;
            const totalDistance = itinerariesData.reduce((sum, it) => sum + (parseFloat(it.distance) || 0), 0);

            setStats({
                total,
                active,
                maintenance,
                totalDistance: parseFloat(totalDistance.toFixed(1))
            });

        } catch (error) {
            console.warn('Erreur calcul statistiques:', error);
            // Statistiques par défaut en cas d'erreur
            setStats({ total: 0, active: 0, maintenance: 0, totalDistance: 0 });
        }
    };

    const handleViewDetails = (itineraire) => {
        setSelectedItineraire(itineraire);
        setShowDetailsModal(true);
    };

    const handleEditItineraire = (itineraire) => {
        setSelectedItineraire(itineraire);
        setShowEditModal(true);
    };

    const handleDeleteItineraire = async (itineraireId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet itinéraire ?')) {
            return;
        }

        try {
            await itineraryService.deleteItinerary(itineraireId);
            // Recharger les données après suppression
            await loadData();
        } catch (error) {
            alert('Erreur lors de la suppression: ' + error.message);
        }
    };

    const handleSaveItineraire = async (updatedItineraire) => {
        try {
            await itineraryService.updateItinerary(updatedItineraire.itinerary_id, updatedItineraire);
            setShowEditModal(false);
            setSelectedItineraire(null);
            // Recharger les données après modification
            await loadData();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde: ' + error.message);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitNewItinerary = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors([]);

        try {
            // Valider les données
            const validation = itineraryService.validateItineraryData(formData);
            if (!validation.isValid) {
                setFormErrors(validation.errors);
                return;
            }

            // Dans handleSubmitNewItinerary, modifier la création de newItinerary :
            const newItinerary = {
                route_name: formData.route_name,
                direction: formData.direction,
                itinerary_name: formData.itinerary_name,
                departure_station: formData.departure_station, // UUID déjà sélectionné
                arrival_station: formData.arrival_station,     // UUID déjà sélectionné
                distance: parseFloat(formData.distance),
                estimated_duration: parseInt(formData.estimated_duration)
                // Note: description n'est pas dans le DTO, donc on ne l'envoie pas
            };

            await itineraryService.createItinerary(newItinerary);

            // Réinitialiser le formulaire et fermer le modal
            // Dans handleSubmitNewItinerary, réinitialisation :
            setFormData({
                route_name: '',
                direction: '',
                itinerary_name: '',
                departure_station: '',
                arrival_station: '',
                distance: '',
                estimated_duration: '',
                description: ''
            });
            setShowAddModal(false);

            // Recharger les données
            await loadData();

        } catch (error) {
            console.error('Erreur lors de la création:', error);
            setFormErrors([error.message]);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItineraires = itineraires.filter(itineraire =>
        (itineraire.itinerary_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            itineraire.route_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (directionFilter === 'Toutes les directions' || itineraire.direction === directionFilter)
    );

    // Modifier la fonction loadStations pour utiliser le bon service :
    const loadStations = async () => {
        setLoadingStations(true);
        try {
            const stationsData = await stationService.getAllStations(); // Utiliser itineraryService si la méthode y est
            setStations(stationsData);
        } catch (error) {
            console.error('Erreur lors du chargement des stations:', error);
            setStations([]);
        } finally {
            setLoadingStations(false);
        }
    };

    const getDirectionBadge = (direction) => {
        return direction === 'ALLER'
            ? 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium'
            : 'bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium';
    };

    const statsCards = [
        { label: 'Total Itinéraires', value: stats.total.toString(), color: 'bg-blue-100 text-blue-600', icon: '🚌' },
        { label: 'Distance Totale', value: `${stats.totalDistance} km`, color: 'bg-purple-100 text-purple-600', icon: '📏' }
    ];

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">
                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Itinéraires</h1>
                            <p className="text-gray-600 mt-1 text-sm">
                                Gérez les itinéraires, lignes et parcours de bus
                                {/*{!apiConnected && (*/}
                                {/*    <span className="ml-2 text-orange-600 text-xs">*/}
                                {/*        (Mode déconnecté)*/}
                                {/*    </span>*/}
                                {/*)}*/}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/*<button*/}
                            {/*    onClick={loadData}*/}
                            {/*    className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"*/}
                            {/*    disabled={loading}*/}
                            {/*>*/}
                            {/*    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />*/}
                            {/*    Actualiser*/}
                            {/*</button>*/}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvel Itinéraire
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
                    {statsCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                </div>
                                <div
                                    className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher un itinéraire ou une ligne..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-400" />
                            <select
                                value={directionFilter}
                                onChange={(e) => setDirectionFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option>Toutes les directions</option>
                                <option>ALLER</option>
                                <option>RETOUR</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des itinéraires */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Itinéraire</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Parcours</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Détails</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(4)].map((_, i) => (
                                        <tr key={i} className="border-b border-gray-100">
                                            <td className="py-3 px-4">
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                                                    <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
                                                    <div className="h-5 bg-gray-100 rounded animate-pulse w-14" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-2">
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-28" />
                                                    <div className="h-3 bg-gray-100 rounded animate-pulse w-4 mx-auto" />
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-28" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-2">
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
                                                    <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
                                                    <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredItineraires.map((itineraire) => (
                                        <tr key={itineraire.itinerary_id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-sm">
                                                        {itineraire.itinerary_name || itineraire.itenary_name || 'Sans nom'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {itineraire.route_name || 'Route non définie'}
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className={getDirectionBadge(itineraire.direction)}>
                                                            {itineraire.direction || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <MapPin size={12} className="text-green-500" />
                                                        <span className="text-gray-700 font-medium">
                                                            {getStationNameById(itineraire.departure_station)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <ArrowRight size={14} className="text-gray-400" />
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <MapPin size={12} className="text-red-500" />
                                                        <span className="text-gray-700 font-medium">
                                                            {getStationNameById(itineraire.arrival_station)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-1 text-xs">
                                                    <div className="text-gray-700">
                                                        <span
                                                            className="font-medium">Distance:</span> {itineraire.distance || 0} km
                                                    </div>
                                                    <div className="text-gray-700">
                                                        <span
                                                            className="font-medium">Durée:</span> {itineraire.estimated_duration || 0} min
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleViewDetails(itineraire)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Voir détails">
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditItineraire(itineraire)}
                                                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                                        title="Modifier">
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItineraire(itineraire.itinary_id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Supprimer">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredItineraires.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">🚌</div>
                            {itineraires.length === 0 ? (
                                <>
                                    <p>Aucun itinéraire configuré</p>
                                    <p className="text-sm mt-1">Commencez par créer votre premier itinéraire</p>
                                </>
                            ) : (
                                <>
                                    <p>Aucun itinéraire trouvé</p>
                                    <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal d'ajout */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Créer un Nouvel Itinéraire</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Erreurs de validation */}
                            {formErrors.length > 0 && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <span className="text-red-800 font-medium">Erreurs de validation :</span>
                                    </div>
                                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                                        {formErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={handleSubmitNewItinerary} className="space-y-6">
                                {/* Informations générales */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Informations générales</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom de l'itinéraire *
                                            </label>
                                            <input
                                                type="text"
                                                name="itinerary_name"
                                                value={formData.itinerary_name}
                                                onChange={handleFormChange}
                                                placeholder="ex: Centre-ville → Aéroport"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom de la ligne *
                                            </label>
                                            <input
                                                type="text"
                                                name="route_name"
                                                value={formData.route_name}
                                                onChange={handleFormChange}
                                                placeholder="ex: Ligne A"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Direction *
                                        </label>
                                        <select
                                            name="direction"
                                            value={formData.direction}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Sélectionner une direction</option>
                                            <option value="ALLER">ALLER</option>
                                            <option value="RETOUR">RETOUR</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Stations */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Stations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Station de départ *
                                            </label>
                                            <select
                                                name="departure_station"
                                                value={formData.departure_station}
                                                onChange={handleFormChange}
                                                onFocus={() => {
                                                    if (stations.length === 0 && !loadingStations) {
                                                        loadStations();
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                                disabled={loadingStations}
                                            >
                                                <option value="">
                                                    {loadingStations ? 'Chargement...' : 'Sélectionner une station de départ'}
                                                </option>
                                                {stations.map((station) => (
                                                    <option key={station.stationId} value={station.stationId}>
                                                        {station.stationName}
                                                    </option>
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
                                                onChange={handleFormChange}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                                disabled={loadingStations}
                                            >
                                                <option value="">
                                                    {loadingStations ? 'Chargement...' : 'Sélectionner une station d\'arrivée'}
                                                </option>
                                                {stations.map((station) => (
                                                    <option key={station.stationId} value={station.stationId}>
                                                        {station.stationName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Détails du parcours */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Détails du parcours</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Distance (km) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                name="distance"
                                                value={formData.distance}
                                                onChange={handleFormChange}
                                                placeholder="12.5"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                onChange={handleFormChange}
                                                placeholder="45"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`px-6 py-2 rounded-lg transition-colors ${submitting
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {submitting ? 'Création...' : 'Créer l\'itinéraire'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            {/* Modals */}
            <ItineraireDetailsModal
                itineraire={selectedItineraire}
                isOpen={showDetailsModal}
                stations={stations} // Ajouter cette ligne pour passer les stations
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedItineraire(null);
                }}
            />

            <ItineraireEditModal
                itineraire={selectedItineraire}
                isOpen={showEditModal}
                stations={stations} // Optionnel : si le modal d'édition en a aussi besoin
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedItineraire(null);
                }}
                onSave={handleSaveItineraire}
            />
        </div>
    );
};

export default ItinerairesPage;