import React from 'react';
import { Bus, Navigation, X, MapPin, User, Settings, Info, Calendar, Shield, Wrench } from 'lucide-react';

export const ModalDetails = ({ activeTab, showDetailsModal, setShowDetailsModal, detailsItem, routesData }) => {
    if (!showDetailsModal || !detailsItem) return null;

    const handleClose = () => {
        setShowDetailsModal(false);
    };

    // Fonction pour obtenir le nom de la route
    const getRouteName = (routeId) => {
        if (!routeId || !routesData) return 'Non assigné';
        const route = routesData.find(r => r.route_id === routeId);
        return route ? `${route.route_name} - ${route.description}` : 'Route introuvable';
    };

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (status) => {
        const statusColors = {
            // Statuts Bus
            'En service': 'bg-blue-100 text-blue-800',
            'En maintenance': 'bg-yellow-100 text-yellow-800',
            // Statuts Station
            'ACTIVE': 'bg-green-100 text-green-800',
            'INACTIVE': 'bg-red-100 text-red-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    // Fonction pour formater le statut
    const formatStatus = (status) => {
        const statusLabels = {
            'En service': 'En Service',
            'En maintenance': 'Maintenance',
            'ACTIVE': 'Actif',
            'INACTIVE': 'Inactif',
            'ARRET_NORMAL': 'Arrêt Normal',
            'TERMINUS': 'Terminus',
            'CORRESPONDANCE': 'Correspondance'
        };
        return statusLabels[status] || status;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        {activeTab === 'bus' ? <Bus className="w-7 h-7 text-blue-600"/> :
                            <Navigation className="w-7 h-7 text-blue-600"/>}
                        Détails {activeTab === 'bus' ? 'du Bus' : 'de la Station'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24}/>
                    </button>
                </div>

                {activeTab === 'bus' ? (
                    <div className="space-y-6">
                        {/* En-tête avec statut */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{detailsItem.busNumber}</h3>
                                </div>
                                <div className="text-right">
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(detailsItem.status)}`}>
                                        {formatStatus(detailsItem.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                            {/* Informations générales */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                                    <Info className="w-5 h-5 mr-2 text-blue-600"/>
                                    Informations générales
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Numéro:</span>
                                        <span className="font-medium text-gray-800">{detailsItem.busNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Immatriculation:</span>
                                        <span className="font-medium text-gray-800">{detailsItem.matriculation}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Capacité:</span>
                                        <span className="font-medium text-gray-800">{detailsItem.capacity} places</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Statut:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(detailsItem.status)}`}>
                                            {formatStatus(detailsItem.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        {/* Informations supplémentaires */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                                <Calendar className="w-5 h-5 mr-2 text-purple-600"/>
                                Informations supplémentaires
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {detailsItem.capacity}
                                    </div>
                                    <div className="text-sm text-gray-600">Places totales</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {detailsItem.status === 'EN_SERVICE' ? '✓' : '○'}
                                    </div>
                                    <div className="text-sm text-gray-600">En service</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* En-tête avec statut */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                            <div className="flex items-center justify-between">
                                <div className="text-right">
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(detailsItem.status)}`}>
                                        {formatStatus(detailsItem.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Informations générales */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                                    <Info className="w-5 h-5 mr-2 text-blue-600"/>
                                    Informations générales
                                </h4>
                                <div className="space-y-3">
                                    <div className="py-2 border-b border-gray-100">
                                        <span className="text-gray-600 block mb-1">Nom:</span>
                                        <span className="font-medium text-gray-800">{detailsItem.stationName}</span>
                                    </div>
                                    <div className="py-2 border-b border-gray-100">
                                        <span className="text-gray-600 block mb-1">Type:</span>
                                        <span className="font-medium text-gray-800">{formatStatus(detailsItem.stationType)}</span>
                                    </div>
                                    <div className="py-2">
                                        <span className="text-gray-600 block mb-1">Statut:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(detailsItem.status)}`}>
                                            {formatStatus(detailsItem.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Localisation */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                                    <MapPin className="w-5 h-5 mr-2 text-red-600"/>
                                    Localisation
                                </h4>
                                <div className="space-y-3">
                                    <div className="py-2 border-b border-gray-100">
                                        <span className="text-gray-600 block mb-1">Adresse:</span>
                                        <span className="font-medium text-gray-800">{detailsItem.address}</span>
                                    </div>
                                    <div className="py-2">
                                        <span className="text-gray-600 block mb-1">Latitude:</span>
                                        <span className="font-medium text-gray-800 font-mono text-sm">
                                            {detailsItem.latitude}
                                        </span>
                                    </div>
                                    <div className="py-2">
                                        <span className="text-gray-600 block mb-1">Longitude:</span>
                                        <span className="font-medium text-gray-800 font-mono text-sm">
                                            {detailsItem.longitude}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Statistiques */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                                <Shield className="w-5 h-5 mr-2 text-purple-600"/>
                                Informations sur la station
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatStatus(detailsItem.stationType)}
                                    </div>
                                    <div className="text-sm text-gray-600">Type de station</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {detailsItem.status === 'ACTIVE' ? '✓' : '○'}
                                    </div>
                                    <div className="text-sm text-gray-600">Station active</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bouton de fermeture */}
                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};