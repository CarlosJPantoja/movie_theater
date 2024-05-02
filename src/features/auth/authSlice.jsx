import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: 'movie_theater_auth',
	initialState: {
		role: null,
		token: null,
		session: ''
	},
	reducers: {
		login: (state, action) => {
			state.role = action.payload.role
			state.token = action.payload.token
		},
		expired: state => {
			state.role = null
			state.token = null
			state.session = 'expired'
		},
		logout: state => {
			state.role = null
			state.token = null
			state.session = 'logout'
		},
		clear: state => {
			state.session = ''
		}
	}
})


export const { login, logout, expired, clear } = authSlice.actions
export default authSlice.reducer