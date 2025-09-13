import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa'

export default function StatCard({ label, value, trend = 'flat', color = 'var(--gray-800)', subtitle, icon }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <FaArrowUp style={{ color: 'var(--success-600)' }} />
      case 'down':
        return <FaArrowDown style={{ color: 'var(--danger-600)' }} />
      default:
        return <FaMinus style={{ color: 'var(--gray-400)' }} />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'var(--success-600)'
      case 'down':
        return 'var(--danger-600)'
      default:
        return 'var(--gray-500)'
    }
  }

  return (
    <div 
      className="animate-fade-in"
      style={{ 
        background: 'white', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--gray-200)', 
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)'
        e.target.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = 'var(--shadow)'
      }}
    >
      {/* Background accent */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: `linear-gradient(135deg, ${color}10, ${color}05)`,
          borderRadius: '50%',
          transform: 'translate(40px, -40px)',
          pointerEvents: 'none'
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)' 
        }}>
          <div style={{ 
            color: 'var(--gray-600)', 
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {label}
          </div>
          {icon && (
            <div style={{ 
              color: color, 
              fontSize: '1.25rem',
              opacity: 0.7
            }}>
              {icon}
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: 'var(--space-3)',
          marginBottom: subtitle ? 'var(--space-2)' : 0
        }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: color,
            lineHeight: 1
          }}>
            {value}
          </div>
          <div style={{ 
            color: getTrendColor(),
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)'
          }}>
            {getTrendIcon()}
          </div>
        </div>

        {subtitle && (
          <div style={{ 
            color: 'var(--gray-500)', 
            fontSize: '0.75rem',
            lineHeight: 1.4
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}


