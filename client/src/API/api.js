import axios from "axios"

const API_URL = 'http://localhost:5000/api'

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

$api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

$api.interceptors.response.use(config => config, async (error) => {
  const originalRequest = error.config
  if (error.response.status === 401 && error.config && !error.config._isRetry) {
    try {
      const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true })
      localStorage.setItem('token', response.data.access)
      return $api.request(originalRequest)
    } catch (e) {
      console.log('interceptor response не авторизован')
    }
  }
  throw error
})

export default $api