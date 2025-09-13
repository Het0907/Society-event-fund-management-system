export default function Card({ title, subtitle, action, children, className = '', variant = 'default' }) {
  const baseStyles = {
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--gray-200)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--shadow)',
    transition: 'all 0.2s ease',
  }

  const variants = {
    default: {},
    elevated: {
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--gray-100)',
    },
    outlined: {
      border: '2px solid var(--gray-200)',
      boxShadow: 'none',
    }
  }

  const cardStyle = {
    ...baseStyles,
    ...variants[variant]
  }

  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={cardStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)'
        e.target.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = variant === 'elevated' ? 'var(--shadow-lg)' : 'var(--shadow)'
      }}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div style={{ flex: 1 }}>
            {title && (
              <h3 style={{ 
                margin: 0, 
                color: 'var(--gray-900)', 
                fontSize: '1.25rem', 
                fontWeight: 600,
                marginBottom: subtitle ? 'var(--space-1)' : 0
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ 
                margin: 0, 
                color: 'var(--gray-500)', 
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div style={{ marginLeft: 'var(--space-4)' }}>
              {action}
            </div>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  )
}


