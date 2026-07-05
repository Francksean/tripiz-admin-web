import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Bus, Lock, Mail, Shield, BarChart3, Users, Settings, ArrowRight, AlertCircle } from 'lucide-react';
import { connectionService } from "../../Services/Connexion.js";


const TRANSLATIONS = {
    fr: {
        subtitle:       'Gestion des Transports Urbains',
        tagline:        'Connectez-vous pour gérer la plateforme',
        email:          'Adresse e-mail',
        password:       'Mot de passe',
        loginButton:    'Se connecter',
        forgotPassword: 'Mot de passe oublié ?',
        features: {
            stats:   'Statistiques en temps réel',
            users:   'Gestion des utilisateurs',
            routes:  'Gestion des itinéraires',
            tickets: 'Suivi des ventes',
        },
        security:    'Connexion sécurisée',
        loading:     'Connexion…',
        description: "Gérez efficacement la flotte de bus et optimisez l'expérience des passagers au quotidien.",
    },
    en: {
        subtitle:       'Urban Transport Management',
        tagline:        'Sign in to manage the platform',
        email:          'Email address',
        password:       'Password',
        loginButton:    'Sign in',
        forgotPassword: 'Forgot password?',
        features: {
            stats:   'Real-time statistics',
            users:   'User management',
            routes:  'Route management',
            tickets: 'Sales tracking',
        },
        security:    'Secure connection',
        loading:     'Signing in…',
        description: 'Efficiently manage your bus fleet and optimize the daily passenger experience.',
    },
};

const FEATURES = [
    { icon: BarChart3, key: 'stats',   desc: 'Métriques'    },
    { icon: Users,     key: 'users',   desc: 'Utilisateurs' },
    { icon: Bus,       key: 'routes',  desc: 'Itinéraires'  },
    { icon: Settings,  key: 'tickets', desc: 'Ventes'       },
];


const TripizAdminLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData]         = useState({ email: '', password: '' });
    const [language, setLanguage]         = useState('fr');
    const [isLoading, setIsLoading]       = useState(false);
    const [error, setError]               = useState('');

    const t = TRANSLATIONS[language];

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
            navigate('/dashboard');
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
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a4a7a 100%)' }}
        >
            {/* Orbes flottants */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
                     style={{ background: 'radial-gradient(circle, #3A6CC4, transparent 70%)', animation: 'pulse 8s ease-in-out infinite' }} />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15"
                     style={{ background: 'radial-gradient(circle, #498ED2, transparent 70%)', animation: 'pulse 10s ease-in-out infinite 2s' }} />
                <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10"
                     style={{ background: 'radial-gradient(circle, #3A6CC4, transparent 70%)', animation: 'pulse 12s ease-in-out infinite 1s' }} />
            </div>

            {/* Sélecteur de langue */}
            <div className="absolute top-5 right-5 z-20 flex rounded-full border border-white/20 overflow-hidden backdrop-blur-md"
                 style={{ background: 'rgba(255,255,255,0.08)' }}>
                {['fr', 'en'].map(lang => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className="px-3 py-1.5 text-sm font-medium transition-all duration-200"
                        style={{
                            background: language === lang ? 'rgba(58,108,196,0.7)' : 'transparent',
                            color: language === lang ? '#fff' : 'rgba(255,255,255,0.6)',
                        }}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Carte principale */}
            <div
                className="w-full max-w-3xl relative z-10 rounded-2xl overflow-hidden flex flex-col lg:flex-row"
                style={{
                    boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.08)',
                    minHeight: '480px',
                }}
            >
                {/* Panneau gauche — marque */}
                <div
                    className="lg:w-3/5 p-5 lg:p-8 flex flex-col justify-between relative"
                    style={{ background: 'linear-gradient(145deg, #1e3a6e 0%, #2a5298 50%, #3A6CC4 100%)' }}
                >
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }} />

                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                 style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.25)' }}>
                                <Bus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wide">TRIPIZ</h1>
                                <p className="text-xs text-white/60">{t.subtitle}</p>
                            </div>
                        </div>

                        {/* Titre + description */}
                        <div className="mb-5">
                            <h2 className="text-xl lg:text-2xl font-light text-white mb-2 leading-tight">
                                Panneau<br />d'administration
                            </h2>
                            <p className="text-sm text-white/70 leading-relaxed max-w-sm">{t.description}</p>
                        </div>

                        {/* Fonctionnalités */}
                        <div className="grid grid-cols-2 gap-3">
                            {FEATURES.map(({ icon: Icon, key, desc }) => (
                                <div
                                    key={key}
                                    className="rounded-xl p-3 flex items-start gap-2.5 group transition-all duration-200"
                                    style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)' }}
                                >
                                    <Icon className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0 group-hover:text-white transition-colors" />
                                    <div>
                                        <p className="text-xs font-medium text-white leading-tight">{t.features[key]}</p>
                                        <p className="text-xs text-white/50 mt-0.5">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badge de sécurité */}
                    <div className="relative z-10 flex items-center gap-2 mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <Shield className="w-4 h-4" />
                        <span className="text-xs">{t.security}</span>
                    </div>
                </div>

                {/* Panneau droit — formulaire */}
                <div className="lg:w-2/5 p-5 lg:p-7 flex flex-col justify-center" style={{ background: '#f8f9fb' }}>
                    <div className="max-w-xs mx-auto w-full">

                        {/* En-tête */}
                        <div className="mb-5">
                            <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center"
                                 style={{ background: 'linear-gradient(135deg, #e8effe, #d4e4fd)' }}>
                                <Lock className="w-4 h-4" style={{ color: '#3A6CC4' }} />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Connexion admin</h3>
                            <p className="text-xs text-gray-500 mt-1">{t.tagline}</p>
                        </div>

                        {/* Erreur */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Champs */}
                        <div className="space-y-3">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.email}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="admin@tripiz.cm"
                                        disabled={isLoading}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-gray-800 border border-gray-200 bg-white focus:outline-none transition-all disabled:opacity-50"
                                        onFocus={(e) => { e.target.style.borderColor = '#3A6CC4'; e.target.style.boxShadow = '0 0 0 3px rgba(58,108,196,0.15)'; }}
                                        onBlur={(e)  => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.password}</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="••••••••••"
                                        disabled={isLoading}
                                        className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-gray-800 border border-gray-200 bg-white focus:outline-none transition-all disabled:opacity-50"
                                        onFocus={(e) => { e.target.style.borderColor = '#3A6CC4'; e.target.style.boxShadow = '0 0 0 3px rgba(58,108,196,0.15)'; }}
                                        onBlur={(e)  => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Mot de passe oublié */}
                            <div className="flex justify-end">
                                <button type="button" className="text-xs font-medium hover:underline" style={{ color: '#3A6CC4' }}>
                                    {t.forgotPassword}
                                </button>
                            </div>

                            {/* Bouton connexion */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full py-2.5 px-5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ background: isLoading ? '#9ca3af' : 'linear-gradient(90deg, #2a5298, #3A6CC4)' }}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {t.loading}
                                    </>
                                ) : (
                                    <>
                                        {t.loginButton}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-5">
                            © 2024 TRIPIZ — Plateforme sécurisée
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripizAdminLogin;