import { useState } from 'react'
import { createUser, getUsers } from '../api'

function Onboarding({ onUserCreated }) {
  const [mode, setMode] = useState('join') // 'join' or 'login'
  const [form, setForm] = useState({
    name: '', favorite_club: '', favorite_player: '',
    favorite_international_team: '', email: ''
  })
  const [searchName, setSearchName] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleJoin = async () => {
    if (!form.name || !form.favorite_club || !form.favorite_player || !form.favorite_international_team) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await createUser(form)
      onUserCreated(res.data.data.id)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchName.trim()) { setError('Enter your name'); return }
    setLoading(true)
    setError('')
    try {
      const res = await getUsers()
      const matches = res.data.data.filter(u =>
        u.name.toLowerCase().includes(searchName.toLowerCase())
      )
      setSearchResults(matches)
      if (matches.length === 0) setError('No account found with that name.')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (user) => {
    onUserCreated(user.id)
  }

  return (
    <div style={styles.container}>
      <div style={styles.bgPattern} />
      <div style={styles.card}>
        <div style={styles.topBar} />
        <div style={styles.header}>
          <div style={styles.trophy}>🏆</div>
          <h1 style={styles.title}>AI PUNDIT RANKINGS</h1>
          <p style={styles.subtitle}>FIFA World Cup 2026</p>
        </div>

        <div style={styles.modeTabs}>
          <button
            style={{ ...styles.modeTab, ...(mode === 'join' ? styles.modeTabActive : {}) }}
            onClick={() => { setMode('join'); setError(''); setSearchResults([]) }}>
            New Member
          </button>
          <button
            style={{ ...styles.modeTab, ...(mode === 'login' ? styles.modeTabActive : {}) }}
            onClick={() => { setMode('login'); setError(''); setSearchResults([]) }}>
            Already Joined
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {mode === 'join' ? (
          <div style={styles.fields}>
            {[
              { name: 'name', placeholder: 'Your name', required: true },
              { name: 'favorite_club', placeholder: 'Favourite club (e.g. Real Madrid)', required: true },
              { name: 'favorite_international_team', placeholder: 'Team supporting in WC2026', required: true },
              { name: 'favorite_player', placeholder: 'Favourite WC2026 player', required: true },
              { name: 'email', placeholder: 'Email (optional)', required: false },
            ].map(field => (
              <input
                key={field.name}
                style={styles.input}
                name={field.name}
                placeholder={field.placeholder + (field.required ? ' *' : '')}
                value={form[field.name]}
                onChange={handleChange}
              />
            ))}
            <button style={styles.button} onClick={handleJoin} disabled={loading}>
              {loading ? 'JOINING...' : 'JOIN THE PUNDITS ⚽'}
            </button>
          </div>
        ) : (
          <div style={styles.fields}>
            <input
              style={styles.input}
              placeholder="Enter your name to find your account"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
            <button style={styles.button} onClick={handleSearch} disabled={loading}>
              {loading ? 'SEARCHING...' : 'FIND MY ACCOUNT'}
            </button>

            {searchResults.length > 0 && (
              <div style={styles.results}>
                <p style={styles.resultsLabel}>Select your account:</p>
                {searchResults.map(user => (
                  <div key={user.id} style={styles.resultCard} onClick={() => handleSelect(user)}>
                    <span style={styles.resultName}>{user.name}</span>
                    <span style={styles.resultSub}>{user.favorite_club} · {user.favorite_international_team}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p style={styles.note}>Your takes and predictions are rated by AI after every match</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', backgroundColor: '#0A1628',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', position: 'relative', overflow: 'hidden',
  },
  bgPattern: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(227,24,55,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(227,24,55,0.05) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  card: {
    backgroundColor: '#0D1F3C', borderRadius: '16px',
    width: '100%', maxWidth: '460px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden', position: 'relative', zIndex: 1,
  },
  topBar: { height: '4px', background: 'linear-gradient(90deg, #E31837, #ff6b6b, #E31837)' },
  header: { padding: '36px 40px 24px', textAlign: 'center' },
  trophy: { fontSize: '48px', marginBottom: '12px' },
  title: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px',
    letterSpacing: '4px', color: '#FFFFFF', marginBottom: '8px',
  },
  subtitle: { fontSize: '13px', color: '#8899AA', letterSpacing: '0.5px' },
  modeTabs: {
    display: 'flex', margin: '0 40px 20px',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden',
  },
  modeTab: {
    flex: 1, padding: '10px', background: 'none', border: 'none',
    color: '#8899AA', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  modeTabActive: { backgroundColor: '#E31837', color: '#FFFFFF' },
  error: { color: '#E31837', fontSize: '13px', textAlign: 'center', padding: '0 40px 12px' },
  fields: { padding: '0 40px 24px', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    width: '100%', padding: '13px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#FFFFFF', fontSize: '14px', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  button: {
    width: '100%', padding: '15px', backgroundColor: '#E31837',
    color: '#FFFFFF', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: 700, letterSpacing: '2px',
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  results: { marginTop: '8px' },
  resultsLabel: { fontSize: '12px', color: '#8899AA', marginBottom: '8px' },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '12px 16px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px',
  },
  resultName: { fontSize: '15px', fontWeight: 600, color: '#FFFFFF' },
  resultSub: { fontSize: '12px', color: '#8899AA' },
  note: { fontSize: '11px', color: '#8899AA', textAlign: 'center', padding: '0 40px 32px', lineHeight: 1.6 },
}

export default Onboarding