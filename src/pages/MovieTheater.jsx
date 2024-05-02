import { AppBar, IconButton, ThemeProvider, Toolbar, Typography } from "@mui/material"
import theme from "../util/theme"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { Login } from "@mui/icons-material"
import { useSelector } from "react-redux"

const MovieTheater = () => {

    const token = useSelector(state => state.movie_theater_auth)

    const navigate = useNavigate()

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="absolute" color="secondary">
                <Toolbar>
                    <img src={logo} alt="logo" width="120" />
                    <IconButton
                        aria-label="login"
                        size="small"
                        color="primary"
                        onClick={() => navigate('/login')}
                        sx={{
                            marginLeft: 'auto'
                        }} >
                        <Login />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}

export default MovieTheater