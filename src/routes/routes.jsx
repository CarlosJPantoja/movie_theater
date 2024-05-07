import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useSelector } from "react-redux"
import Login from '../pages/login/Login'
import Dashboard from '../components/dashboard/Dashboard'
import Home from '../pages/home/Home'
import Movies from '../pages/movies/Movies'
import Rooms from '../pages/rooms/Rooms'
import Schedule from '../pages/schedule/Schedule'
import Reservations from '../pages/reservations/Reservations'

export default function Routes() {

	const token = useSelector(state => state.movie_theater_auth.token)
	const role = useSelector(state => state.movie_theater_auth.role)

	const router = createBrowserRouter(
		[
			{
				path: "*",
				element: <Navigate to="/" />
			},
			{
				path: "/",
				element: <Dashboard />,
				children: [
					{
						path: "*",
						element: <Navigate to="/" />
					},
					{
						path: "/",
						element: <Home />
					}
				].concat(token ?
					[
						{
							path: "/reservations",
							element: <Reservations />
						}
					] : []
				).concat(role === 'ROLE_ADMIN' ? [
					{
						path: "/movies",
						element: <Movies />
					},
					{
						path: "/rooms",
						element: <Rooms />
					},
					{
						path: "/schedule",
						element: <Schedule />
					}
				] : [])
			},
			{
				path: "/login",
				element: <Login />
			}
		],
		{
			basename: import.meta.env.VITE_URL
		}
	)

	return (
		<RouterProvider router={router} />
	)
}