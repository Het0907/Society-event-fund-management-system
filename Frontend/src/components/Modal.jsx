import { FaTimes } from 'react-icons/fa'

export default function Modal({ open, title, onClose, children, size = 'md' }) {
  if (!open) return null

  const sizes = {
    sm: '400px',
    md: '520px',
    lg: '720px',
    xl: '900px'
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.6)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 'var(--space-6)', 
        zIndex: 50,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{ 
          background: 'white', 
          borderRadius: 'var(--radius-xl)', 
          width: sizes[size], 
          maxWidth: '100%', 
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          transform: 'scale(1)',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
      >
        <div style={{ 
          padding: 'var(--space-6)', 
          borderBottom: '1px solid var(--gray-200)', 
          display: 'flex', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, var(--gray-50) 0%, white 100%)'
        }}>
          <h3 style={{ 
            margin: 0, 
            flex: 1, 
            color: 'var(--gray-900)',
            fontSize: '1.25rem',
            fontWeight: 600
          }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaTimes />
          </button>
        </div>
        <div style={{ 
          padding: 'var(--space-6)',
          maxHeight: 'calc(90vh - 120px)',
          overflowY: 'auto'
        }}>
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}


