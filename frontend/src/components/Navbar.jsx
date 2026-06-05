import { useState } from 'react'

function Navbar({ currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { id: 'feed', label: 'Match Feed' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'profile', label: 'My Profile' },
  ]

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.logo} onClick={() => onNavigate('feed')}>
          <span style={styles.logoIcon}>⚽</span>
          <div>
            <div style={styles.logoTitle}>PUNDIT</div>
            <div style={styles.logoSub}>WC 2026 RANKINGS</div>
          </div>
        </div>

        <div style={styles.links}>
          {links.map(link => (
            <button
              key={link.id}
              style={{
                ...styles.link,
                ...(currentPage === link.id ? styles.linkActive : {})
              }}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
              {currentPage === link.id && <div style={styles.linkUnderline} />}
            </button>
          ))}
        </div>

        <div style={styles.wcBadge}>
          <span style={styles.wcText}>FIFA WC</span>
          <span style={styles.wcYear}>2026</span>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: 'rgba(10,22,40,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(227,24,55,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  logoIcon: { fontSize: '28px' },
  logoTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '22px',
    color: '#FFFFFF',
    letterSpacing: '3px',
    lineHeight: 1,
  },
  logoSub: {
    fontSize: '9px',
    color: '#E31837',
    letterSpacing: '2px',
    fontWeight: 600,
  },
  links: { display: 'flex', gap: '8px' },
  link: {
    background: 'none',
    border: 'none',
    color: '#8899AA',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '6px',
    position: 'relative',
    transition: 'color 0.2s',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.5px',
  },
  linkActive: { color: '#FFFFFF' },
  linkUnderline: {
    position: 'absolute',
    bottom: '2px',
    left: '16px',
    right: '16px',
    height: '2px',
    backgroundColor: '#E31837',
    borderRadius: '2px',
  },
  wcBadge: {
    backgroundColor: '#E31837',
    padding: '6px 12px',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    lineHeight: 1.2,
  },
  wcText: { fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: '#fff' },
  wcYear: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#fff', letterSpacing: '2px' },
}

export default Navbar