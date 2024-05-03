import { Add, EditCalendar } from "@mui/icons-material"
import Header from "../../components/Header"
import Spinner from "../../components/Spinner"
import { Fab, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "../../util/axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import SchedulesTable from "./components/SchedulesTable"
import ScheduleForm from "./components/ScheduleForm"

const Schedule = () => {

    const MySwal = withReactContent(Swal)

    const [schedules, setSchedules] = useState(null)
    const [schedule, setSchedule] = useState(null)

    const [edit, setEdit] = useState(false)

    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)

    const getSchedules = () => {
        axios.get('/schedule')
            .then(response => {
                setSchedules(response.data)
                setLoading(false)
                setShow(response.data.length > 0)
            })
    }

    const handleAdd = () => {
        setEdit(false)
        setSchedule({
            date: new Date().toISOString().split('T')[0],
            time: new Date().toISOString().split('T')[1].split('.')[0],
            dateTime: new Date().toISOString().split('T')[0] + 'T' + new Date().toISOString().split('T')[1].split('.')[0],
            movie: { id: '' },
            room: { number: '' }
        })
    }

    const handleEdit = (schedule) => {
        schedule.date = schedule.dateTime.split('T')[0]
        schedule.time = schedule.dateTime.split('T')[1].split('.')[0]
        setEdit(true)
        setSchedule(schedule)
    }

    const handleDelete = (schedule) => {
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
                axios.delete(`/schedule/${schedule.id}`)
                    .then(_response => {
                        getSchedules()
                        MySwal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Horario de proyección eliminado correctamente',
                            confirmButtonColor: '#0288d1',
                        })
                    })
            }
        })
    }

    useEffect(() => {
        getSchedules()
    }, [])

    return (
        <>
            <Header title={!schedule ? "Horarios de proyección" : edit ? "Editar horario de proyección" : "Agregar horario de proyección"} />
            {!schedule ?
                <>
                    <Grid container justifyContent={"center"}>
                        <Grid item xs={12}>
                            <Fab color="success" size="medium" onClick={() => { handleAdd() }} aria-label="add">
                                <Add />
                            </Fab>
                        </Grid>
                        {loading ?
                            <Spinner Icon={EditCalendar} />
                            :
                            <>
                                {show &&
                                    <SchedulesTable schedules={schedules} handleEdit={handleEdit} handleDelete={handleDelete} />
                                }
                            </>
                        }
                    </Grid>
                </>
                :
                <ScheduleForm schedule={schedule} setSchedule={setSchedule} edit={edit} setEdit={setEdit} getSchedules={getSchedules} />
            }
        </>
    )
}

export default Schedule