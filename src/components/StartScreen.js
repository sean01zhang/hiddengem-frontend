import { Card, CardContent, Grid, Container, Typography, TextField, CardActions, Button, CardActionArea } from '@mui/material';


export default function StartScreen(props) {
    return (
        <Card >
        <CardContent>
          <Typography variant="h5">Let's start planning!</Typography>
          <CardContent>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Typography>When will you start?</Typography>
              <TextField
                //focused
                fullWidth
                //label="Start Time"
                variant="filled"
                type="time"
                color="secondary"
              />
            </Grid>
            <Grid item sm={6}>
              <Typography>When will you end?</Typography>
              <TextField
                //focused
                fullWidth
                //label="End Time"
                variant="outlined"
                type="time"
              />
            </Grid>
            <Grid item>
              <Typography>Where will you be?</Typography>
              <TextField
                fullWidth
              />
            </Grid>
            <Grid item>
              <Typography>How far will you go?</Typography>
              <TextField
                fullWidth
              />
            </Grid>
          </Grid>
        
          
        </CardContent>
        </CardContent>
        
        <CardActions>
            <Button>
              Next
            </Button>
          </CardActions>
      </Card>
    )
}