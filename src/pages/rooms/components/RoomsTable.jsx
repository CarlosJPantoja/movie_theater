import { Delete, Edit } from "@mui/icons-material"
import { Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

const RoomsTable = ({ rooms, handleEdit, handleDelete }) => {

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Sala</TableCell>
                        <TableCell align="center">Capacidad</TableCell>
                        <TableCell align="center" colSpan={2}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rooms.map((room) => (
                        <TableRow key={room.number}>
                            <TableCell align="center">Sala {room.number}</TableCell>
                            <TableCell align="center">{room.capacity}</TableCell>
                            <TableCell align="right">
                                <Fab color="info" size="medium" onClick={() => { handleEdit(room) }} aria-label="edit">
                                    <Edit />
                                </Fab>
                            </TableCell>
                            <TableCell align="left">
                                <Fab color="error" size="medium" onClick={() => { handleDelete(room) }} aria-label="delete">
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

export default RoomsTable