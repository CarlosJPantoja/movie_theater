import { Close, Save } from "@mui/icons-material"
import { Fab, Grid, Skeleton, TextField } from "@mui/material"
import axios from "../../../util/axios"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { useState } from "react"

const MovieForm = ({ edit, setEdit, movie, setMovie, getMovies }) => {

    const MySwal = withReactContent(Swal)

    const [file, setFile] = useState('')

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
    })

    const handleSave = () => {
        if (edit) {
            axios.put(`/movie/${movie.id}`, movie)
                .then(_response => {
                    setEdit(false)
                    setMovie(null)
                    getMovies()
                    MySwal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Película actualizada correctamente',
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
            axios.post('/movie', movie)
                .then(_response => {
                    setEdit(false)
                    setMovie(null)
                    getMovies()
                    MySwal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Película guardada correctamente',
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
        setMovie(null)
        getMovies()
    }

    return (
        <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={12} sm={6}>
                {movie.cover ?
                    <Grid item xs={12} sm={12}>
                        <img src={`data:image;base64,${movie.cover}`} alt="cover" width="200" height="300" />
                    </Grid>
                    :
                    <Grid item xs={12} sm={12}>
                        <Skeleton variant="rectangular" width={200} height={300} />
                    </Grid>
                }
            </Grid>
            <Grid container item xs={12} sm={6} spacing={1}>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="file"
                        name="file"
                        label="Portada"
                        fullWidth
                        autoComplete="off"
                        variant="standard"
                        type="file"
                        size="small"
                        helperText="Seleccione la portada de la película"
                        value={file}
                        onChange={(e) => { e.target.files[0] ? toBase64(e.target.files[0]).then(response => { setMovie({ ...movie, cover: response.split('base64,')[1] }) }) : setMovie({ ...movie, cover: null }) ; setFile(e.target.value) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{ accept: "image/*" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        autoFocus
                        id="title"
                        name="title"
                        label="Título"
                        size="small"
                        helperText="Ingrese el título de la película"
                        fullWidth
                        autoComplete="off"
                        variant="standard"
                        value={movie.title}
                        onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="director"
                        name="director"
                        label="Director(a)"
                        size="small"
                        helperText="Ingrese el director de la película"
                        fullWidth
                        autoComplete="off"
                        variant="standard"
                        value={movie.director}
                        onChange={(e) => setMovie({ ...movie, director: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="duration"
                        name="duration"
                        label="Duración"
                        fullWidth
                        size="small"
                        helperText="Ingrese la duración de la película en minutos"
                        autoComplete="off"
                        variant="standard"
                        value={movie.duration}
                        onChange={(e) => setMovie({ ...movie, duration: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="relaseDate"
                        name="relaseDate"
                        label="Fecha de estreno"
                        fullWidth
                        type="date"
                        autoComplete="off"
                        variant="standard"
                        size="small"
                        helperText="Seleccione la fecha de estreno de la película"
                        value={movie.relaseDate}
                        onChange={(e) => setMovie({ ...movie, relaseDate: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={6} sm={6} justifyContent={"right"}>
                <Fab color="info" size="medium" aria-label="save" onClick={handleSave} disabled={!movie.cover || movie.title === '' || movie.director === '' || movie.duration === '' || movie.relaseDate === ''}>
                    <Save />
                </Fab>
            </Grid>
            <Grid container item xs={6} sm={6} justifyContent={"left"}>
                <Fab color="error" size="medium" aria-label="cancel" onClick={handleCancel}>
                    <Close />
                </Fab>
            </Grid>
        </Grid>
    )
}

export default MovieForm