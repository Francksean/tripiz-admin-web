import {useEffect, useState} from "react";
import { X } from "lucide-react";

export const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState(user || {
        email: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            // Réinitialiser le formulaire si aucun utilisateur n'est sélectionné
            setFormData({
                email: '',
                password: '',
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(formData);
            onClose();
            // Réinitialiser le formulaire après sauvegarde
            setFormData({
                email: '',
                password: '',
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    const handleClose = () => {
        onClose();
        // Réinitialiser le formulaire à la fermeture
        setFormData({
            email: '',
            password: '',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl xl:rounded-2xl p-4 xl:p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 xl:mb-6">
                    <h2 className="text-lg xl:text-2xl font-bold text-gray-800">
                        Nouveau Chauffeur
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-4 h-4 xl:w-5 xl:h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 xl:space-y-4">
                    <div>
                        <label className="block text-xs xl:text-sm font-medium mb-2 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full p-2.5 xl:p-3 rounded-lg xl:rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm xl:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs xl:text-sm font-medium mb-2 text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full p-2.5 xl:p-3 rounded-lg xl:rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm xl:text-base"
                            required
                            minLength={8}
                            placeholder="Minimum 8 caractères ex: password1234"
                        />
                    </div>

                    <div className="flex space-x-3 xl:space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-2.5 xl:py-3 px-4 rounded-lg xl:rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm xl:text-base"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 xl:py-3 px-4 rounded-lg xl:rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:scale-105 transition-all shadow-lg hover:shadow-xl text-sm xl:text-base"
                        >
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};