import { createTheme } from "@mui/material"

const theme = createTheme({
    palette: { 
        primary: { 
            light: '#ef5350',
            main: '#c1282d', 
            dark: '#333333' 
        }, 
        secondary: { 
            light: '#f3b268', 
            main: '#ffffff',
            dark: '#eeeeee' 
        }
    }
})

export default theme