import React from 'react';
import { createPortal } from 'react-dom';
import { Bus, Navigation, X, MapPin, Info } from 'lucide-react';

export const ModalDetails = ({ activeTab, showDetailsModal, setShowDetailsModal, detailsItem }) => {
    if (!showDetailsModal || !detailsItem) return null;

    const handleClose = () => setShowDetailsModal(false);

    const isBus = activeTab === 'bus' || activeTab === 'buses';

    const getStatusStyle = (status) => ({
        'En service':    'bg-blue-50 text-blue-700',
        'En maintenance':'bg-amber-50 text-amber-700',
        'ACTIVE':        'bg-green-50 text-green-700',
        'INACTIVE':      'bg-red-50 text-red-700',
    }[status] || 'bg-gray-100 text-gray-600');

    const formatStatus = (status) => ({
        'En service':    'En service',
        'En maintenance':'Maintenance',
        'ACTIVE':        'Actif',
        'INACTIVE':      'Inactif',
        'STOP':          'Arrêt normal',
        'TERMINUS':      'Terminus',
        'DEPARTURE':     'Départ',
    }[status] || status || '—');

    const fmtCoord = (val) => {
        if (val === null || val === undefined || val === '') return '—';
        const n = parseFloat(val);
        return isNaN(n) ? String(val) : n.toFixed(6);
    };

    // ── Ligne de détail ──────────────────────────────────────────────────
    const Row = ({ label, value, mono = false, badge = false, badgeStatus = '' }) => (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400">{label}</span>
            {badge ? (
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusStyle(badgeStatus)}`}>
                    {formatStatus(badgeStatus)}
                </span>
            ) : (
                <span className={`text-xs font-medium text-gray-800 max-w-[55%] text-right break-words ${mono ? 'font-mono' : ''}`}>
                    {value ?? '—'}
                </span>
            )}
        </div>
    );

    // ── Carte métrique ───────────────────────────────────────────────────
    const MetricCard = ({ icon: Icon, label, value, unit, iconBg, iconColor }) => (
        <div className="bg-gray-50 rounded-xl p-3">
            <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
            </div>
            <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-900 leading-tight break-all">
                {value}
                {unit && <span className="text-[11px] font-normal text-gray-400 ml-1">{unit}</span>}
            </p>
        </div>
    );

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* ── En-tête ── */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            {isBus
                                ? <Bus className="w-4 h-4 text-blue-600" />
                                : <Navigation className="w-4 h-4 text-blue-600" />
                            }
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-gray-900 truncate">
                                {isBus ? `Bus #${detailsItem.busNumber}` : detailsItem.stationName}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {isBus ? detailsItem.matriculation : formatStatus(detailsItem.stationType)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(detailsItem.status)}`}>
                            {formatStatus(detailsItem.status)}
                        </span>
                        <button
                            onClick={handleClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                                text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {isBus ? (
                        <>
                            {/* Métriques bus */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <MetricCard
                                    icon={Bus}
                                    label="Numéro"
                                    value={detailsItem.busNumber}
                                    iconBg="bg-blue-50"
                                    iconColor="text-blue-600"
                                />
                                <MetricCard
                                    icon={({ className }) => (
                                        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                                            <circle cx="8" cy="13" r="1" fill="currentColor"/>
                                            <circle cx="12" cy="13" r="1" fill="currentColor"/>
                                            <circle cx="16" cy="13" r="1" fill="currentColor"/>
                                        </svg>
                                    )}
                                    label="Capacité"
                                    value={detailsItem.capacity}
                                    unit="places"
                                    iconBg="bg-green-50"
                                    iconColor="text-green-600"
                                />
                            </div>

                            {/* Infos bus */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
                                    <Info className="w-3.5 h-3.5 text-blue-600" />
                                    Informations
                                </p>
                                <Row label="Numéro de bus"   value={detailsItem.busNumber} />
                                <Row label="Immatriculation" value={detailsItem.matriculation} mono />
                                <Row label="Capacité"        value={`${detailsItem.capacity} places`} />
                                <Row label="Statut"          badge badgeStatus={detailsItem.status} />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Métriques station — coordonnées */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <MetricCard
                                    icon={MapPin}
                                    label="Latitude"
                                    value={fmtCoord(detailsItem.latitude)}
                                    iconBg="bg-blue-50"
                                    iconColor="text-blue-600"
                                />
                                <MetricCard
                                    icon={MapPin}
                                    label="Longitude"
                                    value={fmtCoord(detailsItem.longitude)}
                                    iconBg="bg-purple-50"
                                    iconColor="text-purple-600"
                                />
                            </div>

                            {/* Infos générales station */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
                                    <Info className="w-3.5 h-3.5 text-blue-600" />
                                    Informations
                                </p>
                                <Row label="Nom"    value={detailsItem.stationName} />
                                <Row label="Type"   value={formatStatus(detailsItem.stationType)} />
                                <Row label="Statut" badge badgeStatus={detailsItem.status} />
                            </div>

                            {/* Localisation */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
                                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                                    Localisation
                                </p>
                                <Row label="Adresse"   value={detailsItem.address} />
                                <Row label="Latitude"  value={fmtCoord(detailsItem.latitude)}  mono />
                                <Row label="Longitude" value={fmtCoord(detailsItem.longitude)} mono />
                            </div>
                        </>
                    )}

                    {/* ── Fermer ── */}
                    <div className="flex justify-end pt-1 border-t border-gray-100">
                        <button
                            onClick={handleClose}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl
                                hover:bg-gray-50 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Rendu via portal pour éviter tout problème de positionnement
    return createPortal(modal, document.body);
};