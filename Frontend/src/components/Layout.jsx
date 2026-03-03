import { Link, NavLink, Outlet } from 'react-router-dom'
import { FaClipboardList, FaUsers, FaChartLine, FaBars, FaTimes } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const onChange = (event) => {
      setIsMobile(event.matches)
      if (!event.matches) {
        setSidebarOpen(false)
      }
    }

    setIsMobile(media.matches)

    if (media.addEventListener) {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }

    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [])

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div style={{
        display: 'none',
        background: 'var(--gray-900)',
        color: 'white',
        padding: 'var(--space-4)',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 60,
        boxShadow: 'var(--shadow-lg)'
      }} className="mobile-header">
        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
          🏘️ Society Event Ledger
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-secondary"
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {(!isMobile || sidebarOpen) && (
        <aside 
          className="sidebar open"
          style={{
            background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%)',
            borderRight: '1px solid var(--gray-700)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            overflowY: 'auto',
          }}
        >
        <div style={{ 
          marginBottom: 'var(--space-8)',
          paddingBottom: 'var(--space-4)',
          borderBottom: '2px solid var(--gray-700)'
        }}>
          <div style={{ 
            fontWeight: 800, 
            fontSize: '1.5rem', 
            color: 'white',
            marginBottom: 'var(--space-1)'
          }}>
            🏘️ Society Event
          </div>
          <div style={{ 
            color: 'var(--gray-300)', 
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            Financial Ledger
          </div>
        </div>
        
        <nav style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <NavLink 
            to="/events" 
            style={({ isActive }) => navStyle(isActive)}
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardList style={{ marginRight: 'var(--space-3)', fontSize: '1.1rem' }} /> 
            <span>Events</span>
          </NavLink>
          <NavLink 
            to="/members" 
            style={({ isActive }) => navStyle(isActive)}
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers style={{ marginRight: 'var(--space-3)', fontSize: '1.1rem' }} /> 
            <span>Members</span>
          </NavLink>
        </nav>

        <div style={{ 
          marginTop: 'var(--space-8)', 
          padding: 'var(--space-4)',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-700)'
        }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--gray-400)', 
            marginBottom: 'var(--space-2)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Quick Stats
          </div>
          <div style={{ color: 'var(--gray-300)', fontSize: '0.875rem' }}>
            📊 Financial tracking made simple
          </div>
        </div>
        </aside>
      )}
      
      <main className="main-content">
        {children || <Outlet />}
      </main>

  <style>{`
        .app-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
        }

        .sidebar {
          position: static;
          transform: none;
          height: auto;
          width: auto;
          transition: none;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 45;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex !important;
          }
          .app-container {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr !important;
          }
          .sidebar {
            position: fixed !important;
            height: 100vh !important;
            width: 80vw !important;
            max-width: 320px;
            left: 0;
            top: 0;
            z-index: 50;
            background: var(--gray-900);
            color: white;
            overflow-y: auto;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}

function navStyle(isActive) {
  return {
    display: 'flex', 
    alignItems: 'center', 
    padding: 'var(--space-3) var(--space-4)', 
    borderRadius: 'var(--radius-md)',
    color: isActive ? 'white' : 'var(--gray-300)', 
    textDecoration: 'none',
    background: isActive ? 'var(--primary-600)' : 'transparent',
    transition: 'all 0.2s ease',
    fontWeight: 500,
    fontSize: '0.875rem',
    border: isActive ? '1px solid var(--primary-500)' : '1px solid transparent',
    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
  }
}

