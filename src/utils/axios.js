import axios from 'axios'

import session from './Session'
import { baseUrl } from 'services/AdminServices'

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: {
    Accept: 'application/json'
  }
})

// Function to refresh access token
const refreshAccessToken = async (refreshToken) => {
  if(refreshToken && refreshToken !== 'undefined'){
    try {
      const res = await axiosInstance.post('/token-refresh/', { refresh: refreshToken });
      return res.data;
    } catch (err) {
      window.location.href = '/login';
      return null;
    }
  }else{
    window.location.href = '/login';
    return null;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const accessToken = session.get('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403 )) {
      const refreshToken = session.get('refreshToken')
          if (refreshToken) {
            try {
              const { refresh, access } = await refreshAccessToken(refreshToken || sessionStorage.getItem('refreshToken'));
              session.set('refreshToken', refresh)
              session.set('accessToken', access)

              error.config.headers['Authorization'] = `Bearer ${access}`
              return axiosInstance(error.config)
            } catch (refreshError) {
              console.error('Error refreshing access token:', refreshError)
              document.location.href = '/login'
            }
          } else window.location.href = '/login';

    } else if (error.response && error.response.status === 401 && error.response.data.details.includes("Token is invalid or expired")) {
      document.location.href = '/login'
    } else if (error.response && error.response.status >= 500) {
      // console.error('Server Error:', error.response.data)
    } else {
      // console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
