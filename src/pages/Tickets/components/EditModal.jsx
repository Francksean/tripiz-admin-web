import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const EditTicketModal = ({ isOpen, onClose, ticket, onSave }) => {
    const [formData, setFormData] = useState({
        user_name: '',
        route_name: '',
        departure_station: '',
        arrival_station: '',
        price_paid: '',
        ticket_status: 'VALIDE'
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                user_name: ticket.user_name,
                route_name: ticket.route_name,
                departure_station: ticket.departure_station,
                arrival_station: ticket.arrival_station,
                price_paid: ticket.price_paid,
                ticket_status: ticket.ticket_status
            });
        }
    }, [ticket]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSave({ ...ticket, ...formData });
        onClose();
    };

    if (!isOpen || !ticket) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Save className="text-orange-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Modifier le Ticket</h2>
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

                {/* Formulaire */}
                <div className="p-6 space-y-6">
                    {/* Informations utilisateur */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Informations utilisateur
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de l'utilisateur
                                </label>
                                <input
                                    type="text"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut du ticket
                                </label>
                                <select
                                    name="ticket_status"
                                    value={formData.ticket_status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="VALIDE">VALIDE</option>
                                    <option value="UTILISE">UTILISE</option>
                                    <option value="EXPIRE">EXPIRE</option>
                                    <option value="ANNULE">ANNULE</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Informations de trajet */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Informations de trajet
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ligne de transport
                            </label>
                            <input
                                type="text"
                                name="route_name"
                                value={formData.route_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Station de départ
                                </label>
                                <input
                                    type="text"
                                    name="departure_station"
                                    value={formData.departure_station}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Station d'arrivée
                                </label>
                                <input
                                    type="text"
                                    name="arrival_station"
                                    value={formData.arrival_station}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informations financières */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Informations financières
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prix (FCFA)
                            </label>
                            <input
                                type="number"
                                name="price_paid"
                                value={formData.price_paid}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Note d'information */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                            <strong>Note :</strong> Les dates d'achat, d'utilisation et d'expiration ne peuvent pas être modifiées.
                            Seules les informations d'utilisateur, de trajet et le prix peuvent être mis à jour.
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Save size={16} />
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTicketModal;