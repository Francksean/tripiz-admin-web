import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TripizAdminLogin from "./pages/Authentification/Connexion.jsx";


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TripizAdminLogin />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
