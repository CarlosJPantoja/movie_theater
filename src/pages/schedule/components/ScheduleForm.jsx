import { Close, EditCalendar, Save } from "@mui/icons-material"
import { Fab, Grid, MenuItem, TextField, Typography } from "@mui/material"
import axios from "../../../util/axios"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import Spinner from "../../../components/Spinner"

const ScheduleForm = ({ edit, setEdit, schedule, setSchedule, getSchedules }) => {

    const MySwal = withReactContent(Swal)

    const [movies, setMovies] = useState([])
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    const handleSave = () => {
        const objSchedule = {
            id: schedule.id,
            dateTime: schedule.dateTime,
            movie: schedule.movie.id,
            room: schedule.room.number
        }
        if (edit) {
            axios.put(`/schedule/${schedule.id}`, objSchedule)
                .then(_response => {
                    setEdit(false)
                    setSchedule(null)
                    getSchedules()
                    MySwal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Horario de proyección actualizado correctamente',
                        confirmButtonColor: '#0288d1'
                    })
                })
                .catch(error => {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response.data.message,
                        confirmButtonColor: '#0288d1',
                        confirmButtonText: 'Volver a intentar'
                    })
                })
        } else {
            axios.post('/schedule', objSchedule)
                .then(_response => {
                    setEdit(false)
                    setSchedule(null)
                    getSchedules()
                    MySwal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Horario de proyección guardado correctamente',
                        confirmButtonColor: '#0288d1'
                    })
                })
                .catch(error => {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response.data.message,
                        confirmButtonColor: '#0288d1',
                        confirmButtonText: 'Volver a intentar'
                    })
                })
        }
    }

    const handleCancel = () => {
        setEdit(false)
        setSchedule(null)
        getSchedules()
    }

    const getData = () => {
        axios.get('/movie')
            .then(response => {
                setMovies(response.data)
                axios.get('/room')
                    .then(response => {
                        setRooms(response.data)
                        setLoading(false)
                    })
            })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            {!loading ?
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid container item xs={12} sm={12} spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="date"
                                name="date"
                                label="Fecha"
                                fullWidth
                                type="date"
                                autoComplete="off"
                                variant="standard"
                                size="small"
                                helperText="Seleccione la fecha de la proyección"
                                value={schedule.date}
                                onChange={(e) => setSchedule({ ...schedule, date: e.target.value, dateTime: e.target.value + 'T' + schedule.time })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="time"
                                name="time"
                                label="Hora"
                                fullWidth
                                type="time"
                                autoComplete="off"
                                variant="standard"
                                size="small"
                                helperText="Seleccione la hora de la proyección"
                                value={schedule.time}
                                onChange={(e) => setSchedule({ ...schedule, time: e.target.value, dateTime: schedule.date + 'T' + e.target.value })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                name="movie"
                                label="Pelicula"
                                fullWidth
                                select
                                size="small"
                                helperText="Seleccione la pelicula a proyectar"
                                variant="standard"
                                value={schedule.movie.id}
                                onChange={(e) => setSchedule({ ...schedule, movie: { id: e.target.value } })}
                                inputProps={{
                                    id: 'movie',
                                }}
                            >
                                {movies.map((movie) => (
                                    <MenuItem key={movie.id} value={movie.id}>
                                        <Typography variant="inherit">{movie.title}</Typography>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                name="room"
                                label="Sala"
                                fullWidth
                                select
                                size="small"
                                helperText="Seleccione la sala de proyección"
                                variant="standard"
                                value={schedule.room.number}
                                onChange={(e) => setSchedule({ ...schedule, room: { number: e.target.value } })}
                                inputProps={{
                                    id: 'room',
                                }}
                            >
                                {rooms.map((room) => (
                                    <MenuItem key={room.number} value={room.number}>
                                        <Typography variant="inherit">Sala {room.number}</Typography>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid container item xs={6} sm={6} justifyContent={"right"}>
                        <Fab color="info" size="medium" aria-label="save" onClick={handleSave} disabled={schedule.dateTime === '' || schedule.movie === '' || schedule.room === ''}>
                            <Save />
                        </Fab>
                    </Grid>
                    <Grid container item xs={6} sm={6} justifyContent={"left"}>
                        <Fab color="error" size="medium" aria-label="cancel" onClick={handleCancel}>
                            <Close />
                        </Fab>
                    </Grid>
                </Grid>
                :
                <Spinner Icon={EditCalendar} />
            }
        </>
    )
}

export default ScheduleForm