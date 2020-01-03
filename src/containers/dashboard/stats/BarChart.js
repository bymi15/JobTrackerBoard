import React from "react";
import Chart from "react-apexcharts";

import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

const BarChart = ({ stats, categories }) => {
   const data = [{data: stats}];
   const max = stats ? Math.max(...stats) : 0;

   const options = {
      chart: {
         height: 350,
         type: 'bar',
      },
      plotOptions: {
         bar: {
            horizontal: true,
            distributed: true
         }
      },
      dataLabels: {
         enabled: false
      },
      xaxis: {
         categories: categories,
         labels: {
           formatter: function (value) {
             return value;
           }
         },
         min: 0,
         max: max,
         tickAmount: max
      },
      colors: [
         '#47BAC1',
         '#5fc27e',
         '#fcc100',
         '#f44455',
         '#5b7dff'
      ],
      tooltip: {
          y: {
              title: {
                  formatter: function() {
                      return ''
                  }
              },
              formatter: function(val) {
                return val + ' job' + (val > 1 ? 's' : '');
              }
          }
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle tag="h5">Application Status</CardTitle>
         </CardHeader>
         <CardBody>
            <div className="chart">
               <Chart options={options} series={data} type="bar" height="300" />
            </div>
         </CardBody>
      </Card>
   );
};

export default BarChart;
