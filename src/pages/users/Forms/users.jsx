import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Save, User } from "lucide-react";

export const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const emptyForm = { email: '', password: '', firstName: '', lastName: '', phone: '' };
    const [formData, setFormData] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData(user ? {
                email: user.email || '',
                password: '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
            } : emptyForm);
            setError('');
            setSubmitting(false);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError('Le prénom et le nom sont requis');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Le numéro de téléphone est requis');
            return;
        }

        setSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) onClose();
    };

    const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white " +
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">

                {/* ── En-tête ── */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                {user ? 'Modifier le chauffeur' : 'Nouveau chauffeur'}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {user ? 'Mettre à jour les informations' : 'Créer un compte chauffeur'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={submitting}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                            text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* ── Formulaire ── */}
                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

                    {/* Erreur globale */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                            <p className="text-xs text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">

                        {/* Prénom / Nom */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    className={inputCls}
                                    placeholder="Jean"
                                    required
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    className={inputCls}
                                    placeholder="Mballa"
                                    required
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Téléphone *
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className={inputCls}
                                placeholder="+237 6XX XXX XXX"
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={inputCls}
                                placeholder="chauffeur@socatur.cm"
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Mot de passe * <span className="text-gray-400 font-normal">(min. 8 caractères)</span>
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className={inputCls}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                disabled={submitting}
                            />
                            {/* Indicateur de force */}
                            {formData.password.length > 0 && (
                                <div className="mt-1.5 flex gap-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                            formData.password.length >= i * 4
                                                ? i === 1 ? 'bg-red-400' : i === 2 ? 'bg-amber-400' : 'bg-green-500'
                                                : 'bg-gray-200'
                                        }`} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex gap-2.5 pt-1 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl
                                hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium
                                text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sauvegarde…
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    {user ? 'Mettre à jour' : 'Créer'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};