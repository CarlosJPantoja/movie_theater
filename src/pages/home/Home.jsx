import { useEffect, useState } from "react"
import axios from "../../util/axios"
import Spinner from "../../components/Spinner"
import { Chair, Close, LocalMovies, Save } from "@mui/icons-material"
import { Alert, Box, CardActionArea, Chip, Fab, Grid, IconButton, Paper, Typography } from "@mui/material"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const date = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
})


const dateFull = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeStyle: 'short'
})

const Home = () => {

    const token = useSelector(state => state.movie_theater_auth.token)

    const MySwal = withReactContent(Swal)

    const [letters, setLetters] = useState([])
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [selectedSchedule, setSelectedSchedule] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)

    const handleSelectMovie = (movie) => {
        setSelectedMovie(selectedMovie ? null : movie)
        if (selectedMovie) {
            setSelectedSchedule(null)
        }
    }

    const handleSelectSchedule = (schedule) => {
        setSelectedSchedule(selectedSchedule ? null : schedule)
    }

    const getMovies = (actualSchedules) => {
        let movies = actualSchedules.map(schedule => schedule.movie)
        movies = movies.filter((movie, index, self) =>
            index === self.findIndex((m) => (
                m.id === movie.id
            ))
        )
        setMovies(movies)
        setLoading(false)
    }

    const handleSeat = (row, column) => {
        const seatStatus = selectedSchedule.distribution[row][column]
        const newStatus = seatStatus === "active" ? "busy" : seatStatus === "busy" && "active"
        const newSeats = [...selectedSchedule.distribution]
        if (token) {
            newSeats[row][column] = newStatus
        }
        if (newStatus === "busy") {
            setSelectedSeats([...selectedSeats, { row, column }])
        }
        if (newStatus === "active") {
            setSelectedSeats(selectedSeats.filter(seat => seat.row !== row || seat.column !== column))
        }
        setSelectedSchedule({ ...selectedSchedule, distribution: newSeats })
    }

    const getShedules = () => {
        setLoading(true)
        axios.get('/schedule/active')
            .then(response => {
                setSchedules(response.data)
                getMovies(response.data)
            })
    }

    useEffect(() => {
        getShedules()
    }, [])

    const handleCancel = () => {
        setSelectedMovie(null)
        setSelectedSchedule(null)
        setSelectedSeats([])
        getShedules()
    }

    const handleSave = () => {
        const postSchudule = {
            id: selectedSchedule.id,
            dateTime: selectedSchedule.dateTime,
            movie: selectedSchedule.movie.id,
            room: selectedSchedule.room.number,
            distribution: selectedSchedule.distribution
        }

        axios.post('/schedule/reservate', postSchudule)
            .then(response => {
                MySwal.fire({
                    title: 'Reserva exitosa',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0288d1'
                }).then(result => {
                    if (result.isConfirmed) {
                        handleCancel()
                    }
                })
            })
    }

    useEffect(() => {
        if (!selectedSchedule) return
        const newLetters = []
        let count = 0
        selectedSchedule.distribution.forEach((row, i) => {
            const rowStatus = row.every(seat => seat === "empty")
            if (rowStatus) {
                newLetters.push("")
                count++
            } else {
                newLetters.push(alphabet[i - count])
            }
        })
        setLetters(newLetters)
    }, [selectedSchedule])

    return (
        <>
            {!loading ?
                <Grid container spacing={2} alignItems={"center"} justifyContent={"center"} marginY={2} marginBottom={5}>
                    {movies.filter(movie => selectedMovie ? movie.id === selectedMovie.id : true)
                        .map(movie => (
                            <Grid container item xs={12} sm={6} md={4} lg={3} xl={2} key={movie.id} justifyContent={"center"}>
                                <Box xs={12}>
                                    <CardActionArea component="a" onClick={() => handleSelectMovie(movie)}>
                                        <Box component={Paper} xs={12} align="left" padding={2} elevation={3} >
                                            <Grid item xs={12} sm={12}>
                                                <img src={`data:image;base64,${movie.cover}`} alt="cover" width="200" height="300" />
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <Typography variant="h6">{movie.title}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <Typography variant="body1" fontSize={12}>Estreno: {date.format(new Date(movie.relaseDate + 'T00:00:00-05:00'))}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <Typography variant="body1" fontSize={12}>Director(a): {movie.director}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={12} marginTop={1}>
                                                <Chip label={movie.duration + ' min'} />
                                            </Grid>
                                            {selectedSchedule &&
                                                <Grid item xs={12} sm={12} marginTop={1}>
                                                    <Chip label={date.format(new Date(selectedSchedule.dateTime))} />
                                                </Grid>
                                            }
                                        </Box>
                                    </CardActionArea>
                                </Box>
                            </Grid>
                        ))}
                    {selectedMovie && !selectedSchedule &&
                        <Grid container item xs={12} sm={6} md={4} lg={3} xl={2} justifyContent={"center"} flexDirection="column">
                            {schedules
                                .filter(schedule => schedule.movie.id === selectedMovie.id)
                                .map(schedule => (
                                    <Box xs={12} key={schedule.id} align="center">
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={schedule.id} marginTop={1}>
                                            <Chip color="primary" onClick={() => handleSelectSchedule(schedule)} label={dateFull.format(new Date(schedule.dateTime))} key={schedule.id} />
                                        </Grid>
                                    </Box>
                                ))
                            }
                        </Grid>
                    }
                    {selectedSchedule &&
                        <Grid container item xs={12} sm={12} md={12} lg={9} xl={10} justifyContent={"center"}>
                            <Box component={Paper} xs={12} align="center" overflow={"auto"} paddingY={2} elevation={3} >
                                <Grid container minWidth={'650px'}>
                                    <Grid container item xs={11} alignItems={"center"} justifyContent={"center"} minWidth={'650px'}>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography variant="h6" component="h6" align="center" sx={{ color: "primary.dark" }} marginBottom={1}>
                                                PANTALLA SALA {selectedSchedule.room.number}
                                            </Typography>
                                        </Grid>
                                        {selectedSchedule.distribution.map((seatsRow, row) => (
                                            <Grid container key={row} justifyContent={"center"} alignItems={"center"}>
                                                <Grid item xs={1}>
                                                    <Typography variant="h6" component="h6" align="center" sx={{ color: "primary.dark" }}>
                                                        {letters[row]}
                                                    </Typography>
                                                </Grid>
                                                {seatsRow.map((seat, column) => (
                                                    <IconButton size="small" key={column}
                                                        color={seat === "active" ? "success" : seat === "inactive" ? "error" : seat === "busy" ? "info" : "secondary"}
                                                        onClick={() => handleSeat(row, column)}
                                                        disabled={(!(seat === "active") && !(seat === "busy"))}
                                                        sx={{
                                                            ":disabled": {
                                                                color: seat === "empty" ? "white" : "inherit"
                                                            }
                                                        }}
                                                    >
                                                        <Chair />
                                                    </IconButton>
                                                ))}
                                            </Grid>
                                        ))}
                                        <Grid container item xs={12} alignContent={"center"} spacing={2} marginTop={1}>
                                            {token ?
                                                <>
                                                    <Grid container item xs={6} sm={6} justifyContent={"right"}>
                                                        <Fab color="info" size="medium" aria-label="save" disabled={selectedSeats.length === 0} onClick={handleSave}>
                                                            <Save />
                                                        </Fab>
                                                    </Grid>
                                                    <Grid container item xs={6} sm={6} justifyContent={"left"} onClick={handleCancel}>
                                                        <Fab color="error" size="medium" aria-label="cancel">
                                                            <Close />
                                                        </Fab>
                                                    </Grid>
                                                </>
                                                :
                                                <Grid container item xs={12} sm={12} justifyContent={"center"}>
                                                    <Alert severity="warning">Debes iniciar sesión para reservar</Alert>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid >
                    }
                </Grid >
                :
                <Spinner Icon={LocalMovies} />
            }
        </>
    )
}

export default Home