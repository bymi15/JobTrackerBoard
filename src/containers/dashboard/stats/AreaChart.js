import React from "react";
import Chart from "react-apexcharts";

import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

import moment from "moment";

const AreaChart = ({ theme }) => {
  const data = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100]
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41]
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41]
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41]
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41]
    }
  ];

  const options = {
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00",
        "2018-09-19T01:30:00",
        "2018-09-19T02:30:00",
        "2018-09-19T03:30:00",
        "2018-09-19T04:30:00",
        "2018-09-19T05:30:00",
        "2018-09-19T06:30:00"
      ]
      // tickAmount: 8,
      // min: new Date("01/01/2018").getTime(),
      // max: new Date("01/20/2019").getTime(),
      // labels: {
      //     formatter: function(val, timestamp) {
      //       return moment(new Date(timestamp)).format("DD MMM YYYY")
      //   }
      // }
    },
    tooltip: {
      x: {
        format: "dd/MM/yy"
      }
    },
    colors: [
      '#47BAC1',
      '#5fc27e',
      '#fcc100',
      '#f44455',
      '#5b7dff'
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5">Activity</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="chart w-100">
          <Chart options={options} series={data} type="area" height="300" />
        </div>
      </CardBody>
    </Card>
  );
};

export default AreaChart;
