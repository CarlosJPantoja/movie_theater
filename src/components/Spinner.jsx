import { Box, CircularProgress, Grid } from "@mui/material";

const Spinner = ({Icon}) => {
    return (
        <Grid container justifyContent={"center"} sx={{ mb: 4, mt: 6 }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Icon sx={{ color: "primary.main" }} />
                <CircularProgress
                    size={68}
                    sx={{
                        color: "primary.dark",
                        position: 'absolute',
                        left: -22
                    }}
                />
            </Box>
        </Grid>
    )
}

export default Spinner;