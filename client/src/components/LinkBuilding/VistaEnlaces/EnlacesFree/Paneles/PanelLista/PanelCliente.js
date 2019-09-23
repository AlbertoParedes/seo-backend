import React, { Component } from 'react'
import ItemEnlaceFree from './ItemEnlaceFree'
import Temporizador from '../../../../../Global/Temporizador'
import firebase from '../../../../../../firebase/Firebase';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setIdTimpoCliente } from '../../../../../../redux/actions';
import moment from 'moment'
const db = firebase.database().ref();


class PanelCliente extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inicio: 0,
      id_tiempo: null,
      sumatorio: 0,
      cliente_seleccionado: this.props.cliente_seleccionado,
      fecha: this.props.fecha
    }
  }

  componentWillMount = () => {
    this.iniciarContador()
  }
  componentWillUnmount = () => {
    this.finishTimer(this.state, false)
  }

  iniciarContador = () => {


    var id_cliente = this.state.cliente_seleccionado.id_cliente,
      id_empleado = this.props.empleado.id_empleado
    db.child(`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/free/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro`).orderByKey().on("value", snapshot => {

      var id_tiempo = this.state.id_tiempo;
      var inicio = 0;
      var sumatorio = 0;
      var tiempos = []
      snapshot.forEach(data => {
        var obj = data.val();
        tiempos.push(obj)
      })

      var multiPath = {};


      //agregamos el timpo de ahora y empezamos a contar hacia arriba
      if (tiempos.length === 0) {
        id_tiempo = db.child(`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/free/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro`).push().key;
        inicio = (+ new Date())
        multiPath[`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/free/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro/${id_tiempo}`] = { begin: inicio, end: false, id_tiempo }

      } else if (tiempos.length > 0) { //si es mayor que 0 es que tiene registros

        tiempos.forEach((item, key) => {
          //si es el ultimo objeto y no tiene fin habrá que guardar ese id_tiempo y 
          if (item.begin && item.end) {
            var date1 = moment(new Date(item.begin));
            var date2 = moment(new Date(item.end));
            var diff = date2.diff(date1, 'seconds');
            sumatorio = sumatorio + diff
          }
        })

        //si el ultimo tiempo no tiene fin haremos lo siguiente
        if (!tiempos[tiempos.length - 1].end) {
          id_tiempo = tiempos[tiempos.length - 1].id_tiempo;
          inicio = tiempos[tiempos.length - 1].begin

        } else {
          id_tiempo = db.child(`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/free/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro`).push().key;
          inicio = (+ new Date())
          multiPath[`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/free/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro/${id_tiempo}`] = { begin: inicio, end: false, id_tiempo }

        }

      }

      if (Object.keys(multiPath).length > 0 && this.state.fecha === moment().format('YYYY-MM')) {
        db.update(multiPath)
          .then(() => {
            //console.log('ok')
            this.setState({ inicio, id_tiempo, sumatorio }, () => {
              this.props.setIdTimpoCliente({ id_cliente, id_tiempo, panel: 'free', date: this.state.fecha })
            })

          })
          .catch(err => console.log(err))
      } else {
        this.setState({ inicio, id_tiempo, sumatorio }, () => {
          this.props.setIdTimpoCliente({ id_cliente, id_tiempo, panel: 'free', date: this.state.fecha })
        })
      }

    })

  }



  componentWillReceiveProps = newProps => {

    const oldState = this.state
    if (this.state.cliente_seleccionado !== newProps.cliente_seleccionado || this.state.fecha !== newProps.fecha) {
      this.setState({
        cliente_seleccionado: newProps.cliente_seleccionado,
        fecha: newProps.fecha
      }, () => {
        if (oldState.cliente_seleccionado.id_cliente !== newProps.cliente_seleccionado.id_cliente || oldState.fecha !== newProps.fecha) {
          this.finishTimer(oldState, true);
          //this.iniciarContador();
        }
      })
    }

  }

  finishTimer = (state, reiniciar) => {

    var multiPath = {};
    db.child(`Servicios/Times/clientes/${state.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/mensualidades/${state.fecha}/empleados/${this.props.empleado.id_empleado}/registro`).off();
    multiPath[`Servicios/Times/clientes/${state.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/mensualidades/${state.fecha}/empleados/${this.props.empleado.id_empleado}/registro/${state.id_tiempo}/end`] = (+ new Date())

    if (state.id_tiempo && Object.keys(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          if (reiniciar) {
            this.iniciarContador()
          }
        })
        .catch(err => console.log(err))
    }


  }

  render() {

    return (
      <div>

        {!this.state.cliente_seleccionado.activo || this.state.cliente_seleccionado.eliminado ?
          <div className='div_info_panel_linkbuilding'>{this.state.cliente_seleccionado.eliminado ? 'Este cliente está eliminado' : 'Este cliente está desactivado'}</div>
          : null}

        {this.state.cliente_seleccionado.activo && !this.state.cliente_seleccionado.eliminado && !this.state.cliente_seleccionado.servicios.linkbuilding.free.activo ?
          <div className='div_info_panel_linkbuilding'>Este cliente tiene desactivado los enlaces gratuitos</div>
          : null}

        {
          this.props.enlaces_ordenados.length > 0 ?

            <table id='table-enlaces-free-linbuilding'>
              <thead>
                <tr>

                  <th onClick={() => this.props.changeSort('status')} className='lb-enlaces-free-status' >
                    <div className='div-container-status'><div className="lb-enla-status-clientes-point punto-status"></div> {this.props.sortBy === 'status' ? <i className={`material-icons sort-arrow ${this.props.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}</div>

                  </th>

                  <th onClick={() => this.props.changeSort('empleado')} className='lb-enlaces-free-empleado' >
                    <span>Empleado</span> {this.props.sortBy === 'empleado' ? <i className={`material-icons sort-arrow ${this.props.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.props.changeSort('destino')} className='lb-enlaces-free-destino'>
                    <span>Destino</span> {this.props.sortBy === 'destino' ? <i className={`material-icons sort-arrow ${this.props.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.props.changeSort('categoria')} className='lb-enlaces-free-categoria'>
                    <span>Categoría</span> {this.props.sortBy === 'categoria' ? <i className={`material-icons sort-arrow ${this.props.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.props.changeSort('medio')} className='lb-enlaces-free-medio'>
                    <span>Medio</span> {this.props.sortBy === 'medio' ? <i className={`material-icons sort-arrow ${this.props.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.props.changeSort('anchor')} className='lb-enlaces-free-anchor'>
                    <span>Anchor</span> {this.props.sortBy === 'anchor' ? <i className={`material-icons sort-arrow ${this.props.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th className='lb-enlaces-free-enlace'>
                    <span>Enlace</span>
                  </th>

                  <th onClick={() => this.props.changeSort('tipo')} className='lb-enlaces-free-tipo'>
                    <span>Tipo</span> {this.props.sortBy === 'tipo' ? <i className={`material-icons sort-arrow ${this.props.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th className='lb-enlaces-free-more'></th>

                </tr>
              </thead>
              <tbody>

                {
                  this.props.enlaces_ordenados.reduce((result, item, i) => {
                    const k = item[0], enlace = item[1];
                    if (i < 200) {
                      result.push(
                        <ItemEnlaceFree key={k} enlace={enlace} bloqueado={this.props.bloqueado} />
                      );
                    }
                    return result;
                  }, [])

                }
              </tbody>
            </table>

            :

            <div className='div_info_panel_linkbuilding'> No existen enlaces este mes</div>

        }



        <Temporizador inicio={this.state.inicio} sumatorio={this.state.sumatorio} contador={this.state.fecha === moment().format('YYYY-MM') ? true : false} />









      </div>

    )
  }
}


function matchDispatchToProps(dispatch) { return bindActionCreators({ setIdTimpoCliente }, dispatch) }
export default connect(null, matchDispatchToProps)(PanelCliente);


