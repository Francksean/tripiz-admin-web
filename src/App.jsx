import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TripizAdminLogin from "./pages/Authentification/Connexion.jsx";
import TripizUserManagement from "./pages/users/UserManagement.jsx";
import TripizDashboard from "./pages/Dashboard/Dashboard.jsx";
import TripizItineraries from "./pages/Itineraries/ItinerariesPage.jsx";
import TripizTickets from "./pages/Tickets/TicketsPage.jsx";
import TripizNotification from "./pages/Notifications/NotificationsPage.jsx";
import TripizStatistics from "./pages/Statistics/StatisticsPage.jsx";
import TripizParameter from "./pages/Parameters/ParameterPage.jsx";
import TripizBus from "./pages/Buses/BusPage.jsx";
import TripizTrips from "./pages/Trips/TripsPage.jsx";


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TripizAdminLogin />} />
            <Route path="/dashboard" element={<TripizDashboard />} />
            <Route path="/users" element={<TripizUserManagement />} />
            <Route path="/routes" element={<TripizItineraries />} />
            <Route path="/trips" element={<TripizTrips />} />
            <Route path="/buses" element={<TripizBus />} />
            <Route path="/tickets" element={<TripizTickets />} />
            <Route path="/stats" element={<TripizStatistics />} />
            <Route path="/notifications" element={<TripizNotification />} />
            <Route path="/settings" element={<TripizParameter />} />

        </Routes>
      </BrowserRouter>
  )
}

export default App
