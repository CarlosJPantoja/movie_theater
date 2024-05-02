import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useSelector } from "react-redux"
import MovieTheater from '../pages/MovieTheater'
import Login from '../pages/login/Login'
import Dashboard from '../components/dashboard/Dashboard'
import Home from '../pages/home/Home'

export default function Routes() {

	const token = useSelector(state => state.movie_theater_auth.token)

	const router = createBrowserRouter(
		token ?
			[
				{
					path: "*",
					element: <Navigate to="/dashboard" />
				},
				{
					path: "/dashboard",
					element: <Dashboard />,
					children: [
						{
							path: "*",
							element: <Navigate to="/dashboard" />
						},
						{
							path: "/dashboard",
							element: <Home />
						}
					]
				}
			]
			:
			[
				{
					path: "*",
					element: <Navigate to="/" />
				},
				{
					path: "/",
					element: <MovieTheater />

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