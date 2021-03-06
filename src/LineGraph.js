import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "400px",
    height: "150px",
    [theme.breakpoints.down("lg")]: {
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
}));

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const vaccineLineChartoptions = {
  scales: {
    yAxes: [
      {
        gridLines: {
          display: false,
        },

        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  console.log(data);
  let chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    // console.log(
    //   data[casesType][date] - lastDataPoint,
    //   data[casesType][date],
    //   lastDataPoint
    // );
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, country }) {
  console.log(country);
  const [data, setData] = useState({});
  const [vaccineInfo, setVaccineInfo] = useState({});

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=30&fullData=India`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data["timeline"]);
          setVaccineInfo(data["timeline"]);
        });
    };
    if (country !== "worldwide") fetchData();
  }, [country]);

  console.log(vaccineInfo);
  return (
    <div className={classes.root}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}

      <div style={{ marginTop: "5em" }}>
        {Object.keys(vaccineInfo).length > 0 && (
          <Line
            data={{
              labels: Object.keys(vaccineInfo),
              datasets: [
                {
                  label: `# of vaccine taken ${country}`,
                  backgroundColor: "rgba(166, 240, 110)",
                  borderColor: "#CC1034",
                  data: Object.values(vaccineInfo),
                },
              ],
            }}
            options={vaccineLineChartoptions}
          />
        )}
      </div>
    </div>
  );
}

export default LineGraph;
