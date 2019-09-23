import React, { Component } from "react";
import CargandoData from "../../../Global/CargandoData";
import { connect } from "react-redux";
import ItemResultado from "./ItemResultado";
import firebase from "../../../../firebase/Firebase";
import ChartResultados from "./ChartResultados";
import * as functions from '../../../Global/functions'
const db = firebase.database().ref();
const ITEMS = 50;
class PanelResultados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ITEMS,
      sortBy: "id_date",
      des: true,

      cliente: this.props.cliente,
      keyword: this.props.keyword,
      resultados: {},
      resultados_ordenados: [],
      newKeywords: "",
      dataChart: { labels: [], datasets: [], moreDetails: { maxY: 10 } },
      datesSelected: this.props.datesSelected
    };
  }

  componentWillMount = () => {
    this.getData();
  };

  componentWillReceiveProps = newProps => {
    //if(this.state.cliente!==newProps.cliente){ this.setState({cliente:newProps.cliente}, ()=> this.ordenarResultados() ) }
    if (
      this.state.cliente !== newProps.cliente ||
      this.state.keyword !== newProps.keyword
    ) {

      /*this.setState(
        { cliente: newProps.cliente, keyword: newProps.keyword },
        () => this.getData()
      );*/
    }
    if (this.state.datesSelected !== newProps.datesSelected) {
      this.setState({ datesSelected: newProps.datesSelected }, () => {
        this.getData();
      })
    }
  };
  getData = () => {

    if (this.state.keyword) {
      var { endDate, startDate } = this.state.datesSelected
      startDate = startDate.format("YYYY-MM-DD");
      endDate = endDate.format("YYYY-MM-DD");

      db.child(`Servicios/Tracking/Resultados/clientes/${this.state.cliente.id_cliente}/${this.state.keyword.id_keyword}/dates`).orderByChild('id_date').startAt(startDate).endAt(endDate).on("value", snapshot => {
        var resultados = {};
        snapshot.forEach(data => {
          resultados[data.key] = data.val();
        });
        this.setState({ resultados }, () => {
          this.ordenarResultados(resultados);
          this.setDataChart(resultados);
        });
      });
    } else {
      console.log("No existe keyword seleccionada");
    }
  };
  setDataChart = (resultados) => {


    var resultados_ordenados = Object.entries(resultados);

    resultados_ordenados.sort((a, b) => {
      a = a[1];
      b = b[1];
      if (a.id_date > b.id_date) { return 1; }
      if (a.id_date < b.id_date) { return -1; }
      return 0;
    });
    var dataChart = { labels: [], datasets: [], moreDetails: { maxY: 10 } }
    dataChart.datasets = [{ label: functions.getDominio(this.state.cliente.web), data: [] }];

    var maxY = 0;



    resultados_ordenados.forEach((item) => {
      item = item[1]
      var firstPosition = item.results.first_position ? item.results.first_position : 101;
      var firstUrl = item.results.first_url ? ", " + item.results.first_url : "";
      dataChart.datasets[0].data.push({ y: firstPosition, url: firstUrl });
      dataChart.labels.push(functions.getDateChart(item.id_date))
      if (firstPosition > maxY && firstPosition !== 101) {
        maxY = firstPosition + 1
      }
    })
    dataChart.moreDetails.maxY = maxY;

    if (dataChart.labels.length === 1) {
      //TODO si solo hay una fecha añadiremos: labels: ['', "A", ''], y data: [null, 30, null]
    }

    /*dataChart.datasets.push({
      label: "prueba.com",
      data: [
        { y: 1, url: "a" },
        { y: 2, url: "s" },
        { y: 3, url: "d" },
        { y: 10, url: "f" },
        { y: 3, url: "g" },
        { y: 8, url: "h" },
        { y: null, url: "j" },
        { y: 14, url: "k" },
        { y: 14, url: "l" },
        { y: 14, url: "ñ" },
        { y: 8, url: "p" },
        { y: 6, url: "o" },
        { y: 2, url: "i" },
        { y: 8, url: "u" },
        { y: 1, url: "y" },
      ]
    })
    dataChart.datasets.push({
      label: "prueba2222.com",
      data: [
        { y: 5, url: "a2" },
        { y: 8, url: "s2" },
        { y: 2, url: "d2" },
        { y: 10, url: "f2" },
        { y: 7, url: "g2" },
        { y: 5, url: "h2" },
        { y: 2, url: "j2" },
        { y: 11, url: "k2" },
        { y: 9, url: "l2" },
        { y: 9, url: "ñ2" },
        { y: 8, url: "p2" },
        { y: 1, url: "o2" },
        { y: 4, url: "i2" },
        { y: 5, url: "u2" },
        { y: 7, url: "y2" },
      ]
    })*/

    var borderColors = ["rgba(16,144,247,1)", "rgba(255,165,0,1)", "rgba(30,174,30,1)", "rgba(211,11,211,1)"];
    dataChart.datasets.forEach((item, i) => {
      item.backgroundColor = "rgba(255,255,255,0)";
      item.borderColor = borderColors[i];
      item.pointBackgroundColor = "rgba(255,255,255,1)";
      item.pointHoverBackgroundColor = borderColors[i];
      item.lineTension = .4;
      item.pointRadius = 4;
      item.pointHoverRadius = 4;
      item.borderWidth = 2;
    })
    this.setState({ dataChart })
  }

  ordenarResultados = resultados => {
    var resultados_ordenados = Object.entries(resultados);

    resultados_ordenados.sort((a, b) => {
      a = a[1];
      b = b[1];
      var aKeys = false,
        bKeys = false;
      if (this.state.sortBy === "posicion") {
        aKeys = a.resultados ? +Object.keys(a.resultados)[0] : 101;
        bKeys = b.resultados ? +Object.keys(b.resultados)[0] : 101;

        if (aKeys > bKeys) {
          return 1;
        }
        if (aKeys < bKeys) {
          return -1;
        }
      } else if (this.state.sortBy === "url") {
        aKeys = a.resultados
          ? a.resultados[+Object.keys(a.resultados)[0]].url
          : "-";
        bKeys = b.resultados
          ? b.resultados[+Object.keys(b.resultados)[0]].url
          : "-";

        if (aKeys > bKeys) {
          return 1;
        }
        if (aKeys < bKeys) {
          return -1;
        }
      } else {
        if (a[this.state.sortBy] > b[this.state.sortBy]) {
          return 1;
        }
        if (a[this.state.sortBy] < b[this.state.sortBy]) {
          return -1;
        }
      }

      return 0;
    });



    if (this.state.des) {
      resultados_ordenados.reverse();
    }

    this.setState({ resultados_ordenados }, () => {
      //this.changeContadorClientes();
    });
  };

  changeSort = id => {
    var des = false;
    if (this.state.sortBy === id) {
      des = this.state.des ? false : true;
    }
    this.setState({ sortBy: id, des }, () =>
      this.ordenarResultados(this.state.resultados)
    );
  };
  render() {
    return (
      <div
        id="container-clientes-tracking-keywords-resultados"
        className="container-table min-panel-enlaces-free"
        ref={scroller => {
          this.scroller = scroller;
        }}
        onScroll={this.handleScroll}
      >
        <div>
          {Object.keys(this.state.resultados).length > 0 ? (
            <div>
              <ChartResultados data={this.state.dataChart} />

              <table id="table-clientes-tracking-keywords-resultados">
                <thead>
                  <tr>
                    <th onClick={() => this.changeSort("posicion")} className="key-item-pos" >
                      <span>Posición</span>
                      {this.state.sortBy === "posicion" ? (
                        <i
                          className={`material-icons sort-arrow ${
                            this.state.des ? "des-arrow" : ""
                            }`}
                        >
                          arrow_downward
                        </i>
                      ) : null}
                    </th>

                    <th
                      onClick={() => this.changeSort("url")}
                      className="key-item-url"
                    >
                      <span>Url</span>
                      {this.state.sortBy === "url" ? (
                        <i
                          className={`material-icons sort-arrow ${
                            this.state.des ? "des-arrow" : ""
                            }`}
                        >
                          arrow_downward
                        </i>
                      ) : null}
                    </th>

                    <th className="key-item-img">
                      <span>Imagen</span>
                    </th>

                    <th
                      onClick={() => this.changeSort("id_date")}
                      className="key-item-fecha"
                    >
                      <span>Fecha</span>
                      {this.state.sortBy === "id_date" ? (
                        <i
                          className={`material-icons sort-arrow ${
                            this.state.des ? "des-arrow" : ""
                            }`}
                        >
                          arrow_downward
                        </i>
                      ) : null}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.resultados_ordenados.reduce((result, item, i) => {
                    const k = item[0],
                      date = item[1];
                    if (i < this.state.items) {
                      result.push(<ItemResultado key={k} date={date} />);
                    }
                    return result;
                  }, [])}
                </tbody>
              </table>
            </div>
          ) : (
              <div className={`${!this.props.visibility ? "display_none" : ""}`}>
                <CargandoData />
              </div>
            )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cliente: state.cliente_seleccionado,
    keyword: state.tracking.keyword_tracking_selected,
    datesSelected: state.tracking.paneles.keywords.dates,
  };
}
export default connect(mapStateToProps)(PanelResultados);
