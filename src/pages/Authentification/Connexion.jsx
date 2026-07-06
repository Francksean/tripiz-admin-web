import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Lock, Mail, AlertCircle } from 'lucide-react';
import connectionService from "../../Services/Connexion.js";


const TripizAdminLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe]     = useState(true);
    const [formData, setFormData]         = useState({ email: '', password: '' });
    const [isLoading, setIsLoading]       = useState(false);
    const [error, setError]               = useState('');

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError(''); // efface l'erreur dès que l'utilisateur retape
    };

    const handleSubmit = async () => {
        // Lecture directe des valeurs actuelles des inputs (contourne les soucis d'autofill)
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const email = emailInput?.value ?? formData.email;
        const password = passwordInput?.value ?? formData.password;

        if (!email || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            console.log('Payload envoyé:', { username: email, password }); // à retirer après debug
            await connectionService.login({ username: email, password });
            navigate('/users');
        } catch (err) {
            setError(err.message || 'Identifiants incorrects. Réessayez.');
        } finally {
            setIsLoading(false);
        }
    };

    // Permettre la soumission avec Entrée
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: '#F0F6F6' }}
        >
            <style>{`
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(14px) scale(0.99); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .tripiz-card { animation: cardIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @media (prefers-reduced-motion: reduce) {
                    .tripiz-card { animation: none; }
                }
                .tripiz-input:focus { border-color: #3A68C4 !important; box-shadow: 0 0 0 4px rgba(58,104,196,0.14) !important; background: #fff !important; }
                .tripiz-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(58,104,196,0.4) !important; }
                .tripiz-submit:active:not(:disabled) { transform: translateY(0); }
                .tripiz-link { color: #3A68C4; }
                .tripiz-link:hover { color: #2C2C2C; }
                .tripiz-checkbox { accent-color: #3A68C4; }
            `}</style>

            {/* Carte principale */}
            <div
                className="tripiz-card w-full max-w-4xl relative z-10 rounded-[28px] overflow-hidden flex flex-col lg:flex-row bg-white"
                style={{ boxShadow: '0 40px 90px rgba(15,25,55,0.18)', minHeight: '520px' }}
            >
                {/* Panneau gauche — identité visuelle, bord arrondi qui mord sur le panneau blanc */}
                <div
                    className="lg:w-1/2 p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(160deg, #3A68C4 0%, #498BD2 100%)',
                        borderRadius: '28px',
                        margin: '10px',
                    }}
                >
                    {/* Grain subtil */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{
                        backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)',
                        backgroundSize: '26px 26px',
                    }} />

                    {/* Cercles décoratifs, coupés par le bord inférieur du panneau (signature visuelle) */}
                    <div className="absolute rounded-full pointer-events-none"
                         style={{ width: '19rem', height: '19rem', background: '#2C2C2C', opacity: 0.25, left: '-70px', bottom: '-140px' }} />
                    <div className="absolute rounded-full pointer-events-none"
                         style={{ width: '13rem', height: '13rem', background: '#EFF0EB', opacity: 0.5, left: '30px', bottom: '-90px' }} />
                    <div className="absolute rounded-full pointer-events-none"
                         style={{ width: '6rem', height: '6rem', background: '#EFF0EB', opacity: 0.18, right: '18%', top: '-20px' }} />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-14">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                 style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.3)' }}>
                                <Bus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-[0.15em] leading-none">TRIPIZ</h1>
                                <p className="text-xs text-white/70 mt-1">Gestion des transports urbains</p>
                            </div>
                        </div>

                        <p className="text-xs font-semibold tracking-[0.2em] text-white/70 mb-3">BIENVENUE</p>
                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                            Le tableau de bord<br />de votre réseau
                        </h2>
                        <p className="text-sm text-white/75 leading-relaxed max-w-xs">
                            Suivez vos lignes, vos véhicules et vos ventes depuis un seul endroit.
                        </p>
                    </div>

                    <div className="relative z-10" />
                </div>

                {/* Panneau droit — formulaire */}
                <div className="lg:w-1/2 p-9 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="w-full max-w-sm mx-auto">

                        <h3 className="text-2xl font-bold mb-1.5" style={{ color: '#2C2C2C' }}>Connexion</h3>
                        {/*<p className="text-sm mb-7" style={{ color: 'rgba(44,44,44,0.55)' }}>*/}
                        {/*    Accédez à votre espace administrateur.*/}
                        {/*</p>*/}

                        {/* Erreur */}
                        {error && (
                            <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ background: '#fdeceb', border: '1px solid #f3c9c6' }}>
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#c2453c' }} />
                                <p className="text-xs" style={{ color: '#8f3129' }}>{error}</p>
                            </div>
                        )}

                        {/* Champs */}
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(44,44,44,0.6)' }}>Adresse e-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(44,44,44,0.35)' }} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="admin@tripiz.cm"
                                        disabled={isLoading}
                                        className="tripiz-input w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 disabled:opacity-50"
                                        style={{ color: '#2C2C2C', background: '#F0F6F6', border: '1px solid #e6ecec' }}
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-medium" style={{ color: 'rgba(44,44,44,0.6)' }}>Mot de passe</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="tripiz-link text-xs font-semibold tracking-wide transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? 'MASQUER' : 'AFFICHER'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(44,44,44,0.35)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="••••••••••"
                                        disabled={isLoading}
                                        className="tripiz-input w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 disabled:opacity-50"
                                        style={{ color: '#2C2C2C', background: '#F0F6F6', border: '1px solid #e6ecec' }}
                                    />
                                </div>
                            </div>


                            {/* Bouton connexion */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="tripiz-submit w-full py-3 px-5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                                style={{ background: isLoading ? '#9ca3af' : 'linear-gradient(90deg, #3A68C4, #498BD2)', boxShadow: isLoading ? 'none' : '0 10px 24px rgba(58,104,196,0.35)' }}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Connexion…
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripizAdminLogin;