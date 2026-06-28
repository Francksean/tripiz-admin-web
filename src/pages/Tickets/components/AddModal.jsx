import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, User, Route, MapPin, CreditCard } from 'lucide-react';

// ── Constantes hors composant ─────────────────────────────────────────────────
const USERS  = ['Jean Dupont', 'Marie Nkomo', 'Paul Mbarga', 'Sophie Ewodo'];
const ROUTES = ['Douala Central - Bonabéri', 'Akwa - Makepe', 'Bassa - Ndokoti', 'Bonanjo - Kotto'];
const STATIONS = ['Gare Centrale', 'Rond-point Akwa', 'Marché Bassa', 'Place du Gouvernement', 'Marché Bonabéri', 'Carrefour Makepe', 'Station Ndokoti', 'Marché Kotto'];

const EMPTY = { user_name: '', route_name: '', departure_station: '', arrival_station: '', price_paid: '' };

// ── Composants hors composant principal ──────────────────────────────────────
const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
        {children}
    </div>
);

const SectionHeader = ({ icon: Icon, title, iconColor = 'text-blue-600' }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
    </div>
);

const inputCls = `w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`;

// ── Composant principal ───────────────────────────────────────────────────────
export const AddTicketModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState(EMPTY);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const newTicket = {
            ...formData,
            ticket_id:      Date.now(),
            ticket_number:  `TKT_${Date.now()}`,
            user_id:        Date.now(),
            route_id:       Date.now(),
            price_paid:     parseFloat(formData.price_paid) || 0,
            purchase_date:  new Date().toISOString(),
            usage_date:     null,
            expiration_date: new Date(Date.now() + 86400000).toISOString(),
            ticket_status:  'VALIDE',
            qr_code:        btoa(JSON.stringify({ ticket_id: Date.now() })),
        };
        onSave?.(newTicket);
        setFormData(EMPTY);
        onClose();
    };

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">

                {/* En-tête */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Save className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Nouveau ticket</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Créer un ticket manuellement</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                        <X size={14} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">

                    {/* Utilisateur */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={User} title="Utilisateur" />
                        <Field label="Nom de l'utilisateur *">
                            <select name="user_name" value={formData.user_name} onChange={handleChange} className={inputCls}>
                                <option value="">Sélectionner…</option>
                                {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </Field>
                    </div>

                    {/* Trajet */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <SectionHeader icon={Route} title="Trajet" iconColor="text-purple-600" />
                        <Field label="Ligne *">
                            <select name="route_name" value={formData.route_name} onChange={handleChange} className={inputCls}>
                                <option value="">Sélectionner…</option>
                                {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </Field>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                            <Field label="Départ *">
                                <select name="departure_station" value={formData.departure_station} onChange={handleChange} className={inputCls}>
                                    <option value="">Sélectionner…</option>
                                    {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Field>
                            <div className="flex items-center justify-center pb-2">
                                <div className="w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6h8M7 3l3 3-3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                            <Field label="Arrivée *">
                                <select name="arrival_station" value={formData.arrival_station} onChange={handleChange} className={inputCls}>
                                    <option value="">Sélectionner…</option>
                                    {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Field>
                        </div>
                    </div>

                    {/* Prix */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={CreditCard} title="Paiement" iconColor="text-green-600" />
                        <Field label="Prix (FCFA) *">
                            <div className="relative">
                                <input
                                    type="number" name="price_paid" value={formData.price_paid}
                                    onChange={handleChange} min="0" step="0.01" placeholder="150"
                                    className={`${inputCls} pr-16`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">FCFA</span>
                            </div>
                        </Field>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2.5 pt-1 border-t border-gray-100">
                        <button onClick={onClose} className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>
                        <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
                            <Save size={14} />
                            Créer le ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};