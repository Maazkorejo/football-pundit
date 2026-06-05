import { useState, useEffect } from 'react'
import { getTournamentLeaderboard } from '../api'

const medals = ['🥇', '🥈', '🥉']

function Leaderboard() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTournamentLeaderboard().then(res => {
      setRankings(res.data.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <h2 style={styles.heroTitle}>PUNDIT RANKINGS</h2>
        <p style={styles.heroSub}>Tournament standings · Who has the best football brain?</p>
      </div>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loading}>Loading rankings...</div>
        ) : rankings.length === 0 ? (
          <div style={styles.loading}>No rankings yet. Post some takes!</div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={{ width: 40 }}>#</span>
              <span style={{ flex: 1 }}>Pundit</span>
              <span style={{ width: 80, textAlign: 'center' }}>Takes</span>
              <span style={{ width: 80, textAlign: 'center' }}>Predictions</span>
              <span style={{ width: 80, textAlign: 'center' }}>Total</span>
            </div>
            {rankings.map((r, i) => (
              <div key={r.user.id} style={{ ...styles.row, ...(i === 0 ? styles.firstRow : {}) }}>
                <span style={styles.rank}>{medals[i] || `#${i + 1}`}</span>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{r.user.name}</span>
                  <span style={styles.userSub}>{r.user.favorite_international_team} · {r.user.favorite_club}</span>
                </div>
                <span style={styles.stat}>{r.takes_posted}</span>
                <span style={styles.stat}>{r.predictions_made}</span>
                <span style={styles.totalScore}>{r.total_score}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0A1628' },
  hero: {
    position: 'relative', padding: '48px 24px 40px',
    textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(227,24,55,0.12) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  heroTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px',
    letterSpacing: '6px', color: '#FFFFFF', position: 'relative',
  },
  heroSub: { color: '#8899AA', fontSize: '14px', marginTop: '8px', position: 'relative' },
  content: { maxWidth: '780px', margin: '0 auto', padding: '32px 24px' },
  loading: { color: '#8899AA', textAlign: 'center', padding: '60px 0' },
  table: {
    backgroundColor: '#0D1F3C', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
    fontSize: '11px', color: '#8899AA', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
  },
  row: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
    transition: 'background 0.2s',
  },
  firstRow: { backgroundColor: 'rgba(227,24,55,0.06)' },
  rank: { width: 40, fontSize: '20px' },
  userInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' },
  userName: { fontSize: '15px', fontWeight: 600, color: '#FFFFFF' },
  userSub: { fontSize: '12px', color: '#8899AA' },
  stat: { width: 80, textAlign: 'center', fontSize: '14px', color: '#B8C5D0' },
  totalScore: {
    width: 80, textAlign: 'center', fontSize: '18px', fontWeight: 700,
    color: '#E31837', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px',
  },
}

export default Leaderboard