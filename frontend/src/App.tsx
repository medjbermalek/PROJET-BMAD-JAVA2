import { Navigate, Route, Routes } from 'react-router-dom'
import { DemandeRappelProvider } from './context/DemandeRappelContext'
import Accueil from './pages/Accueil'
import ConseillerDashboard from './pages/ConseillerDashboard'
import ConseillerLogin from './pages/ConseillerLogin'
import EcranCelebration from './pages/EcranCelebration'
import EcranCreneau from './pages/EcranCreneau'
import EcranIdentite from './pages/EcranIdentite'
import EcranMotif from './pages/EcranMotif'
import EcranRecapitulatif from './pages/EcranRecapitulatif'

function App() {
  return (
    <DemandeRappelProvider>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/client/identite" element={<EcranIdentite />} />
        <Route path="/client/motif" element={<EcranMotif />} />
        <Route path="/client/creneau" element={<EcranCreneau />} />
        <Route path="/client/recapitulatif" element={<EcranRecapitulatif />} />
        <Route path="/client/confirmation" element={<EcranCelebration />} />
        <Route path="/conseiller/login" element={<ConseillerLogin />} />
        <Route path="/conseiller/dashboard" element={<ConseillerDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DemandeRappelProvider>
  )
}

export default App

