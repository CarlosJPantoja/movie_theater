import { Delete } from "@mui/icons-material"
import { Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const date = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
})

const ReservationsTable = ({ reservations, handleDelete }) => {

    const getSeats = (reservation) => {
        const identifier = reservation.username + reservation.id 

        const letters = []
        let count = 0
        reservation.schedule.distribution.forEach((row, i) => {
            const rowStatus = row.every(seat => seat === "empty")
            if (rowStatus) {
                letters.push("")
                count++
            } else {
                letters.push(alphabet[i - count])
            }
        })

        const seats = []
        reservation.schedule.distribution.map((seatsRow, row) => {
            seatsRow.map((seat, column) => {
                if (seat === identifier) {
                    seats.push(`${letters[row]}${column + 1}`)
                }
            })
        })
        return seats.join(', ')
    }

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Portada</TableCell>
                        <TableCell align="center">Pelicula</TableCell>
                        <TableCell align="center">Duración</TableCell>
                        <TableCell align="center">Sala</TableCell>
                        <TableCell align="center">Silla(s)</TableCell>
                        <TableCell align="center">Horario de proyección</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                            <TableCell align="center">
                                <img src={`data:image;base64,${reservation.schedule.movie.cover}`} alt="cover" width="50" height="75" />
                            </TableCell>
                            <TableCell align="center">{reservation.schedule.movie.title}</TableCell>
                            <TableCell align="center">{reservation.schedule.movie.duration} min</TableCell>
                            <TableCell align="center">Sala {reservation.schedule.room.number}</TableCell>
                            <TableCell align="center">{getSeats(reservation)}</TableCell>
                            <TableCell align="center">{date.format(new Date(reservation.schedule.dateTime))}</TableCell>
                            <TableCell align="center">
                                <Fab color="error" size="medium" onClick={() => { handleDelete(reservation) }} aria-label="delete">
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

export default ReservationsTable