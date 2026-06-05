import { useState, useEffect } from 'react'
import { getUser, getTakes, getPredictions } from '../api'

function Profile({ userId }) {
  const [user, setUser] = useState(null)
  const [takes, setTakes] = useState([])
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getUser(userId),
      getTakes({ user_id: userId }),
      getPredictions({ user_id: userId }),
    ]).then(([u, t, p]) => {
      setUser(u.data.data)
      setTakes(t.data.data)
      setPredictions(p.data.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  if (loading) return <div style={styles.loading}>Loading profile...</div>
  if (!user) return <div style={styles.loading}>Profile not found.</div>

  const totalScore = takes.reduce((s, t) => s + (t.ai_rating || 0), 0)
  const correctPredictions = predictions.filter(p => p.is_correct).length

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
        <h2 style={styles.name}>{user.name}</h2>
        <p style={styles.sub}>{user.favorite_club} · Supporting {user.favorite_international_team}</p>
        <p style={styles.player}>⭐ {user.favorite_player}</p>
      </div>

      <div style={styles.content}>
        <div style={styles.statsRow}>
          {[
            { label: 'Total Score', value: totalScore },
            { label: 'Takes Posted', value: takes.length },
            { label: 'Predictions', value: predictions.length },
            { label: 'Correct', value: correctPredictions },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <span style={styles.statValue}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <h3 style={styles.sectionTitle}>Recent Hot Takes</h3>
        {takes.length === 0 ? (
          <p style={styles.empty}>No takes yet. Go post some!</p>
        ) : (
          takes.slice(0, 5).map(take => (
            <div key={take.id} style={styles.takeCard}>
              <p style={styles.takeText}>{take.hot_take_text}</p>
              <div style={styles.takeFooter}>
                {take.ai_rating ? (
                  <span style={styles.rating}>⭐ {take.ai_rating}/10</span>
                ) : (
                  <span style={styles.pending}>Rating pending...</span>
                )}
                {take.ai_roast && <p style={styles.roast}>🔥 {take.ai_roast}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0A1628' },
  loading: { color: '#8899AA', textAlign: 'center', padding: '80px', fontSize: '16px' },
  hero: {
    position: 'relative', padding: '48px 24px 40px',
    textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(227,24,55,0.12) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  avatar: {
    width: '72px', height: '72px', borderRadius: '50%',
    backgroundColor: '#E31837', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '32px', fontWeight: 700, margin: '0 auto 16px',
    position: 'relative', fontFamily: "'Bebas Neue', sans-serif",
  },
  name: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px',
    letterSpacing: '4px', color: '#FFFFFF', position: 'relative',
  },
  sub: { color: '#8899AA', fontSize: '13px', marginTop: '6px', position: 'relative' },
  player: { color: '#E31837', fontSize: '13px', marginTop: '4px', fontWeight: 600, position: 'relative' },
  content: { maxWidth: '680px', margin: '0 auto', padding: '32px 24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' },
  statCard: {
    backgroundColor: '#0D1F3C', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '20px 16px', textAlign: 'center',
  },
  statValue: {
    display: 'block', fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '36px', color: '#E31837', letterSpacing: '2px',
  },
  statLabel: { fontSize: '11px', color: '#8899AA', letterSpacing: '1px', textTransform: 'uppercase' },
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px',
    letterSpacing: '3px', color: '#FFFFFF', marginBottom: '16px',
  },
  empty: { color: '#8899AA', fontSize: '14px' },
  takeCard: {
    backgroundColor: '#0D1F3C', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '16px', marginBottom: '12px',
  },
  takeText: { color: '#FFFFFF', fontSize: '14px', lineHeight: 1.6, marginBottom: '10px' },
  takeFooter: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  rating: { fontSize: '13px', color: '#F5C518', fontWeight: 600 },
  pending: { fontSize: '12px', color: '#8899AA', fontStyle: 'italic' },
  roast: { fontSize: '12px', color: '#E31837', fontStyle: 'italic', marginTop: '6px', width: '100%' },
}

export default Profile