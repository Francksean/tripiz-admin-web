import React from 'react';
import { createPortal } from 'react-dom';
import { X, User, Route, Calendar, MapPin, Clock, CreditCard, CheckCircle, XCircle, AlertCircle, QrCode } from 'lucide-react';

// ── Helpers hors composant ────────────────────────────────────────────────────
const STATUS_STYLE = {
    VALIDE:  'bg-green-50 text-green-700',
    UTILISE: 'bg-purple-50 text-purple-700',
    EXPIRE:  'bg-amber-50 text-amber-700',
    ANNULE:  'bg-red-50 text-red-700',
};
const STATUS_DOT = {
    VALIDE:  'bg-green-500',
    UTILISE: 'bg-purple-500',
    EXPIRE:  'bg-amber-500',
    ANNULE:  'bg-red-500',
};
const STATUS_LABEL = {
    VALIDE:  'Valide',
    UTILISE: 'Utilisé',
    EXPIRE:  'Expiré',
    ANNULE:  'Annulé',
};

const StatusIcon = ({ status }) => {
    const props = { size: 14 };
    switch (status) {
        case 'VALIDE':  return <CheckCircle  {...props} className="text-green-500" />;
        case 'UTILISE': return <CheckCircle  {...props} className="text-purple-500" />;
        case 'EXPIRE':  return <AlertCircle  {...props} className="text-amber-500" />;
        case 'ANNULE':  return <XCircle      {...props} className="text-red-500" />;
        default:        return <AlertCircle  {...props} className="text-gray-400" />;
    }
};

const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
        + ' à '
        + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// ── Composants locaux hors composant principal ────────────────────────────────
const Row = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-medium text-gray-800 text-right max-w-[60%]">{value ?? '—'}</span>
    </div>
);

const SectionHeader = ({ icon: Icon, title, iconColor = 'text-blue-600' }) => (
    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        {title}
    </p>
);

const DateCard = ({ icon: Icon, label, value, bg, iconColor }) => (
    <div className={`${bg} rounded-xl p-3`}>
        <div className="flex items-center gap-1.5 mb-1">
            <Icon className={`w-3 h-3 ${iconColor}`} />
            <span className={`text-[10px] font-medium ${iconColor}`}>{label}</span>
        </div>
        <p className="text-xs font-medium text-gray-800">{value}</p>
    </div>
);

// ── Composant principal ───────────────────────────────────────────────────────
const TicketDetailModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen || !ticket) return null;

    const statusStyle = STATUS_STYLE[ticket.ticket_status] || 'bg-gray-100 text-gray-600';
    const statusDot   = STATUS_DOT[ticket.ticket_status]   || 'bg-gray-400';
    const statusLabel = STATUS_LABEL[ticket.ticket_status] || ticket.ticket_status;

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* ── En-tête ── */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <QrCode className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-gray-900">Détails du ticket</h2>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{ticket.ticket_number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${statusStyle}`}>
                            <StatusIcon status={ticket.ticket_status} />
                            {statusLabel}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                                text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <div className="px-5 py-4 space-y-4">

                    {/* ── Prix mis en avant ── */}
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-green-600">Prix payé</p>
                                <p className="text-lg font-bold text-green-700">{ticket.price_paid} <span className="text-sm font-normal">FCFA</span></p>
                            </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium ${statusStyle}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                            {statusLabel}
                        </div>
                    </div>

                    {/* ── Utilisateur ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={User} title="Utilisateur" />
                        <Row label="Nom"          value={ticket.user_name} />
                        <Row label="ID utilisateur" value={`#${ticket.user_id}`} />
                        <Row label="ID ticket"    value={`#${ticket.ticket_id}`} />
                    </div>

                    {/* ── Trajet ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={Route} title="Trajet" iconColor="text-purple-600" />
                        <Row label="Ligne"    value={ticket.route_name} />
                        <Row label="Route ID" value={`#${ticket.route_id}`} />

                        {/* Départ → Arrivée */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mt-3">
                            <div className="bg-green-50 rounded-lg p-2.5">
                                <div className="flex items-center gap-1 mb-1">
                                    <MapPin className="w-3 h-3 text-green-600" />
                                    <span className="text-[10px] text-green-700 font-medium">Départ</span>
                                </div>
                                <p className="text-xs font-medium text-gray-800">{ticket.departure_station}</p>
                            </div>
                            <div className="flex justify-center">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7h10M8 3l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="bg-red-50 rounded-lg p-2.5">
                                <div className="flex items-center gap-1 mb-1">
                                    <MapPin className="w-3 h-3 text-red-500" />
                                    <span className="text-[10px] text-red-600 font-medium">Arrivée</span>
                                </div>
                                <p className="text-xs font-medium text-gray-800">{ticket.arrival_station}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Dates ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={Calendar} title="Dates" iconColor="text-amber-600" />
                        <div className="space-y-2">
                            <DateCard icon={Clock} label="Date d'achat"       value={formatDate(ticket.purchase_date)}    bg="bg-blue-50"   iconColor="text-blue-600" />
                            {ticket.usage_date && (
                                <DateCard icon={Clock} label="Date d'utilisation" value={formatDate(ticket.usage_date)}       bg="bg-purple-50" iconColor="text-purple-600" />
                            )}
                            <DateCard icon={Clock} label="Date d'expiration"  value={formatDate(ticket.expiration_date)}  bg="bg-amber-50"  iconColor="text-amber-600" />
                        </div>
                    </div>

                    {/* ── QR Code ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={QrCode} title="Code QR" iconColor="text-indigo-600" />
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <p className="text-[11px] font-mono text-gray-500 break-all leading-relaxed">
                                {ticket.qr_code}
                            </p>
                        </div>
                    </div>

                    {/* ── Action ── */}
                    <div className="flex justify-end pt-1 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default TicketDetailModal;