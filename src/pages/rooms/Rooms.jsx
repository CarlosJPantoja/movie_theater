import { Add, MeetingRoom, Movie } from "@mui/icons-material"
import Header from "../../components/Header"
import Spinner from "../../components/Spinner"
import { Box, Fab, Grid, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "../../util/axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import RoomsTable from "./components/RoomsTable"
import RoomForm from "./components/RoomForm"

const Rooms = () => {

    const MySwal = withReactContent(Swal)

    const [rooms, setRooms] = useState(null)
    const [room, setRoom] = useState(null)

    const [edit, setEdit] = useState(false)

    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)

    const getRooms = () => {
        axios.get('/room')
            .then(response => {
                setRooms(response.data)
                setLoading(false)
                setShow(response.data.length > 0)
            })
    }

    const handleAdd = () => {
        setEdit(false)
        setRoom({
            number: '',
            capacity: 0,
            distribution: [
                ["active", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active", "active"],
                ["active", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active", "active"],
                ["active", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active", "active"],
                ["active", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active", "active"],
                ["active", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active", "active"],
                ["active", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active", "active"],
                ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                ["empty", "empty", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active"],
                ["empty", "empty", "active", "active", "active", "active", "active", "empty", "empty", "active", "active", "active", "active", "active"],
                ["empty", "empty", "active", "active", "active", "active", "active", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                ["empty", "empty", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "empty", "empty"]
            ]
        })
    }

    const handleEdit = (room) => {
        setEdit(true)
        setRoom(room)
    }

    const handleDelete = (room) => {
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
                axios.delete(`/room/${room.number}`)
                    .then(_response => {
                        getRooms()
                        MySwal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Sala eliminada correctamente',
                            confirmButtonColor: '#0288d1',
                        })
                    })
            }
        })
    }

    useEffect(() => {
        getRooms()
    }, [])

    return (
        <Box component={Paper} xs={12} sx={{ p: 2 }} align="center" elevation={3}>
            <Header title={!room ? "Salas" : edit ? "Editar sala" : 'Añadir sala'} />
            {!room ?
                <>
                    <Grid container justifyContent={"center"}>
                        <Grid item xs={12}>
                            <Fab color="success" size="medium" onClick={() => { handleAdd() }} aria-label="add">
                                <Add />
                            </Fab>
                        </Grid>
                        {loading ?
                            <Spinner Icon={MeetingRoom} />
                            :
                            <>
                                {show &&
                                    <RoomsTable rooms={rooms} handleEdit={handleEdit} handleDelete={handleDelete} />
                                }
                            </>
                        }
                    </Grid>
                </>
                :
                <RoomForm room={room} setRoom={setRoom} edit={edit} setEdit={setEdit} getRooms={getRooms} />
            }
        </Box>
    )
}

export default Rooms