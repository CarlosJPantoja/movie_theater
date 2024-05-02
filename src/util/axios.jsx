import instance from 'axios'
import { store } from '../stores/auth/authStore'

const axios = instance.create({ baseURL: import.meta.env.VITE_URL_API })

axios.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const token = state.movie_theater_auth.token
        config.headers.Authorization = token ? `Bearer ${token}` : ''
        return config
    }
)

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error && error.response && error.response.status === 401)
            store.dispatch({ type: 'movie_theater_auth/expired' })
        return Promise.reject(error)
    }
)

export default axios