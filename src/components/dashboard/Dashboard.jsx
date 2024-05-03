import { styled, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Menu from './Menu'
import { Outlet } from 'react-router-dom'
import { Grid, Paper, useMediaQuery } from '@mui/material'
import Copyright from '../Copyright'
import { Login, Logout } from '@mui/icons-material'
import { clear, logout } from '../../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import theme from '../../util/theme'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
            '& .MuiList-root': {
                overflowX: 'hidden',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 65px)',
            },
        },
    }),
)

export default function Dashboard() {

    const token = useSelector(state => state.movie_theater_auth.token)
    const session = useSelector(state => state.movie_theater_auth.session)

    const [open, setOpen] = useState(false)

    const MySwal = withReactContent(Swal)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    let mobile = false
    useMediaQuery('(min-width:900px)') ? (mobile = false) : (mobile = true)

    const toggleDrawer = () => {
        setOpen(!open)
    }

    const handleLogout = () => {
        dispatch(logout())
        if (open) {
            setOpen(false)
        }
        navigate('/')
    }

    const toast = MySwal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', MySwal.stopTimer)
            toast.addEventListener('mouseleave', MySwal.resumeTimer)
        },
    })

    useEffect(() => {
        if (session === 'expired') {
            toast.fire({
                icon: 'warning',
                title: 'Sesión caducada',
            })
        }
        if (session === 'logout') {
            toast.fire({
                icon: 'success',
                title: 'Sesión finalizada',
            })
        }
        dispatch(clear())
    }, [session])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open} color='secondary'>
                    <Toolbar
                        sx={{
                            pr: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {token &&
                            <IconButton
                                edge="start"
                                color="primary"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    ...(open && { display: 'none' })
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        }
                        <img src={logo} alt="Logo" width="100px" hidden={open ? true : false} style={{ marginLeft: token && !mobile ? '45px' : '0px' }} />
                        {token ?
                            <IconButton color="primary" onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
                                <Logout />
                            </IconButton>
                            :
                            <IconButton color="primary" onClick={() => navigate('/login')} sx={{ marginLeft: 'auto' }}>
                                <Login />
                            </IconButton>
                        }
                    </Toolbar>
                </AppBar>
                {token &&
                    <>
                        {!mobile ?
                            <Drawer variant="permanent" open={open}>
                                <Toolbar
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        px: [1],
                                    }}
                                >
                                    <Grid container justifyContent="center">
                                        <img src={logo} alt="Logo" width="100" />
                                    </Grid>
                                    <IconButton color='primary' onClick={toggleDrawer}>
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </Toolbar>
                                <Divider />
                                <List component="nav">
                                    <Menu />
                                </List>
                            </Drawer>
                            :
                            <MuiDrawer
                                variant="temporary"
                                open={open}
                                onClose={toggleDrawer}
                                ModalProps={{
                                    keepMounted: true
                                }}
                                sx={{
                                    display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' },
                                    '& .MuiDrawer-paper': {
                                        boxSizing: 'border-box',
                                        width: drawerWidth,
                                    }
                                }}
                            >
                                <Toolbar
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        px: [1],
                                    }}
                                >
                                    <Grid container justifyContent="center">
                                        <img src={logo} alt="Logo" width="100" />
                                    </Grid>
                                    <IconButton color='primary' onClick={toggleDrawer}>
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </Toolbar>
                                <Divider />
                                <List component="nav">
                                    <Menu mobile={mobile} toggleDrawer={toggleDrawer} />
                                </List>
                            </MuiDrawer>
                        }
                    </>
                }
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth='100%' sx={{ p: 2 }}>
                        <Outlet />
                        <Copyright sx={{ mt: 2 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    )
}