import { createContext, useContext, useEffect, useState } from "react";

// ─── Breakpoints ──────────────────────────────────────────────────────────────
const MOBILE_BP  = 768;   // < 768px  → tiroir mobile
const TABLET_BP  = 1024;  // < 1024px → collapsed automatiquement sur tablet

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
    const isMobile  = useMediaQuery(MOBILE_BP);
    const isTablet  = useMediaQuery(TABLET_BP);

    // Sur mobile le tiroir est fermé par défaut
    // Sur tablet, collapsed par défaut
    // Sur desktop, on lit localStorage (préférence utilisateur)
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        if (window.innerWidth < MOBILE_BP)  return true;  // tiroir fermé
        if (window.innerWidth < TABLET_BP)  return true;  // réduit sur tablet
        const stored = localStorage.getItem('sidebar-collapsed');
        return stored ? JSON.parse(stored) : false;
    });

    // Auto-collapse quand on passe en mode tablet
    useEffect(() => {
        if (isTablet && !isMobile) {
            setIsCollapsed(true);
        }
    }, [isTablet, isMobile]);

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const next = !prev;
            // Persister uniquement sur desktop
            if (!isMobile && !isTablet) {
                localStorage.setItem('sidebar-collapsed', JSON.stringify(next));
            }
            return next;
        });
    };

    // Sur mobile, fermer le tiroir (=collapsed) via un handler dédié
    const closeMobile = () => setIsCollapsed(true);

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            isMobile,
            isTablet,
            toggleCollapse,
            closeMobile,
        }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
    return ctx;
};

// ─── Hook utilitaire ──────────────────────────────────────────────────────────
function useMediaQuery(breakpoint) {
    const [matches, setMatches] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < breakpoint
    );
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const handler = (e) => setMatches(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [breakpoint]);
    return matches;
}