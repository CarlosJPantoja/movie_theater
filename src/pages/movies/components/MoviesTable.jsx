import { Delete, Edit } from "@mui/icons-material"
import { Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

const date = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
})

const MoviesTable = ({ movies, handleEdit, handleDelete }) => {
    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Portada</TableCell>
                        <TableCell align="center">Título</TableCell>
                        <TableCell align="center">Director(a)</TableCell>
                        <TableCell align="center">Duración</TableCell>
                        <TableCell align="center">Fecha de estreno</TableCell>
                        <TableCell align="center" colSpan={2}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movies.map((movie) => (
                        <TableRow key={movie.id}>
                            <TableCell align="center">
                                <img src={`data:image;base64,${movie.cover}`} alt="cover" width="50" height="75" />
                            </TableCell>
                            <TableCell align="center">{movie.title}</TableCell>
                            <TableCell align="center">{movie.director}</TableCell>
                            <TableCell align="center">{movie.duration}</TableCell>
                            <TableCell align="center">{date.format(new Date(movie.relaseDate + 'T00:00:00-05:00'))}</TableCell>
                            <TableCell align="right">
                                <Fab color="info" size="medium" onClick={() => { handleEdit(movie) }} aria-label="edit">
                                    <Edit />
                                </Fab>
                            </TableCell>
                            <TableCell align="left">
                                <Fab color="error" size="medium" onClick={() => { handleDelete(movie) }} aria-label="delete">
                                    <Delete />
                                </Fab>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MoviesTable