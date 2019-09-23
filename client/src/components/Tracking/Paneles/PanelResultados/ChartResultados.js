import React, { Component } from "react";
import { Line } from "react-chartjs-2";
class ChartResultados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }
  componentWillMount = () => {
    //this.getCharData()
  }
  componentWillReceiveProps = newProps => {

    if (this.state.data !== newProps.data) {
      this.setState({ data: newProps.data }/*() => this.getCharData()*/)
    }
  }
  getCharData = () => {
    var data = this.state.data;
    var borderColors = ["rgba(16,144,247,1)"]
    data.datasets.forEach((item, i) => {
      item.backgroundColor = "rgba(255,255,255,0)";
      item.borderColor = borderColors[i];
      item.pointBackgroundColor = "rgba(255,255,255,1)";
      item.pointHoverBackgroundColor = borderColors[i];
      item.lineTension = .4;
      item.pointRadius = 4;
      item.pointHoverRadius = 4;
      item.borderWidth = 2;
    })
    this.setState({ data })
  }

  render() {
    var self = this.state;
    return (
      <div className="container-chart-resultados">
        <Line options={{
          layout: {
            padding: {
              left: 60,
              right: 90,
              top: 40,
              bottom: 0
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 10,
              fontSize: 14,
              fontFamily: 'sans-serif',
              usePointStyle: true
            }

          },
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            yAxes: [{
              gridLines: {
                display: true,
              },
              ticks: {
                beginAtZero: true,
                max: this.state.data.moreDetails.maxY,
                min: 1,
                maxTicksLimit: 10
              }
            }],
            xAxes: [{
              gridLines: {
                display: false,
              }
            }]
          },
          tooltips: {

            enabled: false,
            mode: 'index',
            position: 'nearest',
            custom: function (tooltip) {

              // Tooltip Element
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<table></table>';
                this._chart.canvas.parentNode.appendChild(tooltipEl);
              }
              // Hide if no tooltip
              if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }
              // Set caret Position
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltip.yAlign) {
                tooltipEl.classList.add(tooltip.yAlign);
              } else {
                tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                return bodyItem.lines;
              }
              // Set Text
              if (tooltip.body) {
                var titleLines = tooltip.title || [];

                var innerHtml = '<thead>';
                titleLines.forEach(function (title) {
                  innerHtml += '<tr><th class="title-tooltip">' + title + '</th></tr>';
                });
                innerHtml += '</thead><tbody>';

                var bodyLines = tooltip.body.map(getBody);
                tooltip.dataPoints.forEach((item, i) => {

                  var index = item.index;
                  var obj = self.data.datasets[item.datasetIndex].data[index]

                  var colors = tooltip.labelColors[i];
                  var style = 'background:' + self.data.datasets[item.datasetIndex].borderColor;
                  style += '; border-width: 2px';
                  var circulo = '<div class="chartjs-tooltip-key" style="' + style + '"></div>';
                  var posicion = '<span class="subtitle-tooltip">Posición: </span> <span class="valor-tooltip">' + obj.y + '</span>';//añadir url con obj.url 
                  innerHtml += '<tr><td class="td-item-tooltip-chart">' + circulo + posicion + '</td></tr>';
                });
                innerHtml += '</tbody>';
                var tableRoot = tooltipEl.querySelector('table');
                tableRoot.innerHTML = innerHtml;
              }
              var positionY = this._chart.canvas.offsetTop;
              var positionX = this._chart.canvas.offsetLeft;
              // Display, position, and set styles for font
              tooltipEl.style.opacity = 1;
              tooltipEl.style.left = positionX + tooltip.caretX + 'px';
              tooltipEl.style.top = positionY + tooltip.caretY + 'px';
            }
          }
        }} data={this.state.data} />
      </div>
    );
  }
}

export default ChartResultados;
