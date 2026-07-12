import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Building2, Image as ImageIcon, DollarSign, Edit, RefreshCw, AlertTriangle, Link2 } from 'lucide-react';
import {parameterService} from "../../../Services/AdminConfig.js";
import ConfigEditModal from "./EditModal.jsx";

const BRAND = {
    blue:      '#3A68C4',
    lightBlue: '#498BD2',
    dark:      '#2C2C2C',
    beige:     '#EFF0EB',
    mint:      '#F0F6F6',
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.lightBlue} 100%)`;

const formatFCFA = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;

const Pulse = ({ className = '' }) => (
    <div className={`bg-white/25 rounded animate-pulse ${className}`} />
);

const ParamManagement = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const fetchConfig = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await parameterService.getAdminConfig();
            setConfig(data);
        } catch (err) {
            setError(err.message || "Erreur lors du chargement de la configuration.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    useEffect(() => {
        setLogoError(false);
    }, [config?.logoUrl]);

    const handleSaveConfig = async (updatedConfig) => {
        const saved = await parameterService.updateAdminParam(updatedConfig);
        setConfig(saved);
        setShowEditModal(false);
    };

    const hasLogo = !!config?.logoUrl && !logoError;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4 max-w-4xl">

                {/* En-tête de page */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRADIENT }}>
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold" style={{ color: BRAND.dark }}>Paramètres</h1>
                            <p className="text-gray-500 mt-0.5 text-sm">Configuration générale de l'entreprise</p>
                        </div>
                    </div>

                    {error && (
                        <button
                            onClick={fetchConfig}
                            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Réessayer
                        </button>
                    )}
                </div>

                <div className="relative mb-14">
                    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: GRADIENT }}>
                        <div className="px-6 sm:px-8 pt-7 pb-14 flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-white/70 text-[11px] font-medium uppercase tracking-wider mb-1.5">Profil de l'entreprise</p>
                                {loading ? (
                                    <Pulse className="h-8 w-48" />
                                ) : (
                                    <h2 className="text-white text-2xl font-bold truncate">{config?.companyName || 'Non défini'}</h2>
                                )}
                            </div>
                            <button
                                onClick={() => setShowEditModal(true)}
                                disabled={loading || !config}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white/15 text-white
                                    border border-white/25 hover:bg-white/25 transition-colors flex-shrink-0
                                    disabled:opacity-40 disabled:hover:bg-white/15"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Modifier</span>
                            </button>
                        </div>
                    </div>

                    {/* Avatar / logo — plus jamais coupé, quel que soit son contenu */}
                    <div className="absolute left-6 sm:left-8 -bottom-10 w-20 h-20 rounded-2xl bg-white border-4 border-gray-50 shadow-lg
                        flex items-center justify-center overflow-hidden">
                        {loading ? (
                            <div className="w-full h-full bg-gray-100 animate-pulse" />
                        ) : hasLogo ? (
                            <img
                                src={config.logoUrl}
                                alt={config.companyName || 'Logo'}
                                className="w-full h-full object-contain p-1.5"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <Building2 className="w-8 h-8" style={{ color: BRAND.blue }} />
                        )}
                    </div>
                </div>

                {/* ── Détails de configuration ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F59E0B14' }}>
                                <DollarSign className="w-4 h-4" style={{ color: '#F59E0B' }} />
                            </div>
                            <p className="text-xs font-medium text-gray-500 tracking-wide">Prix par défaut du ticket</p>
                        </div>
                        {loading ? (
                            <Pulse className="h-8 w-28 !bg-gray-100" />
                        ) : (
                            <p className="text-2xl font-bold" style={{ color: BRAND.dark }}>
                                {formatFCFA(config?.defaultTicketPrice)}
                            </p>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#8B5CF614' }}>
                                <ImageIcon className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                            </div>
                            <p className="text-xs font-medium text-gray-500 tracking-wide">Logo</p>
                        </div>
                        {loading ? (
                            <Pulse className="h-5 w-40 !bg-gray-100" />
                        ) : config?.logoUrl ? (
                            <a
                                href={config.logoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 hover:underline break-all inline-flex items-start gap-1.5"
                            >
                                <Link2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                {config.logoUrl}
                            </a>
                        ) : (
                            <p className="text-sm text-gray-400">Aucun logo configuré</p>
                        )}
                        {!loading && logoError && config?.logoUrl && (
                            <p className="text-xs text-red-500 mt-2">L'image n'a pas pu être chargée depuis cette URL.</p>
                        )}
                    </div>
                </div>
            </div>

            <ConfigEditModal
                config={config}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveConfig}
            />
        </div>
    );
};

export default ParamManagement;