import React, {useState, useRef, useEffect} from 'react';
import ApexCharts from 'apexcharts';

export default function AirQualityIndexChart({airQualityIndex}) {
  const aqiChartRef = useRef(null)
  
  useEffect(() => { 
    console.log("&&&&&")
    console.log(airQualityIndex)
    if (airQualityIndex) {
      const aqiChartOptions = {
        series: [100, (airQualityIndex.AQI/500 * 100)],
            chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
              enabled: true
            }
          },
          tooltip: {
              enabled: false,
            },
          stroke: {
            lineCap: 'round',
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              hollow: {
                size: "75%",
              },
              track: {
                background: ["#e7e7e7", "#ffffff"],
                strokeWidth: ['100%', '75%'],
                margin: 3, 
              },
              dataLabels: {
                name: {
                  offsetY: -30,
                  show: false,
                  fontSize: '30px',
                },
                value: {
                  // offsetY: -2,
                  text: "AQI",
                  formatter: function(val) {
                    return parseInt(val)
                  },
                  fontSize: '90px',
                  show: true,
                },
                total: {
                  show: true,
                  label: "AQI",
                  formatter: function(w) {
                    return airQualityIndex.AQI
                  },
                },
              },
            },
          },
          grid: {
            padding: {
              top: -10
            }
          },
          fill: {
            colors: ['#ff0000', '#000000'],
            type: ['gradient', "solid"],
            gradient: {
              shade: 'light',
              type: "horizontal",
              shadeIntensity: 0.9,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#00e400",
                  opacity: 1
                },
                {
                  offset: 10,
                  color: "#ffff00",
                  opacity: 1
                },
                {
                  offset: 40,
                  color: "#ff0000",
                  opacity: 1
                },
                {
                  offset: 50,
                  color: "#8f3f97",
                  opacity: 1
                },
                {
                  offset: 100,
                  color: "#7e0023",
                  opacity: 1
                }
              ],
            },
          },  
          labels: ['Scale', 'AQI'],
      }

      const chart = new ApexCharts(aqiChartRef.current, aqiChartOptions)
      chart.render()
      return () => chart.destroy()
    }
  }, [airQualityIndex])

  return (
    <div ref={aqiChartRef} id="chart"></div>
  )
}
