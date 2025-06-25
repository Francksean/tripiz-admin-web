import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
    Users, Bus, MapPin, TrendingUp, TrendingDown, Ticket, Wallet, AlertTriangle, CheckCircle, Download, RefreshCw, DollarSign, Activity } from 'lucide-react';

const StatisticsPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('7j');
    const [activeTab, setActiveTab] = useState('overview');

    // Données de statistiques générales
    const generalStats = [
        { label: 'Utilisateurs Actifs', value: '15,234', change: '+12.5%', trend: 'up', icon: Users, color: 'bg-blue-500' },
        { label: 'Bus Actifs', value: '125', change: '+3.2%', trend: 'up', icon: Bus, color: 'bg-green-500' },
        { label: 'Trajets Aujourd\'hui', value: '2,847', change: '-2.1%', trend: 'down', icon: MapPin, color: 'bg-purple-500' },
        { label: 'Revenus du Jour', value: '1,423,500 FCFA', change: '+8.7%', trend: 'up', icon: DollarSign, color: 'bg-yellow-500' }
    ];

    // Données des revenus par jour (7 derniers jours)
    const revenueData = [
        { day: 'Lun', revenus: 1200000, transactions: 2850 },
        { day: 'Mar', revenus: 1350000, transactions: 3200 },
        { day: 'Mer', revenus: 1180000, transactions: 2750 },
        { day: 'Jeu', revenus: 1450000, transactions: 3450 },
        { day: 'Ven', revenus: 1650000, transactions: 3800 },
        { day: 'Sam', revenus: 1850000, transactions: 4200 },
        { day: 'Dim', revenus: 1350000, transactions: 3100 }
    ];

    // Données d'utilisation des lignes
    const routeUsageData = [
        { name: 'Douala Central - Bonabéri', passagers: 4500, revenus: 675000 },
        { name: 'Akwa - Makepe', passagers: 3200, revenus: 400000 },
        { name: 'Bassa - Ndokoti', passagers: 2800, revenus: 490000 },
        { name: 'Bonanjo - Kotto', passagers: 3800, revenus: 532000 },
        { name: 'Deido - New Bell', passagers: 2100, revenus: 315000 }
    ];

    // Répartition des moyens de paiement
    const paymentMethodData = [
        { name: 'MTN Mobile Money', value: 45, count: 12500 },
        { name: 'Orange Money', value: 30, count: 8300 },
        { name: 'Wallet TRIPIZ', value: 20, count: 5500 },
        { name: 'PayPal', value: 5, count: 1400 }
    ];

    // Statistiques des tickets
    const ticketStats = [
        { label: 'Tickets Vendus Aujourd\'hui', value: '2,847', icon: Ticket, color: 'text-blue-600' },
        { label: 'Tickets Utilisés', value: '2,634', icon: CheckCircle, color: 'text-green-600' },
        { label: 'Tickets Expirés', value: '156', icon: AlertTriangle, color: 'text-orange-600' },
        { label: 'Taux d\'Utilisation', value: '92.5%', icon: Activity, color: 'text-purple-600' }
    ];

    // Statistiques des portefeuilles
    const walletStats = [
        { label: 'Solde Total Wallets', value: '45,678,900 FCFA', change: '+15.2%' },
        { label: 'Recharges Aujourd\'hui', value: '234', change: '+5.8%' },
        { label: 'Montant Rechargé', value: '12,450,000 FCFA', change: '+12.1%' },
        { label: 'Wallets Actifs', value: '8,956', change: '+8.9%' }
    ];

    // Données d'activité par heure
    const hourlyActivityData = [
        { hour: '06h', trips: 145, passengers: 1250 },
        { hour: '07h', trips: 280, passengers: 2400 },
        { hour: '08h', trips: 320, passengers: 2850 },
        { hour: '09h', trips: 180, passengers: 1650 },
        { hour: '10h', trips: 160, passengers: 1450 },
        { hour: '11h', trips: 175, passengers: 1580 },
        { hour: '12h', trips: 220, passengers: 1950 },
        { hour: '13h', trips: 190, passengers: 1720 },
        { hour: '14h', trips: 165, passengers: 1480 },
        { hour: '15h', trips: 145, passengers: 1320 },
        { hour: '16h', trips: 185, passengers: 1650 },
        { hour: '17h', trips: 275, passengers: 2450 },
        { hour: '18h', trips: 310, passengers: 2750 },
        { hour: '19h', trips: 240, passengers: 2100 },
        { hour: '20h', trips: 180, passengers: 1580 },
        { hour: '21h', trips: 120, passengers: 1050 }
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Statistiques générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {generalStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <div className={`flex items-center mt-2 text-sm ${
                                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span className="ml-1">{stat.change}</span>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenus par jour */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus des 7 derniers jours</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Revenus']} />
                            <Bar dataKey="revenus" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Répartition des moyens de paiement */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Moyens de Paiement</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={paymentMethodData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({name, value}) => `${name}: ${value}%`}
                            >
                                {paymentMethodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Activité par heure */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité par Heure (Aujourd'hui)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={hourlyActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="passengers" stroke="#3B82F6" strokeWidth={2} name="Passagers" />
                        <Line type="monotone" dataKey="trips" stroke="#10B981" strokeWidth={2} name="Trajets" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderTicketsTab = () => (
        <div className="space-y-6">
            {/* Statistiques des tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ticketStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4`}>
                                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ventes de tickets par ligne */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventes par Ligne</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={routeUsageData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip formatter={(value, name) => [
                            name === 'passagers' ? `${value} passagers` : `${value.toLocaleString()} FCFA`,
                            name === 'passagers' ? 'Passagers' : 'Revenus'
                        ]} />
                        <Bar dataKey="passagers" fill="#3B82F6" name="passagers" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderWalletsTab = () => (
        <div className="space-y-6">
            {/* Statistiques des portefeuilles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {walletStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <div className="flex items-center mt-2 text-sm text-green-600">
                                    <TrendingUp size={16} />
                                    <span className="ml-1">{stat.change}</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Évolution des recharges */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution des Recharges</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, 'Transactions']} />
                        <Line type="monotone" dataKey="transactions" stroke="#8B5CF6" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">
                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Statistiques TRIPIZ</h1>
                            <p className="text-gray-600 mt-1 text-sm">Tableau de bord analytique de votre
                                application</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="24h">Dernières 24h</option>
                                <option value="7j">7 derniers jours</option>
                                <option value="30j">30 derniers jours</option>
                                <option value="3m">3 derniers mois</option>
                                <option value="1a">Dernière année</option>
                            </select>
                            <button
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Download className="w-4 h-4 mr-2"/>
                                Exporter
                            </button>
                            <button
                                className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <RefreshCw className="w-4 h-4 mr-2"/>
                                Actualiser
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation par onglets */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                activeTab === 'overview'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            Vue d'ensemble
                        </button>
                        <button
                            onClick={() => setActiveTab('tickets')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                activeTab === 'tickets'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            Tickets & Trajets
                        </button>
                        <button
                            onClick={() => setActiveTab('wallets')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                activeTab === 'wallets'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            Portefeuilles & Paiements
                        </button>
                    </div>
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'tickets' && renderTicketsTab()}
                {activeTab === 'wallets' && renderWalletsTab()}

                {/* Pied de page avec dernière mise à jour */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;