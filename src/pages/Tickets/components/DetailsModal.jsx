import React from 'react';
import { X, User, Route, Calendar, MapPin, Clock, CreditCard, CheckCircle, XCircle, AlertCircle, QrCode } from 'lucide-react';

const TicketDetailModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen || !ticket) return null;

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'VALIDE':
                return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium';
            case 'UTILISE':
                return 'bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium';
            case 'EXPIRE':
                return 'bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium';
            case 'ANNULE':
                return 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium';
            default:
                return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium';
        }
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'VALIDE':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'UTILISE':
                return <CheckCircle size={20} className="text-purple-500" />;
            case 'EXPIRE':
                return <AlertCircle size={20} className="text-orange-500" />;
            case 'ANNULE':
                return <XCircle size={20} className="text-red-500" />;
            default:
                return <AlertCircle size={20} className="text-gray-500" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) + ' à ' + date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <QrCode className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Détails du Ticket</h2>
                            <p className="text-sm text-gray-600">{ticket.ticket_number}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-6">
                    {/* Statut */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            {getStatusIcon(ticket.ticket_status)}
                            <span className="font-medium text-gray-800">Statut du ticket</span>
                        </div>
                        <span className={getStatusBadge(ticket.ticket_status)}>
                            {ticket.ticket_status}
                        </span>
                    </div>

                    {/* Informations principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informations utilisateur */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <User size={20} className="text-blue-600" />
                                Utilisateur
                            </div>
                            <div className="space-y-3 pl-7">
                                <div>
                                    <span className="text-sm text-gray-500">Nom complet</span>
                                    <div className="font-medium text-gray-800">{ticket.user_name}</div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">ID Utilisateur</span>
                                    <div className="font-medium text-gray-800">#{ticket.user_id}</div>
                                </div>
                            </div>
                        </div>

                        {/* Informations financières */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <CreditCard size={20} className="text-green-600" />
                                Paiement
                            </div>
                            <div className="space-y-3 pl-7">
                                <div>
                                    <span className="text-sm text-gray-500">Prix payé</span>
                                    <div className="text-2xl font-bold text-green-600">{ticket.price_paid} FCFA</div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">ID Ticket</span>
                                    <div className="font-medium text-gray-800">#{ticket.ticket_id}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations de trajet */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Route size={20} className="text-purple-600" />
                            Informations de trajet
                        </div>
                        <div className="pl-7 space-y-4">
                            <div>
                                <span className="text-sm text-gray-500">Ligne de transport</span>
                                <div className="font-medium text-gray-800">{ticket.route_name}</div>
                                <div className="text-sm text-gray-500">Route ID: #{ticket.route_id}</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin size={16} className="text-green-600" />
                                        <span className="text-sm font-medium text-green-800">Point de départ</span>
                                    </div>
                                    <div className="font-medium text-gray-800">{ticket.departure_station}</div>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin size={16} className="text-red-600" />
                                        <span className="text-sm font-medium text-red-800">Point d'arrivée</span>
                                    </div>
                                    <div className="font-medium text-gray-800">{ticket.arrival_station}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations temporelles */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Calendar size={20} className="text-orange-600" />
                            Informations temporelles
                        </div>
                        <div className="pl-7 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock size={16} className="text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Date d'achat</span>
                                    </div>
                                    <div className="font-medium text-gray-800">{formatDate(ticket.purchase_date)}</div>
                                </div>

                                {ticket.usage_date && (
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={16} className="text-purple-600" />
                                            <span className="text-sm font-medium text-purple-800">Date d'utilisation</span>
                                        </div>
                                        <div className="font-medium text-gray-800">{formatDate(ticket.usage_date)}</div>
                                    </div>
                                )}

                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock size={16} className="text-orange-600" />
                                        <span className="text-sm font-medium text-orange-800">Date d'expiration</span>
                                    </div>
                                    <div className="font-medium text-gray-800">{formatDate(ticket.expiration_date)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <QrCode size={20} className="text-indigo-600" />
                            Code QR
                        </div>
                        <div className="pl-7">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-xs font-mono text-gray-600 break-all">
                                    {ticket.qr_code}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailModal;