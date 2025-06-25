import TripizSidebar from "../components/sidebar.jsx";
import {DashboardContent} from "./Components/Dashboard_components.jsx";
import {useEffect, useState} from "react";

const TripizDashboard = () => {
    const [activeItem, setActiveItem] = useState('users');

    // Initialise l'état à partir du localStorage
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const stored = localStorage.getItem("sidebar-collapsed");
        return stored ? JSON.parse(stored) : false;
    });

    // Met à jour le localStorage quand sidebarCollapsed change
    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const handleToggleCollapse = () => {
        setSidebarCollapsed(prev => !prev);
    };

    return (
        <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
            <TripizSidebar
            activeItem={activeItem}
            onItemClick={setActiveItem}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
        />
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-8">
                        <DashboardContent/>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TripizDashboard;