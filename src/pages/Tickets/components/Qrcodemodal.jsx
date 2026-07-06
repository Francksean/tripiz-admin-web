import React from 'react';
import { createPortal } from 'react-dom';
import { X, QrCode } from 'lucide-react';

export const QRCodeModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen || !ticket) return null;

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100">

                {/* En-tête */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <QrCode className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Code QR</h2>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{ticket.ticket_number}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                            text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {/* QR Code placeholder */}
                    <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                        <div className="w-36 h-36 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                            <QrCode size={52} className="text-gray-300" />
                        </div>
                    </div>

                    {/* Infos ticket */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                            <span className="text-xs text-gray-400">Utilisateur</span>
                            <span className="text-xs font-medium text-gray-800">{ticket.user_name}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                            <span className="text-xs text-gray-400">Ligne</span>
                            <span className="text-xs font-medium text-gray-800 text-right max-w-[55%]">{ticket.route_name}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-xs text-gray-400">Prix</span>
                            <span className="text-sm font-bold text-blue-600">{ticket.price_paid} FCFA</span>
                        </div>
                    </div>

                    {/* Code brut */}
                    <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[11px] font-mono text-gray-500 break-all leading-relaxed">{ticket.qr_code}</p>
                    </div>

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