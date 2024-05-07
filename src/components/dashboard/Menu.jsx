import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Bookmark, EditCalendar, LocalMovies, MeetingRoom, Movie } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Menu({ mobile, toggleDrawer }) {

  const token = useSelector((state) => state.movie_theater_auth.token)
  const role = useSelector((state) => state.movie_theater_auth.role)

  const closeMenu = () => {
    if (mobile) {
      toggleDrawer()
    }
  }

  return (
    <>
      <ListItemButton component={Link} to="/" onClick={closeMenu}>
        <ListItemIcon>
          <LocalMovies sx={{ color: "primary.dark" }} />
        </ListItemIcon>
        <ListItemText primary="Cartelera" />
      </ListItemButton>
      {token &&
        <ListItemButton component={Link} to="/reservations" onClick={closeMenu}>
          <ListItemIcon>
            <Bookmark sx={{ color: "primary.dark" }} />
          </ListItemIcon>
          <ListItemText primary="Reservaciones" />
        </ListItemButton>
      }
      {role === 'ROLE_ADMIN' &&
        <>
          <ListItemButton component={Link} to="/movies" onClick={closeMenu}>
            <ListItemIcon>
              <Movie sx={{ color: "primary.dark" }} />
            </ListItemIcon>
            <ListItemText primary="Peliculas" />
          </ListItemButton>
          <ListItemButton component={Link} to="/rooms" onClick={closeMenu}>
            <ListItemIcon>
              <MeetingRoom sx={{ color: "primary.dark" }} />
            </ListItemIcon>
            <ListItemText primary="Salas" />
          </ListItemButton>
          <ListItemButton component={Link} to="/schedule" onClick={closeMenu}>
            <ListItemIcon>
              <EditCalendar sx={{ color: "primary.dark" }} />
            </ListItemIcon>
            <ListItemText primary="Horarios" />
          </ListItemButton>
        </>
      }
    </>
  )
}