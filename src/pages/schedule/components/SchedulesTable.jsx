import { Delete, Edit } from "@mui/icons-material"
import { Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

const dateTimeFormat = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short'
})

const SchedulesTable = ({ schedules, handleEdit, handleDelete }) => {

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Horario de proyección</TableCell>
                        <TableCell align="center">Pelicula</TableCell>
                        <TableCell align="center">Sala</TableCell>
                        <TableCell align="center" colSpan={2}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {schedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                            <TableCell align="center">{dateTimeFormat.format(new Date(schedule.dateTime))}</TableCell>
                            <TableCell align="center">{schedule.movie.title}</TableCell>
                            <TableCell align="center">Sala {schedule.room.number}</TableCell>
                            <TableCell align="right">
                                <Fab color="info" size="medium" onClick={() => { handleEdit(schedule) }} aria-label="edit">
                                    <Edit />
                                </Fab>
                            </TableCell>
                            <TableCell align="left">
                                <Fab color="error" size="medium" onClick={() => { handleDelete(schedule) }} aria-label="delete">
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

export default SchedulesTable