import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
    Users, Bus, MapPin, Ticket, Wallet, AlertTriangle, CheckCircle,
    Download, RefreshCw, DollarSign, Activity, PieChart as PieChartIcon, BarChart3, TrendingUp
} from 'lucide-react';
import { dashboardService } from "../../../Services/DashboardService.js";

const BRAND = {
    blue:      '#3A68C4',
    lightBlue: '#498BD2',
    dark:      '#2C2C2C',
    beige:     '#EFF0EB',
    mint:      '#F0F6F6',
};

const GRADIENT = `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.lightBlue} 100%)`;
const COLORS = [BRAND.blue, BRAND.lightBlue, '#F59E0B', '#EF4444', '#8B5CF6'];

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
            const endDate = now.toISOString();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString();
            return { startDate, endDate };
        }
        default:
            return {};
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


const Pulse = ({ className = '' }) => (
    <div className={`bg-gray-200/80 rounded animate-pulse ${className}`} />
);

const StatCard = ({ label, value, Icon, accent, loading }) => (
    <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent.bar }} />
        <div className="flex items-center justify-between">
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 tracking-wide">{label}</p>
                {loading ? (
                    <Pulse className="h-7 w-20 mt-2" />
                ) : (
                    <p className="text-2xl font-bold mt-1 truncate" style={{ color: BRAND.dark }}>{value}</p>
                )}
            </div>
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
                style={{ background: accent.bg }}
            >
                <Icon className="w-5 h-5" style={{ color: accent.icon }} />
            </div>
        </div>
    </div>
);

const CompactStat = ({ label, value, Icon, color, loading }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0" style={{ background: `${color}14` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                {loading ? <Pulse className="h-5 w-14 mt-1.5" /> : <p className="text-lg font-bold" style={{ color: BRAND.dark }}>{value}</p>}
            </div>
        </div>
    </div>
);

const WalletStat = ({ label, value, loading }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                {loading ? <Pulse className="h-6 w-16 mt-1.5" /> : <p className="text-lg font-bold mt-1" style={{ color: BRAND.dark }}>{value}</p>}
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#8B5CF614' }}>
                <Wallet className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, Icon, iconColor = BRAND.blue, loading, empty, emptyLabel, height = 300, children }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${iconColor}14` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
            </div>
            <h3 className="text-sm font-semibold" style={{ color: BRAND.dark }}>{title}</h3>
        </div>
        {loading ? (
            <Pulse style={{ height }} className="w-full rounded-xl" />
        ) : empty ? (
            <div className="flex flex-col items-center justify-center text-gray-300" style={{ height }}>
                <Icon className="w-9 h-9 mb-2 opacity-40" />
                <p className="text-sm text-gray-400">{emptyLabel}</p>
            </div>
        ) : children}
    </div>
);

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

        const headers = ['Categorie', 'Metrique', 'Valeur', 'Periode'];

        const rows = [
            ['Vue d\'ensemble', 'Utilisateurs Actifs', stats.activeUsers ?? 0, selectedPeriod],
            ['Vue d\'ensemble', 'Bus Actifs', stats.activeBuses ?? 0, selectedPeriod],
            ['Vue d\'ensemble', 'Trajets sur la periode', stats.tripsToday ?? 0, selectedPeriod],
            ['Vue d\'ensemble', 'Revenus sur la periode (FCFA)', stats.revenueToday ?? 0, selectedPeriod],

            ['Tickets', 'Tickets Vendus', stats.ticketsSoldToday ?? 0, selectedPeriod],
            ['Tickets', 'Tickets Utilises', stats.ticketsUsedToday ?? 0, selectedPeriod],
            ['Tickets', 'Tickets Expires', stats.ticketsExpiredToday ?? 0, selectedPeriod],
            ['Tickets', 'Taux d\'Utilisation (%)', `${(stats.ticketUsageRate ?? 0).toFixed(1)}%`, selectedPeriod],

            ['Portefeuilles', 'Solde Total Wallets (FCFA)', stats.totalWalletBalance ?? 0, selectedPeriod],
            ['Portefeuilles', 'Recharges sur la periode', stats.walletRechargesToday ?? 0, selectedPeriod],
            ['Portefeuilles', 'Montant Recharge (FCFA)', stats.rechargeAmountToday ?? 0, selectedPeriod],
            ['Portefeuilles', 'Wallets Actifs', stats.activeWallets ?? 0, selectedPeriod]
        ];

        if (stats.salesByLine && stats.salesByLine.length > 0) {
            rows.push(['', '', '', '']);
            stats.salesByLine.forEach(l => {
                rows.push(['Details par ligne', `Ventes sur ligne: ${l.tripName}`, `${l.passengerCount} passagers`, selectedPeriod]);
            });
        }

        if (stats.paymentMethodUsage && stats.paymentMethodUsage.length > 0) {
            rows.push(['', '', '', '']);
            stats.paymentMethodUsage.forEach(p => {
                rows.push(['Moyens de paiement', p.paymentMethod, `${p.count} transactions (${p.percentage.toFixed(1)}%)`, selectedPeriod]);
            });
        }

        const csvContent = "\uFEFF"
            + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tripiz-stats-${selectedPeriod}.csv`;
        document.body.appendChild(a);
        a.click();

        // 5. Nettoyage
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    const generalStats = [
        { label: 'Utilisateurs Actifs', value: stats?.activeUsers ?? 0, Icon: Users, accent: { bar: GRADIENT, bg: `${BRAND.blue}14`, icon: BRAND.blue } },
        { label: 'Bus Actifs', value: stats?.activeBuses ?? 0, Icon: Bus, accent: { bar: `linear-gradient(135deg, ${BRAND.lightBlue}, #7DB3E8)`, bg: `${BRAND.lightBlue}14`, icon: BRAND.lightBlue } },
        { label: 'Trajets sur la période', value: stats?.tripsToday ?? 0, Icon: MapPin, accent: { bar: `linear-gradient(135deg, ${BRAND.dark}, #5A5A5A)`, bg: `${BRAND.dark}14`, icon: BRAND.dark } },
        { label: 'Revenus sur la période', value: formatFCFA(stats?.revenueToday), Icon: DollarSign, accent: { bar: 'linear-gradient(135deg, #F59E0B, #FBBF24)', bg: '#F59E0B14', icon: '#F59E0B' } },
    ];

    const ticketStats = [
        { label: 'Tickets Vendus', value: stats?.ticketsSoldToday ?? 0, Icon: Ticket, color: BRAND.blue },
        { label: 'Tickets Utilisés', value: stats?.ticketsUsedToday ?? 0, Icon: CheckCircle, color: '#16A34A' },
        { label: 'Tickets Expirés', value: stats?.ticketsExpiredToday ?? 0, Icon: AlertTriangle, color: '#F59E0B' },
        { label: "Taux d'Utilisation", value: `${(stats?.ticketUsageRate ?? 0).toFixed(1)}%`, Icon: Activity, color: '#8B5CF6' },
    ];

    const walletStats = [
        { label: 'Solde Total Wallets', value: formatFCFA(stats?.totalWalletBalance) },
        { label: 'Recharges sur la période', value: stats?.walletRechargesToday ?? 0 },
        { label: 'Montant Rechargé', value: formatFCFA(stats?.rechargeAmountToday) },
        { label: 'Wallets Actifs', value: stats?.activeWallets ?? 0 },
    ];

    const revenueChartData = (stats?.revenueLast7Days ?? []).map(d => ({ day: formatDayLabel(d.day), revenus: d.revenue }));
    const paymentMethodData = (stats?.paymentMethodUsage ?? []).map(p => ({ name: p.paymentMethod, value: p.percentage, count: p.count }));
    const salesByLineData = (stats?.salesByLine ?? []).map(l => ({ name: l.tripName, passagers: l.passengerCount }));
    const rechargeEvolutionData = (stats?.rechargeEvolutionLastWeek ?? []).map(d => ({ day: formatDayLabel(d.day), recharges: d.rechargeCount }));

    const isInitialLoad = loading && !stats;

    const renderOverviewTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {generalStats.map((stat, i) => <StatCard key={i} {...stat} loading={isInitialLoad} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Revenus sur la période"
                    Icon={BarChart3}
                    loading={isInitialLoad}
                    empty={revenueChartData.length === 0}
                    emptyLabel="Aucune donnée sur cette période"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: BRAND.mint }}
                                contentStyle={{ borderRadius: 10, border: '1px solid #EEF0F3', fontSize: 13 }}
                                formatter={(value) => [`${value.toLocaleString('fr-FR')} FCFA`, 'Revenus']}
                            />
                            <Bar dataKey="revenus" fill={BRAND.blue} radius={[6, 6, 0, 0]} maxBarSize={44} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Moyens de Paiement"
                    Icon={PieChartIcon}
                    iconColor="#8B5CF6"
                    loading={isInitialLoad}
                    empty={paymentMethodData.length === 0}
                    emptyLabel="Aucune donnée sur cette période"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={paymentMethodData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={85}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                                labelLine={{ stroke: '#D1D5DB' }}
                            >
                                {paymentMethodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: 10, border: '1px solid #EEF0F3', fontSize: 13 }}
                                formatter={(value, name, props) => [`${props.payload.count} transactions`, name]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );

    const renderTicketsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ticketStats.map((stat, i) => <CompactStat key={i} {...stat} loading={isInitialLoad} />)}
            </div>

            <ChartCard
                title="Ventes par Ligne"
                Icon={TrendingUp}
                loading={isInitialLoad}
                empty={salesByLineData.length === 0}
                emptyLabel="Aucune vente sur cette période"
                height={400}
            >
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesByLineData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: BRAND.mint }}
                            contentStyle={{ borderRadius: 10, border: '1px solid #EEF0F3', fontSize: 13 }}
                            formatter={(value) => [`${value} passagers`, 'Passagers']}
                        />
                        <Bar dataKey="passagers" fill={BRAND.blue} name="passagers" radius={[0, 6, 6, 0]} maxBarSize={22} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );

    const renderWalletsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {walletStats.map((stat, i) => <WalletStat key={i} {...stat} loading={isInitialLoad} />)}
            </div>

            <ChartCard
                title="Évolution des Recharges"
                Icon={TrendingUp}
                iconColor="#8B5CF6"
                loading={isInitialLoad}
                empty={rechargeEvolutionData.length === 0}
                emptyLabel="Aucune donnée sur cette période"
            >
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={rechargeEvolutionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: 10, border: '1px solid #EEF0F3', fontSize: 13 }}
                            formatter={(value) => [`${value}`, 'Recharges']}
                        />
                        <Line type="monotone" dataKey="recharges" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3, fill: '#8B5CF6' }} activeDot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );

    if (error) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100 text-center max-w-md">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-7 h-7 text-red-500" />
                    </div>
                    <p className="text-gray-800 font-semibold mb-1">Impossible de charger les statistiques</p>
                    <p className="text-sm text-gray-500 mb-5">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-transform hover:scale-105"
                        style={{ background: GRADIENT }}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const TABS = [
        { key: 'overview', label: "Vue d'ensemble" },
        { key: 'tickets', label: 'Tickets & Trajets' },
        { key: 'wallets', label: 'Portefeuilles & Paiements' },
    ];

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="p-2 lg:p-4">

                {/* En-tête */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRADIENT }}>
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold" style={{ color: BRAND.dark }}>Tableau de Bord TRIPIZ</h1>
                                <p className="text-gray-500 mt-0.5 text-sm">Tableau de bord analytique du réseau</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
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
                                className="flex items-center px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                                style={{ background: GRADIENT }}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </button>
                            <button
                                onClick={fetchStats}
                                className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
                                title="Actualiser"
                            >
                                <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Onglets */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6 inline-flex flex-wrap gap-1">
                    {TABS.map(tab => {
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className="px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 whitespace-nowrap"
                                style={active
                                    ? { background: GRADIENT, color: '#fff' }
                                    : { color: '#6B7280' }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'tickets' && renderTicketsTab()}
                {activeTab === 'wallets' && renderWalletsTab()}
            </div>
        </div>
    );
};

export default StatisticsPage;