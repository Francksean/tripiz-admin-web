import React, { useState, useEffect } from 'react';
import { X, Save, Settings, Building2, DollarSign, AlertCircle } from 'lucide-react';

const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs text-gray-500 mb-1.5 font-medium">{label}</label>
        {children}
    </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    </div>
);

const inputCls = `w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
    bg-white text-gray-800 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:bg-gray-50 transition-colors`;

const ConfigEditModal = ({ config, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        logoUrl: '',
        defaultTicketPrice: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (config) {
            setFormData({
                companyName: config.companyName || '',
                logoUrl: config.logoUrl || '',
                defaultTicketPrice: config.defaultTicketPrice ?? '',
            });
        }
    }, [config]);

    useEffect(() => {
        if (isOpen) setErrors([]);
    }, [isOpen]);

    if (!isOpen || !config) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors.length > 0) setErrors([]);
    };

    const validateForm = () => {
        const newErrors = [];
        if (!formData.companyName.trim())
            newErrors.push("Le nom de l'entreprise est requis");

        if (formData.logoUrl.trim()) {
            try {
                new URL(formData.logoUrl.trim());
            } catch {
                newErrors.push("L'URL du logo n'est pas valide");
            }
        }

        if (formData.defaultTicketPrice === '' || parseFloat(formData.defaultTicketPrice) <= 0)
            newErrors.push('Le prix par défaut du ticket doit être un nombre positif');

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (validationErrors.length > 0) { setErrors(validationErrors); return; }

        setIsLoading(true);
        setErrors([]);
        try {
            const updatedConfig = {
                companyName: formData.companyName.trim(),
                logoUrl: formData.logoUrl.trim(),
                defaultTicketPrice: parseFloat(formData.defaultTicketPrice),
            };
            await onSave(updatedConfig);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setErrors([error.message || 'Erreur lors de la sauvegarde']);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* ── En-tête ── */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Settings className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Modifier la configuration</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Paramètres généraux de l'entreprise</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
                                text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">

                    {/* ── Erreurs ── */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex gap-3">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <ul className="space-y-0.5">
                                {errors.map((err, i) => (
                                    <li key={i} className="text-xs text-red-700">{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── Section : Informations générales ── */}
                    <section>
                        <SectionHeader icon={Building2} title="Informations générales" />
                        <div className="space-y-3">
                            <Field label="Nom de l'entreprise *">
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Tripiz"
                                    className={inputCls}
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field label="URL du logo">
                                <input
                                    type="text"
                                    name="logoUrl"
                                    value={formData.logoUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://exemple.com/logo.png"
                                    className={inputCls}
                                    disabled={isLoading}
                                />
                            </Field>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* ── Section : Tarification ── */}
                    <section>
                        <SectionHeader icon={DollarSign} title="Tarification" />
                        <Field label="Prix par défaut du ticket *">
                            <div className="relative">
                                <input
                                    type="number"
                                    name="defaultTicketPrice"
                                    value={formData.defaultTicketPrice}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="0"
                                    placeholder="1500"
                                    className={`${inputCls} pr-12`}
                                    required
                                    disabled={isLoading}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">FCFA</span>
                            </div>
                        </Field>
                    </section>

                    <hr className="border-gray-100" />

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl
                                hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-xl
                                hover:bg-blue-700 transition-colors flex items-center gap-2
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sauvegarde…
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
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

export default ConfigEditModal;