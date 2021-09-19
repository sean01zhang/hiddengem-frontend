import logo from './logo.svg';
import './App.css';
import { List, ListItem, ListItemText, InputAdornment, IconButton, Card, CardContent, Grid, Container, Typography, TextField, CardActions, Button, CardActionArea, ListItemButton, Stepper, CardMedia, CardHeader, Skeleton, LinearProgress, Step, StepContent, StepLabel, Divider } from '@mui/material';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BlockIcon from '@mui/icons-material/Block';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

const theme = createMuiTheme({
  typography: {
    body1:{
      fontFamily: "'Montserrat', 'Open Sans'"
    }
  }
});

export default function App() {
  const API_KEY = "AIzaSyCDheL3PDqX-t0V1O1W9YWFN7ygpdDH8bk"
  const [startTime, setStartTime] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endTime, setEndTime] = useState();
  const [endDate, setEndDate] = useState(new Date());

  const [startLoc, setStartLoc] = useState("");
  const [endLoc, setEndLoc] = useState("");

  const [step, setStep] = useState(0);

  const [timeSpent, setTimeSpent] = useState(0);

  const [locSuggest, setLocSuggest] = useState();

  const [myTrip, setMyTrip] = useState([]);

  let [remainingTimeMs, setRemainingTimeMs] = useState();

  let [travelToEnd, setTravelToEnd] = useState(0);
  

  function getSuggestedLocations(isFood) {
    const time1 = (startTime.getTime() + startDate.getTime())/1000;
    const time2 = (endTime.getTime() + endDate.getTime())/1000;

    let placeToStart = startLoc;
    if (myTrip.length > 0) {
      //console.log("my trip length", myTrip.length)
      placeToStart = myTrip[myTrip.length - 1].googleObj.address[0];
    }

    //console.log(`/get_locations?start_time=${time1}&start_location=${placeToStart}&end_time=${time2}&end_location=${endLoc}&location_type=${isFood?"restaurant":"activity"}`);

    fetch(`/get_locations?start_time=${time1}&start_location=${encodeURIComponent(placeToStart)}&end_time=${time2}&end_location=${encodeURIComponent(endLoc)}&location_type=${isFood?"restaurant":"activity"}`, {
      method: "GET"
    }).then((res) => {
      if (res.ok) {
        //console.log(res)
        res.json().then((json) => {
          setLocSuggest(json.results);
          //console.log("loc suggest is now", json.results);
        })
      }
    });
  }

  function getTimeDelta(startTime, place1, place2) {
    fetch(`/get_duration?start_time=${startTime}&start_location=${encodeURIComponent(place1)}&end_location=${encodeURIComponent(place2)}`, {
      method: "GET"
    }).then((res) => {
      if (res.ok) {
        //console.log(res)
        res.json().then((json) => {
          //console.log(json.results.rows[0].elements[0].duration.value)
          setTravelToEnd(json.results.rows[0].elements[0].duration.value);
          //console.log("loc suggest is now", json.results);
        })
      }
    });
  }

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
                //setIsFood(true);
                // also query up the STUFF
                getSuggestedLocations(true);
              }} style={{width:"100%", height:"100%"}} variant="outlined">Food</Button>
            </Grid>
            <Grid item sm={6}>
              <Button onClick={() => {
                setStep(step+1);
                //setIsFood(false);
                // also query up the STUFF
                getSuggestedLocations(false);
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
            {locSuggest === undefined ? (
              <>
              <Typography variant="h6">Hold Tight... finding hidden gems</Typography>
              <br/>
              <LinearProgress/>
              </>
              
              ) : (
                <>
                <Typography variant="h5">
                  <b>Here are some suggested locations. </b>
                </Typography>
                <Typography variant="subtitle2">
                  Pick one that interests you.
                </Typography>
              </>
              )}
            
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
              <IconButton>
                <FavoriteIcon/>
              </IconButton>
              <IconButton>
                <BlockIcon/>
              </IconButton>
            </CardActions>
            )}
            
          </Card>
        </Grid>
        ) : (
          locSuggest.map((loc, index) => {
            return (
              <Grid item sm={12}>
                <Card>
                  <CardContent>
                  <Typography variant="h6">
                      
                      <b>{loc.name}</b>
                    </Typography>

                    <Typography variant="subtitle2">
                      {loc.address[0]}
                    </Typography>
                    </CardContent>
                <CardMedia component="img" height={400} image={loc.photo_url}/>
                  <CardContent>
                    Rating: {loc.rating}/5 Stars<br/> 
                    Travel Time: {Math.round(loc.travel_time/60)} Minutes
                  </CardContent>
                  {step===3? null : (
                    <CardActions>
                    <IconButton onClick={() => {
                      setStep(step+1);
                      setLocSuggest([loc]);
                    }}>
                      <FavoriteIcon/>
                    </IconButton>
                    <IconButton onClick={() => {
                      const copy = [...locSuggest];
                      copy.splice(index, 1);
                      setLocSuggest(copy);
                    }}>
                      <BlockIcon/>
                    </IconButton>
                  </CardActions>
                  )}
                  
                </Card>
              </Grid>
            )
          })
        )  // TODO
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
              <TextField  value={timeSpent} onChange={(e) => {
                setTimeSpent(e.target.value);
              }} InputProps={{
            endAdornment: <InputAdornment position="end">hours</InputAdornment>,
          }} variant="standard" type="number" style={{fontSize:5, padding:0, height:10}}/>
            </CardContent>
            <CardActions>

              <Button onClick={() => {
                let temp = new Date();

                if (myTrip.length > 0) {
                  temp.setTime(myTrip[myTrip.length-1].timeOfArrival.getTime() + myTrip[myTrip.length-1].timeSpentInMs + locSuggest[0].travel_time * 1000);
                } else {
                  temp.setTime(startTime.getTime() + startDate.getTime() + locSuggest[0].travel_time * 1000);
                }

                myTrip.push({
                  googleObj: locSuggest[0],
                  timeSpentInMs: timeSpent * 3600 * 1000,
                  timeOfArrival: temp
                });


                getTimeDelta(temp.getTime() + timeSpent * 3600 * 1000, myTrip[myTrip.length - 1].googleObj.address[0], endLoc);
                
                remainingTimeMs -= (timeSpent*3600*1000 + locSuggest[0].travel_time * 1000 + travelToEnd*1000);
                setRemainingTimeMs(remainingTimeMs);
                setLocSuggest(undefined);
                if (remainingTimeMs > 0) {
                  setStep(1);
                } else {
                  setStep(4);
                }
                
                
                console.log(myTrip);
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
      <ThemeProvider theme={theme}>
      <div  style={{width:"100%", height:"100vh", backgroundColor:"#F5E8C7", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Container maxWidth="lg" style={{backgroundColor: '#F5E8C7', display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src="https://cdn.discordapp.com/attachments/886792045568593963/889018649589973022/good_2.png" width="400"/>
        {/* <Typography variant="h3" style={{margin: "0px 0px 50px 50px"}}>Hidden Gem</Typography> */}

        <Card style={{margin: "0 0 0 50px"}}>
          <CardContent>
            <Typography variant="h5"><b>Let's start planning!</b></Typography>

            <Grid container spacing={2}>
              <Grid item sm={6}>
                <Typography>When will you start?</Typography>
                <TextField
                  //focused
                  //fullWidth
                  //value={endDate}
                  onChange={(e) => {
                    //console.log(e.target.valueAsDate, endDate)
                    setStartDate(e.target.valueAsDate)}}
                  //label="End Time"
                  variant="outlined"
                  type="date"
                />
                <TextField
                  //focused
                  //fullWidth
                  //value={startTime}
                  onChange={(e) => {
                    
                    setStartTime(e.target.valueAsDate)}
                  }
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
                  //fullWidth
                  //value={endDate}
                  onChange={(e) => {
                    //console.log(e.target.valueAsDate, endDate)
                    setEndDate(e.target.valueAsDate)}}
                  //label="End Time"
                  variant="outlined"
                  type="date"
                />
                <TextField
                  //focused
                  //fullWidth
                  //value={endTime}
                  onChange={(e) => {setEndTime(e.target.valueAsDate)}}
                  //label="End Time"
                  variant="outlined"
                  type="time"
                />
                
              </Grid>
              <Grid item sm={6}>
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

          
          <CardActions >
              <Button variant={"contained"} style={{margin: "0 8px 0 auto"}} onClick={() => {
                
                const time1 = (startTime.getTime() + startDate.getTime());
                const time2 = (endTime.getTime() + endDate.getTime());
                
                setRemainingTimeMs(time2 - time1);
                setStep(step+1);

                getTimeDelta(time1, startLoc, endLoc);
              }}>
                Next
              </Button>
            </CardActions>
        </Card>
      </Container>
      </div>
      </ThemeProvider>
      );
  } else if (step>=1 && step < 4 ) {
    return (
      <div  style={{width:"100%", minHeight: "100vh", backgroundColor:"#F5E8C7"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100px"}}>
        <img src="https://cdn.discordapp.com/attachments/886792045568593963/889018649589973022/good_2.png" height="60px"/>
      </div>

      <Container maxWidth="md" style={{backgroundColor:"#F5E8C7"}}>
        <Grid container spacing={2}>
        {/* this here is for displaying the init details; OR even the entire trip. */}
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                <b>Your Trip</b>
              </Typography>
              <Typography>
                Unused free time: {parseInt(remainingTimeMs/1000/60)} minutes
              </Typography>
              {/* <Divider/> */}
              <List>
                <Card>
                  <ListItem key={-1} >
                    <ListItemText 
                      primary={"My Start Location"} 
                      secondary={
                        <>
                          {startLoc}<br/>
                        </>
                      }
                    />
                  </ListItem>
                </Card>
                {myTrip.map((item, index) => {
                  return (
                    <>

                    <Typography variant="overline" align="center" style={{width:"100%"}}>
                      + {parseInt(item.googleObj.travel_time/60)} minutes travel
                    </Typography>
                    <Card>
                    <ListItem key={index}>
                      <ListItemText 
                        primary={item.googleObj.name} 
                        secondary={
                          <>
                            {item.googleObj.address[0]}
                            <br/>
                            <Typography variant="overline">{item.timeSpentInMs/1000/60} minutes</Typography>
                          </>
                          
                        }
                      />
                      
                    </ListItem>
                    </Card>
                    {(index+1 < myTrip.length ? <Divider/>: null)}
                    </>
                  )
                })}
                <Typography variant="overline" align="center" style={{width:"100%"}}>
                      + {parseInt(travelToEnd/60)} minutes travel
                    </Typography>
                <Card style={{marginTop:10}}>
                  <ListItem key={-2} >
                    <ListItemText 
                      primary={"My End Location"} 
                      secondary={
                        <>
                          {endLoc}<br/>
                        </>
                      }
                    />
                  </ListItem>
                </Card>
              </List>
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
      </div>
    )
  } else {
    let listOfPlaceId = myTrip.map((item) => {
      return `place_id:${item.googleObj.place_id}`;
    });
    const waypoints = listOfPlaceId.join("|");
    return (
      <>
      <Grid container spacing={2} style={{border:"1px solid black", height: "100vh"}}>
        <Grid item xs={12} style={{height:"100%"}}>
        <iframe
          width="100%"
          height="100%"
          title="googlemapsthing"
          frameBorder="0" style={{border:0 }}loading="lazy"
          src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${startLoc}&destination=${endLoc}&waypoints=${waypoints}`} allowFullScreen>
        </iframe>

        <Button variant={"contained"} style={{margin: "0 8px 0 auto", position: "absolute", right: "10px", top: "10px"}} onClick={() => {
            setStep(0);
            setMyTrip([]);
          }}>
            Restart Schedule
        </Button>
        </Grid>
      </Grid>
      
      <div style={{position: "absolute", top: "50%", transform: "translate(-15%, -50%)", backgroundColor: "white", borderRadius: "5px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", fontSize: "14px"}}>
        <Timeline>
            <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  {startTime.toLocaleTimeString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  My Start Location <br/>
                  <Typography variant="caption">
                    {startLoc}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
          {myTrip.map((item, index) => {
            console.log(item.timeOfArrival)
            return (
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                 {item.timeOfArrival.toLocaleTimeString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  {item.googleObj.name}
                </TimelineContent>
              </TimelineItem>
            )
          })}
          <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  {endTime.toLocaleTimeString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  My End Location <br/>
                  <Typography variant="caption">
                    {endLoc}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
      </Timeline>
      </div>
      </>
    )
  }
  
}