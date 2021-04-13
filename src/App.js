import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TableRenderer from "./TableRenderer";
import LineGraph from "./LineGraph";
import Map from "./Map";
import numeral from "numeral";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  recoverCard: {
    "& .MuiTypography-colorPrimary": {
      color: "#00e676",
    },
    "& .MuiChip-colorPrimary": {
      backgroundColor: "#00e676",
    },
  },
  deathCard: {
    "& .MuiTypography-colorPrimary": {
      color: "#ff3d00",
    },
    "& .MuiChip-colorPrimary": {
      backgroundColor: "#ff3d00",
    },
  },
  infoBox: {
    width: "210px",
    height: "180px",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "1em",
    },
  },
}));

function App() {
  const classes = useStyles();
  const [selectOption, setSelectOption] = React.useState("worldwide");
  const [countries, setSelectCountries] = React.useState([]);
  const [status, setStatus] = React.useState({});
  const [casesType, setCasesType] = React.useState("cases");
  const [mapCenter, setMapCenter] = React.useState([25.2744, 133.7751]);
  const [zoom, setZoom] = React.useState(3);
  const useFlagRef = React.useRef(true);
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  React.useEffect(() => {
    const initializeCountry = async () => {
      const response = await axios.get(
        `https://disease.sh/v3/covid-19/countries?yesterday=true&twoDaysAgo=true`
      );
      const worldwideData = await (
        await axios.get(
          `https://disease.sh/v3/covid-19/all?yesterday=true&twoDaysAgo=true&allowNull=false`
        )
      ).data;

      const gatherInformation = [];
      response.data.forEach((element) => {
        const {
          country,
          countryInfo,
          todayCases,
          todayDeaths,
          todayRecovered,
          cases,
          deaths,
          recovered,
        } = element;
        gatherInformation.push({
          country,
          countryInfo,
          todayCases,
          todayDeaths,
          todayRecovered,
          cases,
          deaths,
          recovered,
        });
      });

      setSelectCountries(gatherInformation);
      setStatus(worldwideData);
    };

    const getStatusbyCountry = async () => {
      const response =
        selectOption === "worldwide"
          ? await axios.get(
              `https://disease.sh/v3/covid-19/all?yesterday=true&twoDaysAgo=true&allowNull=false`
            )
          : await axios.get(
              `https://disease.sh/v3/covid-19/countries/${selectOption}?yesterday=true&twoDaysAgo=true&strict=true`
            );
      setStatus(response.data);
      if (selectOption !== "worldwide")
        setMapCenter([
          response.data.countryInfo.lat,
          response.data.countryInfo.long,
        ]);
    };
    if (useFlagRef.current) {
      initializeCountry();
      useFlagRef.current = false;
    } else getStatusbyCountry();
  }, [selectOption]);

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectOption(event.target.value);
  };

  const handleCasesChange = (event) => {
    setCasesType(event.target.value);
  };
  return (
    <div className="App">
      {/* <h1 style={{ textAlign: "center", color: "red" }}>Covid 19 tracker</h1> */}
      <Grid container direction={matchesMd ? "column" : "row"}>
        <Grid item lg={8} style={{ border: "1px solid red", padding: "1em" }}>
          <Grid container direction="column">
            <Grid item container justify="space-between">
              <Grid item>
                <Typography variant="h4" color="error">
                  Covid-19-tracker
                </Typography>
              </Grid>

              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    id="country-select"
                    value={selectOption}
                    onChange={handleChange}
                  >
                    <MenuItem value="worldwide" selected>
                      Worldwide
                    </MenuItem>
                    {countries.map((countryObject) => (
                      <MenuItem
                        key={countryObject.country}
                        value={countryObject.country}
                      >
                        {countryObject.country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction={matchesSm ? "column" : "row"}
              alignItems={matchesSm ? "center" : undefined}
              justify={matchesSm ? undefined : "space-evenly"}
              style={{ margin: "1em 0 1em 0" }}
            >
              <Grid item className={classes.infoBox}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Active Cases
                    </Typography>
                    <Typography variant="subtitle1">
                      Total Active Cases
                    </Typography>
                    <Chip
                      color="primary"
                      size="small"
                      label={numeral(status.cases).format("0 a")}
                    />
                    <Typography variant="subtitle1">
                      Today Active Cases
                    </Typography>
                    <Chip
                      color="primary"
                      size="small"
                      label={status.todayCases}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item className={classes.infoBox}>
                <Card className={classes.recoverCard}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Recovered Cases
                    </Typography>
                    <Typography variant="subtitle1">
                      Total Recovered Cases
                    </Typography>
                    <Chip
                      color="primary"
                      size="small"
                      label={numeral(status.recovered).format("0 a")}
                    />
                    <Typography variant="subtitle1">
                      Today Recovered Cases
                    </Typography>
                    <Chip
                      color="primary"
                      size="small"
                      label={status.todayRecovered}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item className={classes.infoBox}>
                <Card className={classes.deathCard}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Death Cases
                    </Typography>
                    <Typography variant="subtitle1">
                      Total Death Cases
                    </Typography>
                    <Chip
                      color="primary"
                      size="small"
                      label={numeral(status.deaths).format("0 a")}
                    />
                    <Typography variant="subtitle1">
                      Today Death Cases
                    </Typography>
                    <Chip
                      color="primary"
                      size="small"
                      label={status.todayDeaths}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid item>
              <Map
                countries={countries}
                center={mapCenter}
                zoom={zoom}
                casesType={casesType}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ border: "1px solid red", padding: "1em" }} lg={4}>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="body1" color="secondary">
                Countries based on total number of cases
              </Typography>
              <TableRenderer rowData={countries} />
            </Grid>

            <Grid
              item
              container
              direction="column"
              style={{
                margin: "1em 0 1em 0",
                marginTop: matchesMd ? "2em" : 0,
              }}
            >
              <Grid item>
                <Typography variant="body1" color="secondary">
                  last 4 months analysys
                </Typography>
              </Grid>
              <Grid item>
                <FormControl style={{ marginTop: "1em", marginBottom: "2em" }}>
                  <Select
                    id="caseType-select"
                    value={casesType}
                    onChange={handleCasesChange}
                  >
                    <MenuItem value="cases" selected>
                      Active Cases
                    </MenuItem>
                    <MenuItem value="deaths">Death Cases</MenuItem>
                    <MenuItem value="recovered">Recovered Cases</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <LineGraph casesType={casesType} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <Grid container>
        <Grid item style={{ margin: "1em 0 1em 0" }}>
          <Typography variant="body1" color="secondary">
            last 4 months analysys
          </Typography>

          <FormControl style={{ marginTop: "1em", marginBottom: "2em" }}>
            <Select
              id="caseType-select"
              value={casesType}
              onChange={handleCasesChange}
            >
              <MenuItem value="cases" selected>
                Active Cases
              </MenuItem>
              <MenuItem value="deaths">Death Cases</MenuItem>
              <MenuItem value="recovered">Recovered Cases</MenuItem>
            </Select>
          </FormControl>

          <LineGraph casesType={casesType} />
        </Grid>
      </Grid> */}
    </div>
  );
}

export default App;
