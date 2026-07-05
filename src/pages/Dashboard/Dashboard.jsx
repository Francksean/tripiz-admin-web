import { useState, useEffect } from "react";
import TripizSidebar from "../components/sidebar.jsx";
import { DashboardContent } from "./Components/Dashboard_components.jsx";

const TripizDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try { return JSON.parse(localStorage.getItem("sidebar-collapsed") || "false"); }
        catch { return false; }
    });

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <div className="flex-shrink-0">
                <TripizSidebar
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(p => !p)}
                />
            </div>
            <div className="flex-1 overflow-y-auto min-w-0">
                <div className="p-4 lg:p-8">
                    <DashboardContent />
                </div>
            </div>
        </div>
    );
};

export default TripizDashboard;