import logo from './logo.svg';
import './App.css';
import { List, ListItem, InputAdornment, IconButton, Card, CardContent, Grid, Container, Typography, TextField, CardActions, Button, CardActionArea, ListItemButton, Stepper, CardMedia, CardHeader, Skeleton } from '@mui/material';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BlockIcon from '@mui/icons-material/Block';

export default function App() {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const [startLoc, setStartLoc] = useState("");
  const [endLoc, setEndLoc] = useState("");

  const [step, setStep] = useState(0);

  const [isFood, setIsFood] = useState(0);

  const [locSuggest, setLocSuggest] = useState();

  const [myTrip, setMyTrip] = useState();


  function narrowLocations() {
    if (step == 1) {
      return (
        <Grid item sm={12}>
          <Card>
        <CardContent>
          <Typography variant="h6">
            What will you do?
          </Typography>
          <br/>
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <Button onClick={() => {
            setStep(step+1);
            setIsFood(true);
            // also query up the STUFF
          }} style={{width:"100%", height:"100%"}} variant="outlined">Food</Button>
            </Grid>
            <Grid item sm={6}>
            <Button onClick={() => {
            setStep(step+1);
            setIsFood(false);
            // also query up the STUFF
          }} style={{width:"100%", height:"100%"}} variant="outlined"> Not Food</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
        </Grid>
      )
    } else if(step >=2) {
      // this needs to be the list of activities
      return (
      <>
      {step===3? null : (
        <Grid item sm={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              Here are some suggested locations. 
            </Typography>
            <Typography variant="subtitle2">
              Pick one that interests you.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}
        
        {locSuggest === undefined ? (
        
        <Grid item sm={12}>
          <Card>
            <CardContent>
            <Typography variant="h6">
                
                <Skeleton variant="text" width={200}/>
              </Typography>

              <Typography variant="subtitle2">
              <Skeleton variant="text" width={150}/>
              </Typography>
              </CardContent>
          <CardMedia >
            <Skeleton variant="rectangular" height={400}/>
            </CardMedia>
            <CardContent>
              
              <Typography variant="body2">
                <Skeleton variant="text" width="90%"/>
                <Skeleton variant="text" width="95%"/>
                <Skeleton variant="text" width="80%"/>
              </Typography>
            </CardContent>
            {step===3? null : (
              <CardActions>
              <IconButton onClick={() => {
                setStep(step+1);

              }}>
                <FavoriteIcon/>
              </IconButton>
              <IconButton>
                <BlockIcon/>
              </IconButton>
            </CardActions>
            )}
            
          </Card>
        </Grid>
        ) : null  // TODO
        }
        {step===3 ? (
          <Grid item sm={12}>
          <Card>
            <CardContent>
              <Typography>
                How long will you be spending here?
              </Typography>
              <Typography>

              </Typography>
              <TextField  InputProps={{
            endAdornment: <InputAdornment position="end">hours</InputAdornment>,
          }} variant="standard" type="number" style={{fontSize:5, padding:0, height:10}}/>
            </CardContent>
            <CardActions>
              <Button onClick={() => {
                setStep(1)
              }}>Add to my trip</Button>
            </CardActions>
          </Card>
        </Grid>
        ): null}
        
       </>);
    } 
 
  }

  if (step== 0) {
    return (
      <Container maxWidth="md">
  
        <Typography variant="h5">Hidden Gem</Typography>
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
                  value={startTime}
                  onChange={(e) => {
                    //console.log(e.target)
                    setStartTime(e.target.value)}}
                  //label="Start Time"
                  variant="outlined"
                  type="time"
                  color="secondary"
                />
              </Grid>
              <Grid item sm={6}>
                <Typography>When will you end?</Typography>
                <TextField
                  //focused
                  fullWidth
                  value={endTime}
                  onChange={(e) => {setEndTime(e.target.value)}}
                  //label="End Time"
                  variant="outlined"
                  type="time"
                />
              </Grid>
              <Grid item item sm={6}>
                <Typography>Where will you be?</Typography>
                <TextField
                  fullWidth
                  value={startLoc}
                  onChange={(e) => {setStartLoc(e.target.value)}}
                />
              </Grid>
              <Grid item item sm={6}>
                <Typography>How far will you go?</Typography>
                <TextField
                  fullWidth
                  value={endLoc}
                  onChange={(e) => {setEndLoc(e.target.value)}}
                />
              </Grid>
            </Grid>
          
            
          </CardContent>
          </CardContent>
          
          <CardActions>
              <Button onClick={() => {
                setStep(step+1);
              }}>
                Next
              </Button>
            </CardActions>
        </Card>
      </Container>
      );
  } else if (step>=1) {
    return (
      <Container maxWidth="md" style={{marginTop:30}}>
        <Grid container spacing={2}>
        {/* this here is for displaying the init details; OR even the entire trip. */}
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Your Trip
              </Typography>
              <Typography>

              </Typography>
            </CardContent>
          </Card>

        </Grid>
        {/* this is for the loop */}
        <Grid item md={8}>
          <Grid container spacing={2}>
            {narrowLocations()}
          </Grid>
        </Grid>
      </Grid>
      </Container>
      
    )
  }
  

    
    
  
}
