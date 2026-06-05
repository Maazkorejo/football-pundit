import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api'
})

export const createUser = (data) => API.post('/users/', data)
export const getUsers = () => API.get('/users/')
export const getUser = (id) => API.get(`/users/${id}`)

export const getMatches = (status) => API.get('/matches/', { params: { status } })
export const getMatch = (id) => API.get(`/matches/${id}`)

export const createTake = (data) => API.post('/takes/', data)
export const getTakes = (params) => API.get('/takes/', { params })

export const createAnalysis = (data) => API.post('/analyses/', data)
export const getAnalyses = (params) => API.get('/analyses/', { params })

export const createPrediction = (data) => API.post('/predictions/', data)
export const getPredictions = (params) => API.get('/predictions/', { params })

export const getTournamentLeaderboard = () => API.get('/leaderboard/tournament')