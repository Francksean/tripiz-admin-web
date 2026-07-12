import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Building2, Image as ImageIcon, DollarSign, Edit, RefreshCw, AlertTriangle, Link2, ChevronRight } from 'lucide-react';
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
    <div className={`bg-gray-200/70 rounded animate-pulse ${className}`} />
);

const PulseLight = ({ className = '' }) => (
    <div className={`bg-white/25 rounded animate-pulse ${className}`} />
);

// Ligne de réglage réutilisable, façon "settings list"
const SettingRow = ({ Icon, iconColor, label, description, children, isLast }) => (
    <div className={`flex items-start sm:items-center justify-between gap-4 py-5 px-1 ${!isLast ? 'border-b border-gray-100' : ''}`}>
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0"
                 style={{ background: `${iconColor}14` }}>
                <Icon className="w-4.5 h-4.5" style={{ color: iconColor }} />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: BRAND.dark }}>{label}</p>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
        </div>
        <div className="flex-shrink-0 text-right">
            {children}
        </div>
    </div>
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
            <div className="p-2 lg:p-4">

                {/* En-tête de page */}
                <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{background: GRADIENT}}>
                            <Settings className="w-5 h-5 text-white"/>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl lg:text-2xl font-bold" style={{color: BRAND.dark}}>Paramètres</h1>
                            <p className="text-gray-500 mt-0.5 text-sm">Configuration générale de l'entreprise</p>
                        </div>
                    </div>
                </div>

                {/* Contenu : profil à gauche, réglages à droite */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">

                    {/* Carte profil entreprise */}
                    <div className="lg:col-span-1 rounded-2xl overflow-hidden shadow-sm" style={{ background: GRADIENT }}>
                        <div className="px-6 pt-8 pb-7 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden mb-4">
                                {loading ? (
                                    <div className="w-full h-full bg-gray-100 animate-pulse"/>
                                ) : hasLogo ? (
                                    <img
                                        src={config.logoUrl}
                                        alt={config.companyName || 'Logo'}
                                        className="w-full h-full object-contain p-1.5"
                                        onError={() => setLogoError(true)}
                                    />
                                ) : (
                                    <Building2 className="w-8 h-8" style={{ color: BRAND.blue }}/>
                                )}
                            </div>

                            <p className="text-white/70 text-[11px] font-medium uppercase tracking-wider mb-1.5">
                                Profil de l'entreprise
                            </p>
                            {loading ? (
                                <PulseLight className="h-7 w-32 mx-auto"/>
                            ) : (
                                <h2 className="text-white text-xl font-bold truncate max-w-full">
                                    {config?.companyName || 'Non défini'}
                                </h2>
                            )}

                            <button
                                onClick={() => setShowEditModal(true)}
                                disabled={loading || !config}
                                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-white/15 text-white
                                    border border-white/25 hover:bg-white/25 transition-colors
                                    disabled:opacity-40 disabled:hover:bg-white/15"
                            >
                                <Edit className="w-4 h-4"/>
                                Modifier
                            </button>
                        </div>
                    </div>

                    {/* Liste des réglages */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 px-5 sm:px-6">
                        <div className="flex items-center justify-between pt-5 pb-1">
                            <h3 className="text-sm font-semibold" style={{ color: BRAND.dark }}>Configuration générale</h3>
                        </div>

                        <SettingRow
                            Icon={DollarSign}
                            iconColor="#F59E0B"
                            label="Prix par défaut du ticket"
                            description="Appliqué à tous les nouveaux trajets"
                        >
                            {loading ? (
                                <Pulse className="h-6 w-24 ml-auto"/>
                            ) : (
                                <span className="text-base font-bold" style={{ color: BRAND.dark }}>
                                    {formatFCFA(config?.defaultTicketPrice)}
                                </span>
                            )}
                        </SettingRow>

                        <SettingRow
                            Icon={ImageIcon}
                            iconColor="#8B5CF6"
                            label="Logo de l'entreprise"
                            description={!loading && logoError && config?.logoUrl ? "L'image n'a pas pu être chargée" : "Utilisé sur les tickets"}
                            isLast
                        >
                            {loading ? (
                                <Pulse className="h-5 w-28 ml-auto"/>
                            ) : config?.logoUrl ? (
                                <a
                                    href={config.logoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium hover:underline inline-flex items-center gap-1.5 justify-end max-w-[220px]"
                                style={{ color: BRAND.blue }}
                                >
                                <Link2 className="w-3.5 h-3.5 flex-shrink-0"/>
                                <span className="truncate">Voir le fichier</span>
                                </a>
                                ) : (
                                <span className="text-sm text-gray-400">Non configuré</span>
                                )}
                        </SettingRow>
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