import { useState } from 'react'
import { createUser } from '../api'

function Onboarding({ onUserCreated }) {
  const [form, setForm] = useState({
    name: '', favorite_club: '', favorite_player: '',
    favorite_international_team: '', email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
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

  return (
    <div style={styles.container}>
      <div style={styles.bgPattern} />
      <div style={styles.card}>
        <div style={styles.topBar} />
        <div style={styles.header}>
          <div style={styles.trophy}>🏆</div>
          <h1 style={styles.title}>AI PUNDIT RANKINGS</h1>
          <p style={styles.subtitle}>FIFA World Cup 2026 · Join the group</p>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.fields}>
          {[
            { name: 'name', placeholder: 'Your name', required: true },
            { name: 'favorite_club', placeholder: 'Favourite club (e.g. Real Madrid)', required: true },
            { name: 'favorite_international_team', placeholder: 'Team supporting in WC2026 (e.g. Brazil)', required: true },
            { name: 'favorite_player', placeholder: 'Favourite WC2026 player', required: true },
            { name: 'email', placeholder: 'Email (optional)', required: false },
          ].map(field => (
            <div key={field.name} style={styles.inputWrapper}>
              <input
                style={styles.input}
                name={field.name}
                placeholder={field.placeholder + (field.required ? ' *' : '')}
                value={form[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'JOINING...' : 'JOIN THE PUNDITS ⚽'}
        </button>

        <p style={styles.note}>Your predictions and hot takes will be rated by AI after every match</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0A1628',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgPattern: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(227,24,55,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(227,24,55,0.05) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  card: {
    backgroundColor: '#0D1F3C',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '460px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  topBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #E31837, #ff6b6b, #E31837)',
  },
  header: {
    padding: '36px 40px 24px',
    textAlign: 'center',
  },
  trophy: { fontSize: '48px', marginBottom: '12px' },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '32px',
    letterSpacing: '4px',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#8899AA',
    letterSpacing: '0.5px',
  },
  error: {
    color: '#E31837',
    fontSize: '13px',
    textAlign: 'center',
    padding: '0 40px 16px',
  },
  fields: { padding: '0 40px' },
  inputWrapper: { marginBottom: '12px' },
  input: {
    width: '100%',
    padding: '13px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  },
  button: {
    display: 'block',
    width: 'calc(100% - 80px)',
    margin: '20px 40px 0',
    padding: '15px',
    backgroundColor: '#E31837',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  note: {
    fontSize: '11px',
    color: '#8899AA',
    textAlign: 'center',
    padding: '16px 40px 32px',
    lineHeight: 1.6,
  },
}

export default Onboarding