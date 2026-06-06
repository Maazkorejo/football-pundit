import { useState, useEffect } from 'react'
import { getMatches, createTake, createPrediction, createAnalysis } from '../api'

const FLAG_URL = (code) => `https://flagcdn.com/48x36/${code}.png`

const TEAM_FLAGS = {
  'Mexico': 'mx', 'Poland': 'pl', 'Argentina': 'ar', 'Chile': 'cl',
  'France': 'fr', 'Australia': 'au', 'Germany': 'de', 'Japan': 'jp',
  'Brazil': 'br', 'Serbia': 'rs', 'England': 'gb-eng', 'Iran': 'ir',
  'Portugal': 'pt', 'Ghana': 'gh', 'Spain': 'es', 'Costa Rica': 'cr',
  'USA': 'us', 'Canada': 'ca', 'Morocco': 'ma', 'Netherlands': 'nl',
  'Ecuador': 'ec', 'Uruguay': 'uy', 'Nigeria': 'ng', 'Senegal': 'sn',
  'Belgium': 'be', 'Croatia': 'hr', 'Colombia': 'co', 'Denmark': 'dk',
  'Panama': 'pa', 'Peru': 'pe', 'Iceland': 'is', 'Switzerland': 'ch',
}

const statusColors = {
  'Live': '#E31837',
  'Finished': '#27ae60',
  'Upcoming': '#2980b9',
}

function MatchCard({ match, userId }) {
  const [activeTab, setActiveTab] = useState('takes')
  const [takeText, setTakeText] = useState('')
  const [predWinner, setPredWinner] = useState('')
  const [predHome, setPredHome] = useState('')
  const [predAway, setPredAway] = useState('')
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)
  const [error, setError] = useState('')

  const homeFlag = TEAM_FLAGS[match.home_team]
  const awayFlag = TEAM_FLAGS[match.away_team]

  const handlePost = async () => {
    setError('')
    setPosting(true)
    try {
      if (activeTab === 'takes') {
        if (takeText.length < 20) { setError('Min 20 characters'); setPosting(false); return }
        await createTake({ user_id: userId, match_id: match.id, hot_take_text: takeText })
      } else if (activeTab === 'predictions') {
        if (!predWinner) { setError('Select a winner'); setPosting(false); return }
        await createPrediction({
          user_id: userId,
          match_id: match.id,
          predicted_winner: predWinner,
          predicted_home_score: predHome ? parseInt(predHome) : null,
          predicted_away_score: predAway ? parseInt(predAway) : null,
        })
      } else {
        if (takeText.length < 100) { setError('Min 100 characters for analysis'); setPosting(false); return }
        await createAnalysis({ user_id: userId, match_id: match.id, analysis_text: takeText })
      }
      setPosted(true)
      setTakeText('')
      setPredWinner('')
      setPredHome('')
      setPredAway('')
      setTimeout(() => setPosted(false), 3000)
    } catch {
      setError('Failed to post. Try again.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <span style={styles.competition}>{match.competition}</span>
        <span style={{ ...styles.statusBadge, backgroundColor: statusColors[match.status] || '#555' }}>
          {match.status === 'Live' && <span style={styles.liveDot} />}
          {match.status}
        </span>
      </div>

      <div style={styles.matchRow}>
        <div style={styles.teamBlock}>
          {homeFlag && <img src={FLAG_URL(homeFlag)} alt={match.home_team} style={styles.flag} />}
          <span style={styles.teamName}>{match.home_team}</span>
        </div>
        <div style={styles.scoreBlock}>
          {match.status === 'Finished' ? (
            <span style={styles.score}>{match.home_score} – {match.away_score}</span>
          ) : (
            <span style={styles.vs}>VS</span>
          )}
          <span style={styles.matchDate}>
            {new Date(match.match_date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>
        <div style={{ ...styles.teamBlock, alignItems: 'flex-end' }}>
          {awayFlag && <img src={FLAG_URL(awayFlag)} alt={match.away_team} style={styles.flag} />}
          <span style={styles.teamName}>{match.away_team}</span>
        </div>
      </div>

      <div style={styles.tabs}>
        {['takes', 'predictions', 'analysis'].map(tab => (
          <button key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => { setActiveTab(tab); setError(''); setPosted(false) }}>
            {tab === 'takes' ? '🔥 Hot Takes' : tab === 'predictions' ? '🎯 Predictions' : '📊 Analysis'}
          </button>
        ))}
      </div>

      <div style={styles.tabContent}>
        {activeTab === 'predictions' ? (
          <div>
            <div style={styles.predRow}>
              {[match.home_team, 'Draw', match.away_team].map(opt => (
                <button key={opt}
                  style={{ ...styles.predBtn, ...(predWinner === opt ? styles.predBtnActive : {}) }}
                  onClick={() => setPredWinner(opt)}>
                  {opt}
                </button>
              ))}
            </div>
            <div style={styles.scoreInputRow}>
              <input style={styles.scoreInput} placeholder={match.home_team} type="number" min="0" max="20"
                value={predHome} onChange={e => setPredHome(e.target.value)} />
              <span style={{ color: '#8899AA', fontWeight: 700 }}>–</span>
              <input style={styles.scoreInput} placeholder={match.away_team} type="number" min="0" max="20"
                value={predAway} onChange={e => setPredAway(e.target.value)} />
            </div>
            <p style={{ fontSize: '11px', color: '#8899AA', marginBottom: '10px' }}>
              Correct winner = 3pts · Exact score = 5pts
            </p>
          </div>
        ) : (
          <textarea style={styles.textarea}
            placeholder={activeTab === 'takes' ? 'Drop your hot take... (min 20 chars)' : 'Write your pre-match analysis... (min 100 chars)'}
            value={takeText} onChange={e => setTakeText(e.target.value)} rows={3} />
        )}

        {error && <p style={{ color: '#E31837', fontSize: '12px', marginBottom: '8px' }}>{error}</p>}
        {posted && <p style={{ color: '#27ae60', fontSize: '12px', marginBottom: '8px' }}>✅ Posted! AI will rate after the match.</p>}

        <button style={styles.postBtn} onClick={handlePost} disabled={posting}>
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}

function MatchFeed({ userId }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getMatches().then(res => {
      setMatches(res.data.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? matches.filter(m => m.status !== 'Finished')
    : matches.filter(m => m.status === filter)

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <h2 style={styles.heroTitle}>MATCH FEED</h2>
        <p style={styles.heroSub}>Post your takes · Get AI rated · Climb the rankings</p>
      </div>

      <div style={styles.content}>
        <div style={styles.filters}>
          {['all', 'Upcoming', 'Live', 'Finished'].map(f => (
            <button key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Matches' : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loading}>Loading matches...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.loading}>No matches found.</div>
        ) : (
          filtered.map(match => <MatchCard key={match.id} match={match} userId={userId} />)
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
  content: { maxWidth: '680px', margin: '0 auto', padding: '24px' },
  filters: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '8px 18px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'transparent', color: '#8899AA', fontSize: '13px',
    cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500,
  },
  filterActive: { backgroundColor: '#E31837', borderColor: '#E31837', color: '#fff' },
  loading: { color: '#8899AA', textAlign: 'center', padding: '60px 0', fontSize: '15px' },
  card: {
    backgroundColor: '#0D1F3C', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', marginBottom: '20px', overflow: 'hidden',
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 20px 0',
  },
  competition: { fontSize: '11px', color: '#8899AA', letterSpacing: '1px', textTransform: 'uppercase' },
  statusBadge: {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '4px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 700, color: '#fff',
  },
  liveDot: {
    width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff',
  },
  matchRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 20px 16px',
  },
  teamBlock: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', flex: 1 },
  flag: { width: '36px', height: '27px', borderRadius: '3px', objectFit: 'cover' },
  teamName: { fontSize: '15px', fontWeight: 700, color: '#FFFFFF' },
  scoreBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 0.8 },
  score: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#FFFFFF', letterSpacing: '4px' },
  vs: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#E31837', letterSpacing: '3px' },
  matchDate: { fontSize: '11px', color: '#8899AA' },
  tabs: {
    display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tab: {
    flex: 1, padding: '11px 8px', background: 'none', border: 'none',
    color: '#8899AA', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
  },
  tabActive: {
    color: '#FFFFFF', backgroundColor: 'rgba(227,24,55,0.1)',
    borderBottom: '2px solid #E31837',
  },
  tabContent: { padding: '16px 20px' },
  textarea: {
    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
    color: '#FFFFFF', fontSize: '13px', fontFamily: 'Inter, sans-serif',
    resize: 'vertical', outline: 'none', marginBottom: '10px',
  },
  postBtn: {
    padding: '9px 24px', backgroundColor: '#E31837', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px',
  },
  predRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  predBtn: {
    flex: 1, padding: '10px 8px', backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#8899AA', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  predBtnActive: { backgroundColor: 'rgba(227,24,55,0.2)', borderColor: '#E31837', color: '#FFFFFF' },
  scoreInputRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  scoreInput: {
    flex: 1, padding: '10px', backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#FFFFFF', fontSize: '14px', textAlign: 'center',
    fontFamily: 'Inter, sans-serif', outline: 'none',
  },
}

export default MatchFeed