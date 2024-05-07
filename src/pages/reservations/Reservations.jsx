import { Bookmark } from "@mui/icons-material"
import Header from "../../components/Header"
import Spinner from "../../components/Spinner"
import { Box, Grid, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "../../util/axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import ReservationsTable from "./components/ReservationsTable"
import { useNavigate } from "react-router-dom"

const Reservations = () => {

    const MySwal = withReactContent(Swal)

    const navigate = useNavigate()

    const [reservations, setReservations] = useState(null)

    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)

    const getReservations = () => {
        axios.get('/reservation')
            .then(response => {
                setReservations(response.data)
                setLoading(false)
                setShow(response.data.length > 0)
                if (response.data.length === 0) {
                    MySwal.fire({
                        icon: 'info',
                        title: 'No tienes reservaciones',
                        text: '¡Realiza una reservación para verla aquí!',
                        confirmButtonColor: '#0288d1',
                    }).then(() => {
                        navigate('/')
                    })
                }
            })
    }

    const handleDelete = (reservation) => {
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
                axios.delete(`/reservation/${reservation.id}`)
                    .then(_response => {
                        getReservations()
                        MySwal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Reservación eliminada correctamente',
                            confirmButtonColor: '#0288d1',
                        })
                    })
            }
        })
    }

    useEffect(() => {
        getReservations()
    }, [])

    return (
        <Box component={Paper} xs={12} sx={{ p: 2 }} align="center" elevation={3}>
            <Header title={"Mis reservaciones"} />
            <Grid container justifyContent={"center"}>
                {loading ?
                    <Spinner Icon={Bookmark} />
                    :
                    <>
                        {show &&
                            <ReservationsTable reservations={reservations} handleDelete={handleDelete} />
                        }
                    </>
                }
            </Grid>
        </Box>
    )
}

export default Reservations