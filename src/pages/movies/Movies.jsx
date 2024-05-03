import { Add, Movie } from "@mui/icons-material"
import Header from "../../components/Header"
import Spinner from "../../components/Spinner"
import { Box, Fab, Grid, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import MovieForm from "./components/MovieForm"
import axios from "../../util/axios"
import MoviesTable from "./components/MoviesTable"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const Movies = () => {

    const MySwal = withReactContent(Swal)

    const [movies, setMovies] = useState(null)
    const [movie, setMovie] = useState(null)

    const [edit, setEdit] = useState(false)

    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)

    const getMovies = () => {
        axios.get('/movie')
            .then(response => {
                setMovies(response.data)
                setLoading(false)
                setShow(response.data.length > 0)
            })
    }

    const handleAdd = () => {
        setEdit(false)
        setMovie({
            cover: null,
            title: '',
            director: '',
            duration: '',
            relaseDate: new Date().toISOString().split('T')[0]
        })
    }

    const handleEdit = (movie) => {
        setEdit(true)
        setMovie(movie)
    }

    const handleDelete = (movie) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            confirmButtonColor: '#d32f2f',
            confirmButtonText: 'Eliminar',
            showCancelButton: true,
            cancelButtonColor: '#0288d1',
            cancelButtonText: 'Volver',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/movie/${movie.id}`)
                    .then(_response => {
                        getMovies()
                        MySwal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Película eliminada correctamente',
                            confirmButtonColor: '#0288d1',
                        })
                    })
            }
        })
    }

    useEffect(() => {
        getMovies()
    }, [])

    return (
        <Box component={Paper} xs={12} sx={{ p: 2 }} align="center" elevation={3}>
            <Header title={!movie ? "Películas" : edit ? "Editar pelicula" : 'Añadir pelicula'} />
            {!movie ?
                <>
                    <Grid container justifyContent={"center"}>
                        <Grid item xs={12}>
                            <Fab color="success" size="medium" onClick={() => { handleAdd() }} aria-label="add">
                                <Add />
                            </Fab>
                        </Grid>
                        {loading ?
                            <Spinner Icon={Movie} />
                            :
                            <>
                                {show &&
                                    <MoviesTable movies={movies} handleEdit={handleEdit} handleDelete={handleDelete} />
                                }
                            </>
                        }
                    </Grid>
                </>
                :
                <MovieForm movie={movie} setMovie={setMovie} edit={edit} setEdit={setEdit} getMovies={getMovies} />
            }
        </Box>
    )
}

export default Movies