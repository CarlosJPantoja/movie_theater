import { Add, Chair, Close, Remove, Save } from "@mui/icons-material"
import { Box, Fab, Grid, IconButton, Paper, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "../../../util/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const RoomForm = ({ edit, setEdit, room, setRoom, getRooms }) => {

    const MySwal = withReactContent(Swal)

    const [letters, setLetters] = useState([])

    const handleSeat = (row, column) => {
        const seatStatus = room.distribution[row][column]
        const newStatus = seatStatus === "active" ? "inactive" : seatStatus === "inactive" ? "empty" : "active"
        const newSeats = [...room.distribution]
        newSeats[row][column] = newStatus
        setRoom({ ...room, distribution: newSeats })
    }

    const handleAddColumn = () => {
        const newSeats = []
        room.distribution.forEach(row => {
            newSeats.push([...row, "active"])
        })
        setRoom({ ...room, distribution: newSeats })
    }

    const handleRemoveColumn = () => {
        const newSeats = []
        room.distribution.forEach(row => {
            newSeats.push(row.slice(0, row.length - 1))
        })
        setRoom({ ...room, distribution: newSeats })
    }

    const handleAddRow = () => {
        const newSeats = [...room.distribution]
        newSeats.push(new Array(room.distribution[0].length).fill("active"))
        setRoom({ ...room, distribution: newSeats })
    }

    const handleRemoveRow = () => {
        const newSeats = room.distribution.slice(0, room.distribution.length - 1)
        setRoom({ ...room, distribution: newSeats })
    }

    const getCapacity = (room) => {
        let capacity = 0
        room.distribution.forEach(row => {
            row.forEach(seat => {
                if (seat === "active") {
                    capacity++
                }
            })
        })
        return capacity
    }
    
    const handleSave = () => {
        if (edit) {
            axios.put(`/room/${room.number}`, room)
                .then(_response => {
                    setEdit(false)
                    setRoom(null)
                    getRooms()
                    MySwal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Sala actualizada correctamente',
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
            axios.post('/room', room)
                .then(_response => {
                    setEdit(false)
                    setRoom(null)
                    getRooms()
                    MySwal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Sala guardada correctamente',
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
        setRoom(null)
        getRooms()
    }

    useEffect(() => {
        const newLetters = []
        let count = 0
        room.distribution.forEach((row, i) => {
            const rowStatus = row.every(seat => seat === "empty")
            if (rowStatus) {
                newLetters.push("")
                count++
            } else {
                newLetters.push(alphabet[i - count])
            }
        })
        setLetters(newLetters)
        setRoom({ ...room, capacity: getCapacity(room) })
    }, [room.distribution])

    return (
        <>
            <Typography variant="h5" component="h5" align="center" marginBottom={1}>
                Distribución de la sala
            </Typography>
            <Box component={Paper} xs={12} align="center" overflow={"auto"} paddingY={2} elevation={3} >
                <Grid container minWidth={'792px'}>
                    <Grid container item xs={11} alignItems={"center"} aling={"center"} minWidth={'726px'}>
                        {room.distribution.map((seatsRow, row) => (
                            <Grid container key={row} justifyContent={"center"} alignItems={"center"}>
                                <Grid item xs={1}>
                                    <Typography variant="h6" component="h6" align="center" sx={{ color: "primary.dark" }}>
                                        {letters[row]}
                                    </Typography>
                                </Grid>
                                {seatsRow.map((seat, column) => (
                                    <IconButton size="small" key={column} color={seat === "active" ? "success" : seat === "inactive" ? "error" : "secondary"} onClick={() => handleSeat(row, column)}>
                                        <Chair />
                                    </IconButton>
                                ))}
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container item xs={1} alignContent={"center"} minWidth={'66px'}>
                        <Grid container item xs={12} alignItems={"bottom"}>
                            <Fab color="info" size="small" aria-label="add" onClick={handleAddColumn} sx={{ marginBottom: 1 }} disabled={room.distribution[0].length >= 15}>
                                <Add />
                            </Fab>
                        </Grid>
                        <Grid container item xs={12} alignItems={"top"}>
                            <Fab color="error" size="small" aria-label="remove" onClick={handleRemoveColumn} sx={{ marginTop: 1 }} disabled={room.distribution[0].length <= 1}>
                                <Remove />
                            </Fab>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} marginTop={1}>
                        <Grid item xs={11}>
                            <Fab color="error" size="small" aria-label="remove" onClick={handleRemoveRow} sx={{ marginRight: 1 }} disabled={room.distribution.length <= 1}>
                                <Remove />
                            </Fab>
                            <Fab color="info" size="small" aria-label="add" onClick={handleAddRow} sx={{ marginLeft: 1 }} disabled={room.distribution.length >= 15}>
                                <Add />
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2} alignItems={"center"} marginTop={1}>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="number"
                        name="number"
                        label="Número de sala"
                        fullWidth
                        size="small"
                        helperText="Ingrese el número de la sala"
                        autoComplete="off"
                        variant="standard"
                        disabled={edit}
                        value={room.number}
                        onChange={(e) => setRoom({ ...room, number: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                </Grid>
                <Grid container item xs={6} sm={6} justifyContent={"right"}>
                    <Fab color="info" size="medium" aria-label="save" onClick={handleSave} disabled={room.number === ''}>
                        <Save />
                    </Fab>
                </Grid>
                <Grid container item xs={6} sm={6} justifyContent={"left"}>
                    <Fab color="error" size="medium" aria-label="cancel" onClick={handleCancel}>
                        <Close />
                    </Fab>
                </Grid>
            </Grid>
        </>
    )
}

export default RoomForm