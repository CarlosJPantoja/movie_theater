import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Home, Movie } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Menu({ mobile, toggleDrawer }) {

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
          <Home sx={{ color: "primary.dark" }} />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItemButton>
      {role === 'ROLE_ADMIN' &&
        <ListItemButton component={Link} to="/movies" onClick={closeMenu}>
          <ListItemIcon>
            <Movie sx={{ color: "primary.dark" }} />
          </ListItemIcon>
          <ListItemText primary="Peliculas" />
        </ListItemButton>
      }
    </>
  )
}