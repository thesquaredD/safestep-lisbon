import { Routes, Route, Navigate } from 'react-router'
import { Layout } from '@/components/Layout'
import { OnboardingPage } from '@/pages/Onboarding'
import { MapPage } from '@/pages/Map'
import { SanctuaryPage } from '@/pages/Sanctuary'
import { MeshPage } from '@/pages/Mesh'
import { ProfilePage } from '@/pages/Profile'
import { AuditPage } from '@/pages/Audit'
import { WalkPage } from '@/pages/Walk'

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/map" replace />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/walk" element={<WalkPage />} />
        <Route path="/sanctuary" element={<SanctuaryPage />} />
        <Route path="/mesh" element={<MeshPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
