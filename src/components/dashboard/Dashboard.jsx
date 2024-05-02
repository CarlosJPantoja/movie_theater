import { AppBar, IconButton, ThemeProvider, Toolbar } from "@mui/material"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { Logout } from "@mui/icons-material"
import { logout } from "../../features/auth/authSlice"
import { useDispatch } from "react-redux"
import theme from "../../util/theme"

const Dashboard = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="absolute" color="secondary">
                <Toolbar>
                    <img src={logo} alt="logo" width="120" />
                    <IconButton
                        aria-label="login"
                        size="small"
                        color="primary"
                        onClick={handleLogout}
                        sx={{
                            marginLeft: 'auto'
                        }} >
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}

export default Dashboard