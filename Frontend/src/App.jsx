import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import MembersPage from './pages/MembersPage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import EventDetailsPage from './pages/EventDetailsPage.jsx'
import Layout from './components/Layout.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
