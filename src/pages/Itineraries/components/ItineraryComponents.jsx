import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Clock, Users, Filter, Eye, Settings, ArrowRight } from 'lucide-react';
import ItineraireDetailsModal from "./DetailsModal.jsx";
import ItineraireEditModal from "./EditModal.jsx";

const ItinerairesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');
    const [directionFilter, setDirectionFilter] = useState('Toutes les directions');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItineraire, setSelectedItineraire] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleViewDetails = (itineraire) => {
        setSelectedItineraire(itineraire);
        setShowDetailsModal(true);
    };

    const handleEditItineraire = (itineraire) => {
        setSelectedItineraire(itineraire);
        setShowEditModal(true);
    };

    const handleSaveItineraire = async (updatedItineraire) => {
        try {
            // Logique de sauvegarde ici
            console.log('Itinéraire mis à jour:', updatedItineraire);
            // Vous pouvez ajouter votre logique API ici

            // Fermer le modal après sauvegarde
            setShowEditModal(false);
            setSelectedItineraire(null);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    // Données conformes au dictionnaire de données
    const itineraires = [
        {
            itinary_id: 1,
            route_id: 1,
            direction: 'ALLER',
            itenary_name: 'Centre-ville → Bonabéri',
            departure_station: 'Gare Centrale',
            arrival_station: 'Marché Bonabéri',
            distance: 12.5,
            estimated_duration: 45,
            route_name: 'Ligne A',
            ticket_price: 500.00,
            status: 'ACTIVE',
            description: 'Ligne principale reliant le centre-ville à Bonabéri',
            // Données d'horaires associées
            schedules: [
                { departure_time: '05:30', arrival_time: '06:15', weekdays: 'LMMJVSD' },
                { departure_time: '06:00', arrival_time: '06:45', weekdays: 'LMMJV' }
            ]
        },
        {
            itinary_id: 2,
            route_id: 1,
            direction: 'RETOUR',
            itenary_name: 'Bonabéri → Centre-ville',
            departure_station: 'Marché Bonabéri',
            arrival_station: 'Gare Centrale',
            distance: 12.5,
            estimated_duration: 45,
            route_name: 'Ligne A',
            ticket_price: 500.00,
            status: 'ACTIVE',
            description: 'Retour de Bonabéri vers le centre-ville',
            schedules: [
                { departure_time: '06:30', arrival_time: '07:15', weekdays: 'LMMJVSD' }
            ]
        },
        {
            itinary_id: 3,
            route_id: 2,
            direction: 'ALLER',
            itenary_name: 'Akwa → Makepe',
            departure_station: 'Rond-point Akwa',
            arrival_station: 'Carrefour Makepe',
            distance: 8.3,
            estimated_duration: 30,
            route_name: 'Ligne B',
            ticket_price: 400.00,
            status: 'ACTIVE',
            description: 'Liaison Akwa-Makepe',
            schedules: [
                { departure_time: '06:00', arrival_time: '06:30', weekdays: 'LMMJV' }
            ]
        },
        {
            itinary_id: 4,
            route_id: 3,
            direction: 'ALLER',
            itenary_name: 'Bassa → Ndokoti',
            departure_station: 'Marché Bassa',
            arrival_station: 'Station Ndokoti',
            distance: 15.7,
            estimated_duration: 55,
            route_name: 'Ligne C',
            ticket_price: 600.00,
            status: 'MAINTENANCE',
            description: 'Ligne en maintenance temporaire',
            schedules: [
                { departure_time: '05:45', arrival_time: '06:40', weekdays: 'LMMJVSD' }
            ]
        },
        {
            itinary_id: 5,
            route_id: 4,
            direction: 'ALLER',
            itenary_name: 'Bonanjo → Kotto',
            departure_station: 'Place du Gouvernement',
            arrival_station: 'Marché Kotto',
            distance: 10.2,
            estimated_duration: 40,
            route_name: 'Ligne D',
            ticket_price: 450.00,
            status: 'ACTIVE',
            description: 'Desserte Bonanjo-Kotto',
            schedules: [
                { departure_time: '06:15', arrival_time: '06:55', weekdays: 'LMMJV' }
            ]
        }
    ];

    const stats = [
        { label: 'Total Itinéraires', value: itineraires.length.toString(), color: 'bg-blue-100 text-blue-600', icon: '🚌' },
        { label: 'Itinéraires Actifs', value: itineraires.filter(it => it.status === 'ACTIVE').length.toString(), color: 'bg-green-100 text-green-600', icon: '✅' },
        { label: 'En Maintenance', value: itineraires.filter(it => it.status === 'MAINTENANCE').length.toString(), color: 'bg-orange-100 text-orange-600', icon: '⚠️' },
        { label: 'Distance Totale', value: `${itineraires.reduce((sum, it) => sum + it.distance, 0).toFixed(1)} km`, color: 'bg-purple-100 text-purple-600', icon: '📏' }
    ];

    const filteredItineraires = itineraires.filter(itineraire =>
        (itineraire.itenary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            itineraire.route_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'Tous les statuts' || itineraire.status === statusFilter) &&
        (directionFilter === 'Toutes les directions' || itineraire.direction === directionFilter)
    );

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium';
            case 'MAINTENANCE':
                return 'bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium';
            case 'INACTIVE':
                return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium';
            default:
                return 'bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium';
        }
    };

    const getDirectionBadge = (direction) => {
        return direction === 'ALLER'
            ? 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium'
            : 'bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium';
    };

    const formatWeekdays = (weekdays) => {
        if (weekdays === 'LMMJVSD') return 'Tous les jours';
        if (weekdays === 'LMMJV') return 'Semaine';
        if (weekdays === 'SD') return 'Weekend';
        return weekdays;
    };

    return (
        <div className="p-3 lg:p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">
                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Gestion des Itinéraires</h1>
                            <p className="text-gray-600 mt-1 text-sm">Gérez les itinéraires, lignes et parcours de bus</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center px-4 sm:px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl w-fit"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            Nouvel Itinéraire
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {stats.map((stat, index) => (
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
                                    size={18}/>
                            <input
                                type="text"
                                placeholder="Rechercher un itinéraire ou une ligne..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-400"/>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option>Tous les statuts</option>
                                <option>ACTIVE</option>
                                <option>MAINTENANCE</option>
                                <option>INACTIVE</option>
                            </select>
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
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Horaires</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Statut</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredItineraires.map((itineraire) => (
                                <tr key={itineraire.itinary_id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm">{itineraire.itenary_name}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {itineraire.route_name} • ID: {itineraire.itinary_id}
                                            </div>
                                            <div className="mt-1">
                                                <span className={getDirectionBadge(itineraire.direction)}>
                                                    {itineraire.direction}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <MapPin size={12} className="text-green-500"/>
                                                <span className="text-gray-700 font-medium">{itineraire.departure_station}</span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <ArrowRight size={14} className="text-gray-400"/>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <MapPin size={12} className="text-red-500"/>
                                                <span className="text-gray-700 font-medium">{itineraire.arrival_station}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-1 text-xs">
                                            <div className="text-gray-700">
                                                <span className="font-medium">Distance:</span> {itineraire.distance} km
                                            </div>
                                            <div className="text-gray-700">
                                                <span className="font-medium">Durée:</span> {itineraire.estimated_duration} min
                                            </div>
                                            <div className="text-blue-600 font-medium">
                                                {itineraire.ticket_price} FCFA
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-2">
                                            {itineraire.schedules.slice(0, 2).map((schedule, idx) => (
                                                <div key={idx} className="text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={12} className="text-gray-400"/>
                                                        <span className="text-gray-700 font-medium">
                                                            {schedule.departure_time} - {schedule.arrival_time}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-600 ml-4">
                                                        {formatWeekdays(schedule.weekdays)}
                                                    </div>
                                                </div>
                                            ))}
                                            {itineraire.schedules.length > 2 && (
                                                <div className="text-xs text-blue-600 ml-4">
                                                    +{itineraire.schedules.length - 2} autres horaires
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={getStatusBadge(itineraire.status)}>
                                            {itineraire.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleViewDetails(itineraire)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Voir détails">
                                                <Eye size={14}/>
                                            </button>
                                            <button
                                                onClick={() => handleEditItineraire(itineraire)}
                                                className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                                title="Modifier">
                                                <Edit size={14}/>
                                            </button>
                                            {/*<button*/}
                                            {/*    className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"*/}
                                            {/*    title="Horaires">*/}
                                            {/*    <Clock size={14}/>*/}
                                            {/*</button>*/}
                                            <button
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Supprimer">
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredItineraires.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">🚌</div>
                            <p>Aucun itinéraire trouvé</p>
                            <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}
                </div>

                {/* Modal d'ajout amélioré */}
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

                            <form className="space-y-6">
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
                                                placeholder="ex: Centre-ville → Aéroport"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ligne associée *
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option value="">Sélectionner une ligne</option>
                                                <option value="1">Ligne A</option>
                                                <option value="2">Ligne B</option>
                                                <option value="3">Ligne C</option>
                                                <option value="4">Ligne D</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Direction *
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option value="">Sélectionner une direction</option>
                                                <option value="ALLER">ALLER</option>
                                                <option value="RETOUR">RETOUR</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prix du ticket (FCFA) *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="500"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
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
                                            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option value="">Sélectionner la station de départ</option>
                                                <option value="1">Gare Centrale</option>
                                                <option value="2">Rond-point Akwa</option>
                                                <option value="3">Marché Bassa</option>
                                                <option value="4">Place du Gouvernement</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Station d'arrivée *
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option value="">Sélectionner la station d'arrivée</option>
                                                <option value="1">Marché Bonabéri</option>
                                                <option value="2">Carrefour Makepe</option>
                                                <option value="3">Station Ndokoti</option>
                                                <option value="4">Marché Kotto</option>
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
                                                placeholder="12.5"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Durée estimée (minutes) *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="45"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            rows="3"
                                            placeholder="Description de l'itinéraire..."
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        ></textarea>
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
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Créer l'itinéraire
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
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedItineraire(null);
                }}
            />

            <ItineraireEditModal
                itineraire={selectedItineraire}
                isOpen={showEditModal}
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