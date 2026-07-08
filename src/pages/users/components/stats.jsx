import { Users, UserCheck, UserX, Plus } from "lucide-react";

// ── Charte TRIPIZ (cohérente avec StatisticsPage.jsx) ───────────────────────
const BRAND = {
    blue:      '#3A68C4',
    lightBlue: '#498BD2',
    dark:      '#2C2C2C',
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.lightBlue} 100%)`;

const STATS_CONFIG = [
    { key: 'total',     title: 'Total Utilisateurs',    Icon: Users,     accent: { bar: GRADIENT, bg: `${BRAND.blue}14`, icon: BRAND.blue } },
    { key: 'online',    title: 'Utilisateurs en ligne', Icon: UserCheck, accent: { bar: 'linear-gradient(135deg, #16A34A, #4ADE80)', bg: '#16A34A14', icon: '#16A34A' } },
    { key: 'blocked',   title: 'Utilisateurs bloqués',  Icon: UserX,     accent: { bar: 'linear-gradient(135deg, #DC2626, #F87171)', bg: '#DC262614', icon: '#DC2626' } },
    { key: 'thisMonth', title: 'Nouveaux ce mois',      Icon: Plus,      accent: { bar: 'linear-gradient(135deg, #F59E0B, #FBBF24)', bg: '#F59E0B14', icon: '#F59E0B' } },
];

// ── Carte de statistique (même style que StatisticsPage.jsx) ────────────────
const StatCard = ({ title, value, Icon, accent, loading }) => (
    <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent.bar }} />
        <div className="flex items-center justify-between">
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 tracking-wide truncate">{title}</p>
                <p className="text-2xl font-bold mt-1 truncate" style={{ color: BRAND.dark }}>
                    {loading ? '…' : value}
                </p>
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

export const StatsCards = ({ stats = {}, loading = false }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {STATS_CONFIG.map(({ key, title, Icon, accent }) => (
            <StatCard key={key} title={title} value={stats[key] ?? 0} Icon={Icon} accent={accent} loading={loading} />
        ))}
    </div>
);