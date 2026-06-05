import { useState } from 'react'
import Onboarding from './pages/Onboarding'
import MatchFeed from './pages/MatchFeed'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('user_id'))
  const [currentPage, setCurrentPage] = useState('feed')

  const handleUserCreated = (id) => {
    localStorage.setItem('user_id', id)
    setUserId(id)
  }

  if (!userId) return <Onboarding onUserCreated={handleUserCreated} />

  return (
    <div>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'feed' && <MatchFeed userId={userId} />}
      {currentPage === 'leaderboard' && <Leaderboard />}
      {currentPage === 'profile' && <Profile userId={userId} />}
    </div>
  )
}

export default App