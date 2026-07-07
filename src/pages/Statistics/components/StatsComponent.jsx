import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
    Users, Bus, MapPin, Ticket, Wallet, AlertTriangle, CheckCircle,
    Download, RefreshCw, DollarSign, Activity, Loader2
} from 'lucide-react';
import {dashboardService} from "../../../Services/DashboardService.js";


// Palette de marque TRIPIZ
const BRAND = {
    blue: '#3A68C4',
    lightBlue: '#498BD2',
    dark: '#2C2C2C',
    beige: '#EFF0EB',
    mint: '#F0F6F6',
};

const COLORS = [BRAND.blue, BRAND.lightBlue, '#F59E0B', '#EF4444', '#8B5CF6'];

// Convertit le sélecteur de période UI -> paramètres attendus par l'API
const getPeriodParams = (periodKey) => {
    const now = new Date();
    switch (periodKey) {
        case '24h':
            return { period: '24h' };
        case '7j':
            return { period: '7d' };
        case '30j':
            return { period: '30d' };
        case '1a':
            return { period: 'year' };
        case '3m': {
            // Pas d'équivalent direct côté API : on construit une plage de 3 mois
            const endDate = now.toISOString();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString();
            return { startDate, endDate };
        }
        default:
            return {}; // aucune period -> l'API retombe sur "aujourd'hui"
    }
};

const formatFCFA = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;

const formatDayLabel = (dateStr) => {
    try {
        return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })
            .format(new Date(dateStr));
    } catch {
        return dateStr;
    }
};

const StatisticsPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('7j');
    const [activeTab, setActiveTab] = useState('overview');

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await dashboardService.getAllStatistics(getPeriodParams(selectedPeriod));
            setStats(data);
        } catch (err) {
            setError(err.message || "Erreur lors du chargement des statistiques.");
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleExport = () => {
        if (!stats) return;
        const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tripiz-stats-${selectedPeriod}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ---- Données dérivées des vraies stats (aucune donnée factice) ----

    const generalStats = stats ? [
        { label: 'Utilisateurs Actifs', value: stats.activeUsers ?? 0, icon: Users, color: `bg-[${BRAND.blue}]` },
        { label: 'Bus Actifs', value: stats.activeBuses ?? 0, icon: Bus, color: `bg-[${BRAND.lightBlue}]` },
        { label: 'Trajets sur la période', value: stats.tripsToday ?? 0, icon: MapPin, color: `bg-[${BRAND.dark}]` },
        { label: 'Revenus sur la période', value: formatFCFA(stats.revenueToday), icon: DollarSign, color: 'bg-yellow-500' },
    ] : [];

    const ticketStats = stats ? [
        { label: 'Tickets Vendus', value: stats.ticketsSoldToday ?? 0, icon: Ticket, color: 'text-blue-600' },
        { label: 'Tickets Utilisés', value: stats.ticketsUsedToday ?? 0, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Tickets Expirés', value: stats.ticketsExpiredToday ?? 0, icon: AlertTriangle, color: 'text-orange-600' },
        { label: "Taux d'Utilisation", value: `${(stats.ticketUsageRate ?? 0).toFixed(1)}%`, icon: Activity, color: 'text-purple-600' },
    ] : [];

    const walletStats = stats ? [
        { label: 'Solde Total Wallets', value: formatFCFA(stats.totalWalletBalance) },
        { label: 'Recharges sur la période', value: stats.walletRechargesToday ?? 0 },
        { label: 'Montant Rechargé', value: formatFCFA(stats.rechargeAmountToday) },
        { label: 'Wallets Actifs', value: stats.activeWallets ?? 0 },
    ] : [];

    const revenueChartData = (stats?.revenueLast7Days ?? []).map(d => ({
        day: formatDayLabel(d.day),
        revenus: d.revenue,
    }));

    const paymentMethodData = (stats?.paymentMethodUsage ?? []).map(p => ({
        name: p.paymentMethod,
        value: p.percentage,
        count: p.count,
    }));

    const salesByLineData = (stats?.salesByLine ?? []).map(l => ({
        name: l.tripName,
        passagers: l.passengerCount,
    }));

    const rechargeEvolutionData = (stats?.rechargeEvolutionLastWeek ?? []).map(d => ({
        day: formatDayLabel(d.day),
        recharges: d.rechargeCount,
    }));

    // ---- États de chargement / erreur ----

    if (loading && !stats) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: BRAND.blue }} />
                    <p>Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-red-100 text-center max-w-md">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <p className="text-gray-800 font-medium mb-1">Impossible de charger les statistiques</p>
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="px-4 py-2 text-white rounded-lg transition-colors"
                        style={{ backgroundColor: BRAND.blue }}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const renderOverviewTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {generalStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus sur la période</h3>
                    {revenueChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR')} FCFA`, 'Revenus']} />
                                <Bar dataKey="revenus" fill={BRAND.blue} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-16">Aucune donnée sur cette période</p>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Moyens de Paiement</h3>
                    {paymentMethodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={paymentMethodData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                                >
                                    {paymentMethodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name, props) => [`${props.payload.count} transactions`, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-16">Aucune donnée sur cette période</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderTicketsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ticketStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
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

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventes par Ligne</h3>
                {salesByLineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={salesByLineData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip formatter={(value) => [`${value} passagers`, 'Passagers']} />
                            <Bar dataKey="passagers" fill={BRAND.blue} name="passagers" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-16">Aucune vente sur cette période</p>
                )}
            </div>
        </div>
    );

    const renderWalletsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {walletStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution des Recharges</h3>
                {rechargeEvolutionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={rechargeEvolutionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}`, 'Recharges']} />
                            <Line type="monotone" dataKey="recharges" stroke="#8B5CF6" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-16">Aucune donnée sur cette période</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Statistiques TRIPIZ</h1>
                            <p className="text-gray-600 mt-1 text-sm">Tableau de bord analytique de votre application</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                                style={{ '--tw-ring-color': BRAND.blue }}
                            >
                                <option value="24h">Dernières 24h</option>
                                <option value="7j">7 derniers jours</option>
                                <option value="30j">30 derniers jours</option>
                                <option value="3m">3 derniers mois</option>
                                <option value="1a">Dernière année</option>
                            </select>
                            <button
                                onClick={handleExport}
                                disabled={!stats}
                                className="flex items-center px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
                                style={{ backgroundColor: BRAND.blue }}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </button>
                            <button
                                onClick={fetchStats}
                                className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Actualiser
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex overflow-x-auto">
                        {[
                            { key: 'overview', label: "Vue d'ensemble" },
                            { key: 'tickets', label: 'Tickets & Trajets' },
                            { key: 'wallets', label: 'Portefeuilles & Paiements' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className="px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap"
                                style={activeTab === tab.key
                                    ? { color: BRAND.blue, borderColor: BRAND.blue }
                                    : { color: '#6B7280', borderColor: 'transparent' }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'tickets' && renderTicketsTab()}
                {activeTab === 'wallets' && renderWalletsTab()}
            </div>
        </div>
    );
};

export default StatisticsPage;