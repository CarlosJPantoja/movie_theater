import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../../../util/axios"

const ScheduleSelector = () => {

    const { movieId } = useParams()

    const { schedule, setSchedule } = useState([])
    const { loading, setLoading } = useState(true)

    const getMovieSchedule = () => {
        axios.get(`/schedule/{movieId}`)
            .then(response => {
                setSchedule(response.data)
                setLoading(false)
            })
    }

    useEffect(() => {
        getMovieSchedule()
    }, [])


    return (
        <div>
            <h1>Schedule Selector</h1>
            <p>Movie ID: {movieId}</p>
        </div>
    )
}

export default ScheduleSelector