import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import MarcajesMaker from './pages/MarcajesMaker.jsx'
import ComunicadosApp from './pages/ComunicadosApp.jsx'
import MailingsDashboard from './pages/MailingsDashboard.jsx'
import MailingMaker from './pages/MailingMaker.jsx'
import EmailingPlanner from './pages/EmailingPlanner.jsx'
import GraficasMensuales from './pages/GraficasMensuales.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/inpage-maker/*" element={<App />} />
                <Route path="/graficas-mensuales" element={<GraficasMensuales />} />
                <Route path="/marcajes-maker" element={<MarcajesMaker />} />
                <Route path="/comunicados-app" element={<ComunicadosApp />} />
                <Route path="/mailings-dashboard" element={<MailingsDashboard />} />
                <Route path="/mailing-maker" element={<MailingMaker />} />
                <Route path="/emailing-planner" element={<EmailingPlanner />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
