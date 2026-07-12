import {useEffect, useState} from "react";
import TripizSidebar from "../components/sidebar.jsx";
import ParamManagement from "./Components/ParamComponents.jsx";

const TripizParameter = () => {
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
        <div className="h-dvh flex bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
            <TripizSidebar
                activeItem={activeItem}
                onItemClick={setActiveItem}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={handleToggleCollapse}
            />
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <ParamManagement/>
            </div>
        </div>
    );
};


export default TripizParameter;