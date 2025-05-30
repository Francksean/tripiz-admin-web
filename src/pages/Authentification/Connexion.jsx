import React, { useState } from 'react';
import { Eye, EyeOff, Bus, Lock, Mail, Shield, BarChart3, Users, Settings, ArrowRight } from 'lucide-react';

const TripizAdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [language, setLanguage] = useState('fr');
    const [isLoading, setIsLoading] = useState(false);

    const translations = {
        fr: {
            welcome: 'Panneau d\'Administration',
            subtitle: 'SOCATUR - Gestion des Transports Urbains',
            tagline: 'Connectez-vous pour gérer la plateforme Tripiz',
            email: 'Adresse e-mail',
            password: 'Mot de passe',
            loginButton: 'Se connecter',
            forgotPassword: 'Mot de passe oublié ?',
            features: {
                stats: 'Statistiques en temps réel',
                users: 'Gestion des utilisateurs',
                routes: 'Gestion des itinéraires',
                tickets: 'Suivi des ventes'
            },
            security: 'Connexion sécurisée',
            loading: 'Connexion...',
            description: 'Gérez efficacement la flotte de bus SOCATUR et optimisez l\'expérience des 700 000 passagers mensuels.'
        },
        en: {
            welcome: 'Administration Panel',
            subtitle: 'SOCATUR - Urban Transport Management',
            tagline: 'Sign in to manage the Tripiz platform',
            email: 'Email address',
            password: 'Password',
            loginButton: 'Sign In',
            forgotPassword: 'Forgot password?',
            features: {
                stats: 'Real-time statistics',
                users: 'User management',
                routes: 'Route management',
                tickets: 'Sales tracking'
            },
            security: 'Secure connection',
            loading: 'Signing in...',
            description: 'Efficiently manage SOCATUR bus fleet and optimize the experience of 700,000 monthly passengers.'
        }
    };

    const t = translations[language];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Admin login:', formData);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Effet de vagues de dégradé animé en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Vague 1 - Mouvement horizontal lent */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.3), rgba(51, 65, 85, 0.4))',
                        animation: 'wave1 20s ease-in-out infinite'
                    }}
                ></div>

                {/* Vague 2 - Mouvement diagonal */}
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(29, 78, 216, 0.4), rgba(59, 130, 246, 0.2))',
                        animation: 'wave2 25s ease-in-out infinite reverse'
                    }}
                ></div>

                {/* Vague 3 - Mouvement vertical */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'linear-gradient(90deg, rgba(51, 65, 85, 0.3), rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.2))',
                        animation: 'wave3 30s ease-in-out infinite'
                    }}
                ></div>

                {/* Vague 4 - Mouvement circulaire */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(29, 78, 216, 0.3), rgba(99, 102, 241, 0.2), rgba(51, 65, 85, 0.3))',
                        animation: 'wave4 35s ease-in-out infinite reverse'
                    }}
                ></div>

                {/* Vague 5 - Effet de superposition fluide */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        background: 'linear-gradient(225deg, rgba(59, 130, 246, 0.2), transparent, rgba(99, 102, 241, 0.3))',
                        animation: 'wave5 40s ease-in-out infinite'
                    }}
                ></div>
            </div>

            {/* Styles CSS pour les animations de vagues */}
            <style jsx>{`
                @keyframes wave1 {
                    0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                    25% { transform: translateX(5%) translateY(-3%) rotate(1deg); }
                    50% { transform: translateX(-3%) translateY(5%) rotate(-1deg); }
                    75% { transform: translateX(7%) translateY(2%) rotate(0.5deg); }
                }
                
                @keyframes wave2 {
                    0%, 100% { transform: translateX(0) translateY(0) scale(1) rotate(0deg); }
                    33% { transform: translateX(-4%) translateY(6%) scale(1.05) rotate(-2deg); }
                    66% { transform: translateX(6%) translateY(-4%) scale(0.95) rotate(2deg); }
                }
                
                @keyframes wave3 {
                    0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
                    20% { transform: translateY(-8%) translateX(3%) rotate(1deg); }
                    40% { transform: translateY(5%) translateX(-2%) rotate(-1deg); }
                    60% { transform: translateY(-3%) translateX(4%) rotate(0.5deg); }
                    80% { transform: translateY(7%) translateX(-5%) rotate(-0.5deg); }
                }
                
                @keyframes wave4 {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(90deg); }
                    50% { transform: scale(0.9) rotate(180deg); }
                    75% { transform: scale(1.05) rotate(270deg); }
                }
                
                @keyframes wave5 {
                    0%, 100% { transform: translateX(0) translateY(0) skewX(0deg); }
                    30% { transform: translateX(-6%) translateY(4%) skewX(2deg); }
                    60% { transform: translateX(8%) translateY(-6%) skewX(-2deg); }
                }
            `}</style>

            {/* Overlay de couleur dynamique existant */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-indigo-900/30 animate-pulse delay-500"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-slate-800/20 via-transparent to-blue-800/30 animate-pulse delay-2000"></div>

            {/* Éléments flottants existants */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large floating orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400 via-blue-500 to-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1000"></div>

                {/* Medium floating elements */}
                <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-gradient-to-r from-slate-400 via-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-500"></div>
                <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-l from-blue-500 via-indigo-400 to-slate-500 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse delay-2000"></div>

                {/* Small accent orbs */}
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-indigo-300 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1500"></div>
                <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-gradient-to-tl from-slate-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-3000"></div>
            </div>

            {/* Language Toggle */}
            <div className="absolute top-6 right-6 z-20">
                <div className="flex bg-white/10 backdrop-blur-lg rounded-full shadow-xl p-1 border border-white/20">
                    <button
                        onClick={() => setLanguage('fr')}
                        className={`px-2 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            language === 'fr'
                                ? 'bg-white/20 text-white shadow-lg scale-100'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        FR
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-2 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            language === 'en'
                                ? 'bg-white/20 text-white shadow-lg scale-100'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        EN
                    </button>
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden h-[85vh] max-h-[650px]">

                    {/* Left Panel - Brand & Features */}
                    <div className="lg:w-3/5 bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-purple-800/90 p-4 lg:p-8 text-white relative overflow-hidden">

                        {/* Additional fluid color overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-blue-500/10 to-slate-600/20 animate-pulse delay-1000"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/30 via-transparent to-indigo-600/20 animate-pulse delay-2500"></div>

                        {/* Subtle pattern overlay with enhanced effects */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="w-full h-full" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM30 10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '40px 40px'
                            }}></div>
                            {/* Additional flowing patterns */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-indigo-400/5 animate-pulse delay-3000"></div>
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            {/* Header */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl mr-3 border border-white/20">
                                        <Bus className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">TRIPIZ</h1>
                                        <p className="text-blue-100 text-xs font-medium mt-1">{t.subtitle}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h2 className="text-lg lg:text-xl font-light mb-2 leading-tight">
                                        {t.welcome}
                                    </h2>
                                    <p className="text-blue-100/90 text-sm leading-relaxed max-w-md">
                                        {t.description}
                                    </p>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {[
                                    { icon: BarChart3, title: t.features.stats, desc: "Métriques" },
                                    { icon: Users, title: t.features.users, desc: "Utilisateurs" },
                                    { icon: Bus, title: t.features.routes, desc: "Itinéraires" },
                                    { icon: Settings, title: t.features.tickets, desc: "Ventes" }
                                ].map((feature, index) => (
                                    <div key={index} className="group bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300">
                                        <feature.icon className="w-5 h-5 text-blue-200 mb-1 group-hover:scale-110 transition-transform duration-300" />
                                        <h3 className="font-semibold text-white mb-1 text-xs">{feature.title}</h3>
                                        <p className="text-blue-200/80 text-xs">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center text-blue-100/80">
                                <Shield className="w-5 h-5 mr-3" />
                                <span className="text-sm font-medium">{t.security}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Login Form */}
                    <div className="lg:w-2/5 p-4 lg:p-6 bg-white/95 backdrop-blur-xl">
                        <div className="h-full flex flex-col justify-center max-w-xs mx-auto">

                            {/* Form Header */}
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-3">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    Connexion Admin
                                </h3>
                                <p className="text-gray-600 text-xs leading-relaxed">
                                    {t.tagline}
                                </p>
                            </div>

                            {/* Login Form */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t.email}
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 focus:bg-white text-gray-800 placeholder-gray-400"
                                            placeholder="admin@socatur.cm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t.password}
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-12 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 focus:bg-white text-gray-800 placeholder-gray-400"
                                            placeholder="••••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors hover:underline"
                                    >
                                        {t.forgotPassword}
                                    </button>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center group"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                            {t.loading}
                                        </>
                                    ) : (
                                        <>
                                            {t.loginButton}
                                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    © 2024 SOCATUR - Tous droits réservés
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Plateforme sécurisée pour administrateurs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripizAdminLogin;