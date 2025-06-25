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
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-700 to-gray-600 flex items-center justify-center p-4 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #2C2C2C 0%, #3A6CC4 50%, #498ED2 100%)'}}>

            {/* Effet de vagues de dégradé animé en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Vague 1 - Mouvement horizontal lent */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background: 'linear-gradient(45deg, rgba(58, 108, 196, 0.4), rgba(73, 142, 210, 0.3), rgba(44, 44, 44, 0.4))',
                        animation: 'wave1 20s ease-in-out infinite'
                    }}
                ></div>

                {/* Vague 2 - Mouvement diagonal */}
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        background: 'linear-gradient(135deg, rgba(73, 142, 210, 0.3), rgba(58, 108, 196, 0.4), rgba(240, 246, 246, 0.1))',
                        animation: 'wave2 25s ease-in-out infinite reverse'
                    }}
                ></div>

                {/* Vague 3 - Mouvement vertical */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'linear-gradient(90deg, rgba(44, 44, 44, 0.3), rgba(58, 108, 196, 0.4), rgba(73, 142, 210, 0.2))',
                        animation: 'wave3 30s ease-in-out infinite'
                    }}
                ></div>

                {/* Vague 4 - Mouvement circulaire */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(58, 108, 196, 0.3), rgba(73, 142, 210, 0.2), rgba(44, 44, 44, 0.3))',
                        animation: 'wave4 35s ease-in-out infinite reverse'
                    }}
                ></div>

                {/* Vague 5 - Effet de superposition fluide */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        background: 'linear-gradient(225deg, rgba(58, 108, 196, 0.2), transparent, rgba(73, 142, 210, 0.3))',
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

            {/* Overlay de couleur dynamique */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-blue-800/30 animate-pulse delay-500" style={{background: 'linear-gradient(45deg, rgba(58, 108, 196, 0.2), transparent, rgba(73, 142, 210, 0.2))'}}></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-slate-800/20 via-transparent to-blue-800/30 animate-pulse delay-2000" style={{background: 'linear-gradient(225deg, rgba(44, 44, 44, 0.2), transparent, rgba(58, 108, 196, 0.2))'}}></div>

            {/* Éléments flottants */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large floating orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{background: 'linear-gradient(135deg, #498ED2, #3A6CC4, #2C2C2C)'}}></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1000" style={{background: 'linear-gradient(45deg, #3A6CC4, #498ED2, #2C2C2C)'}}></div>

                {/* Medium floating elements */}
                <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-500" style={{background: 'linear-gradient(90deg, #498ED2, #3A6CC4, #2C2C2C)'}}></div>
                <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse delay-2000" style={{background: 'linear-gradient(180deg, #3A6CC4, #498ED2, #2C2C2C)'}}></div>

                {/* Small accent orbs */}
                <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1500" style={{background: 'linear-gradient(135deg, #498ED2, #3A6CC4)'}}></div>
                <div className="absolute bottom-1/4 left-1/2 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-3000" style={{background: 'linear-gradient(225deg, #3A6CC4, #498ED2)'}}></div>
            </div>

            {/* Language Toggle */}
            <div className="absolute top-6 right-6 z-20">
                <div className="flex backdrop-blur-lg rounded-full shadow-xl p-1 border" style={{backgroundColor: 'rgba(240, 246, 246, 0.1)', borderColor: 'rgba(239, 240, 235, 0.2)'}}>
                    <button
                        onClick={() => setLanguage('fr')}
                        className={`px-2 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            language === 'fr'
                                ? 'shadow-lg scale-100 text-white'
                                : 'hover:text-white'
                        }`}
                        style={{
                            backgroundColor: language === 'fr' ? 'rgba(58, 108, 196, 0.6)' : 'transparent',
                            color: language === 'fr' ? '#FFFFFF' : '#EFF0EB'
                        }}
                    >
                        FR
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-2 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            language === 'en'
                                ? 'shadow-lg scale-100 text-white'
                                : 'hover:text-white'
                        }`}
                        style={{
                            backgroundColor: language === 'en' ? 'rgba(58, 108, 196, 0.6)' : 'transparent',
                            color: language === 'en' ? '#FFFFFF' : '#EFF0EB'
                        }}
                    >
                        EN
                    </button>
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row backdrop-blur-2xl rounded-2xl shadow-2xl border overflow-hidden h-[85vh] max-h-[650px]" style={{backgroundColor: 'rgba(240, 246, 246, 0.05)', borderColor: 'rgba(239, 240, 235, 0.1)'}}>

                    {/* Left Panel - Brand & Features */}
                    <div className="lg:w-3/5 p-4 lg:p-8 text-white relative overflow-hidden" style={{background: 'linear-gradient(135deg, #3A6CC4 0%, #498ED2 50%, #2C2C2C 100%)'}}>

                        {/* Additional fluid color overlay */}
                        <div className="absolute inset-0 animate-pulse delay-1000" style={{background: 'linear-gradient(90deg, rgba(73, 142, 210, 0.2), rgba(58, 108, 196, 0.1), rgba(44, 44, 44, 0.2))'}}></div>
                        <div className="absolute inset-0 animate-pulse delay-2500" style={{background: 'linear-gradient(180deg, rgba(58, 108, 196, 0.3), transparent, rgba(73, 142, 210, 0.2))'}}></div>

                        {/* Subtle pattern overlay with enhanced effects */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="w-full h-full" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM30 10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '40px 40px'
                            }}></div>
                            {/* Additional flowing patterns */}
                            <div className="absolute inset-0 animate-pulse delay-3000" style={{background: 'linear-gradient(135deg, rgba(73, 142, 210, 0.05), transparent, rgba(58, 108, 196, 0.05))'}}></div>
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            {/* Header */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="backdrop-blur-sm p-2 rounded-xl mr-3 border" style={{backgroundColor: 'rgba(239, 240, 235, 0.15)', borderColor: 'rgba(239, 240, 235, 0.2)'}}>
                                        <Bus className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">TRIPIZ</h1>
                                        <p className="text-xs font-medium mt-1" style={{color: '#EFF0EB'}}>{t.subtitle}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h2 className="text-lg lg:text-xl font-light mb-2 leading-tight">
                                        {t.welcome}
                                    </h2>
                                    <p className="text-sm leading-relaxed max-w-md" style={{color: 'rgba(239, 240, 235, 0.9)'}}>
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
                                    <div key={index} className="group backdrop-blur-sm p-3 rounded-lg border hover:bg-white/15 transition-all duration-300" style={{backgroundColor: 'rgba(239, 240, 235, 0.1)', borderColor: 'rgba(239, 240, 235, 0.2)'}}>
                                        <feature.icon className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-300" style={{color: '#EFF0EB'}} />
                                        <h3 className="font-semibold text-white mb-1 text-xs">{feature.title}</h3>
                                        <p className="text-xs" style={{color: 'rgba(239, 240, 235, 0.8)'}}>{feature.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center" style={{color: 'rgba(239, 240, 235, 0.8)'}}>
                                <Shield className="w-5 h-5 mr-3" />
                                <span className="text-sm font-medium">{t.security}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Login Form */}
                    <div className="lg:w-2/5 p-4 lg:p-6 backdrop-blur-xl" style={{backgroundColor: 'rgba(239, 240, 235, 0.95)'}}>
                        <div className="h-full flex flex-col justify-center max-w-xs mx-auto">

                            {/* Form Header */}
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{background: 'linear-gradient(135deg, #F0F6F6, #EFF0EB)'}}>
                                    <Lock className="w-5 h-5" style={{color: '#3A6CC4'}} />
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{color: '#2C2C2C'}}>
                                    Connexion Admin
                                </h3>
                                <p className="text-xs leading-relaxed" style={{color: '#2C2C2C'}}>
                                    {t.tagline}
                                </p>
                            </div>

                            {/* Login Form */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{color: '#2C2C2C'}}>
                                        {t.email}
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-blue-500" style={{color: '#2C2C2C'}} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:ring-2 transition-all duration-300 placeholder-gray-400"
                                            style={{
                                                borderColor: '#F0F6F6',
                                                backgroundColor: 'rgba(240, 246, 246, 0.5)',
                                                color: '#2C2C2C'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#3A6CC4';
                                                e.target.style.backgroundColor = '#FFFFFF';
                                                e.target.style.boxShadow = '0 0 0 2px rgba(58, 108, 196, 0.2)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#F0F6F6';
                                                e.target.style.backgroundColor = 'rgba(240, 246, 246, 0.5)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            placeholder="admin@socatur.cm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{color: '#2C2C2C'}}>
                                        {t.password}
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-blue-500" style={{color: '#2C2C2C'}} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-12 py-2.5 border-2 rounded-lg focus:ring-2 transition-all duration-300 placeholder-gray-400"
                                            style={{
                                                borderColor: '#F0F6F6',
                                                backgroundColor: 'rgba(240, 246, 246, 0.5)',
                                                color: '#2C2C2C'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#3A6CC4';
                                                e.target.style.backgroundColor = '#FFFFFF';
                                                e.target.style.boxShadow = '0 0 0 2px rgba(58, 108, 196, 0.2)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#F0F6F6';
                                                e.target.style.backgroundColor = 'rgba(240, 246, 246, 0.5)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            placeholder="••••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors p-1"
                                            style={{color: '#2C2C2C'}}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="font-medium text-sm transition-colors hover:underline"
                                        style={{color: '#3A6CC4'}}
                                        onMouseEnter={(e) => e.target.style.color = '#498ED2'}
                                        onMouseLeave={(e) => e.target.style.color = '#3A6CC4'}
                                    >
                                        {t.forgotPassword}
                                    </button>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center group"
                                    style={{
                                        background: isLoading ? 'linear-gradient(90deg, #9CA3AF, #6B7280)' : 'linear-gradient(90deg, #3A6CC4, #498ED2)',
                                        cursor: isLoading ? 'not-allowed' : 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLoading) {
                                            e.target.style.background = 'linear-gradient(90deg, #2C5299, #3A6CC4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isLoading) {
                                            e.target.style.background = 'linear-gradient(90deg, #3A6CC4, #498ED2)';
                                        }
                                    }}
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
                                <p className="text-xs" style={{color: '#2C2C2C'}}>
                                    © 2024 SOCATUR - Tous droits réservés
                                </p>
                                <p className="text-xs mt-1" style={{color: 'rgba(44, 44, 44, 0.7)'}}>
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