import * as React from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import axios from '../../util/axios'
import swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { login } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Copyright from '../../components/Copyright'
import background from '../../assets/background.jpg'
import logo from '../../assets/logo.png'
import theme from '../../util/theme'

const Login = () => {

    const [showPassword, setShowPassword] = useState(false)
    const MySwal = withReactContent(swal)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        axios.post('/auth/authenticate', { username: data.get('username'), password: data.get('password') })
            .then(response => {
                dispatch(login(response.data))
                navigate('/')
            })
            .catch((error) => {
                MySwal.fire({
                    title: 'Error al iniciar sesión',
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Volver a intentar',
                    confirmButtonColor: '#0288d1'
                })
            })
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${background})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item container xs={12} sm={8} md={5} alignItems="center" component={Paper}>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: "center"
                        }}
                    >
                        <img src={logo} alt="logo" width="200" />

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Usuario"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="button" aria-label="visibility" onClick={handleShowPassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 4 }}
                            >
                                Iniciar sesión
                            </Button>
                            <Grid container >
                                <Grid item container justifyContent="center" xs>
                                    <Link href="https://www.icesi.edu.co/pic_usuario_unico/newpass" variant="body2" target="_blank">
                                        ¿Olvidó su contraseña?
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 3 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default Login