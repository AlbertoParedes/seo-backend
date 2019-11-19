import React, { Component } from 'react'
import ItemEnlacePaid from './ItemEnlacePaid'
import * as functions from '../../../../../Global/functions'
import ItemEnlacePaidSeo from './ItemEnlacePaidSeo'
import firebase from '../../../../../../firebase/Firebase';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setIdTimpoCliente } from '../../../../../../redux/actions';
import Temporizador from '../../../../../Global/Temporizador'
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
    db.child(`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/paid/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro`).orderByKey().on("value", snapshot => {

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
        id_tiempo = db.child(`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/paid/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro`).push().key;
        inicio = (+ new Date())
        multiPath[`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/paid/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro/${id_tiempo}`] = { begin: inicio, end: false, id_tiempo }

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
          id_tiempo = db.child(`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/paid/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro`).push().key;
          inicio = (+ new Date())
          multiPath[`Servicios/Times/clientes/${id_cliente}/servicios/linkbuilding/paid/mensualidades/${this.state.fecha}/empleados/${id_empleado}/registro/${id_tiempo}`] = { begin: inicio, end: false, id_tiempo }
        }

      }


      console.log('LP', id_tiempo, multiPath);
      if (Object.keys(multiPath).length > 0 && this.state.fecha === moment().format('YYYY-MM')) {
        db.update(multiPath)
          .then(() => {
            //console.log('ok')
            this.setState({ inicio, id_tiempo, sumatorio }, () => {
              this.props.setIdTimpoCliente({ id_cliente, id_tiempo, panel: 'paid', date: this.state.fecha })

            })

          })
          .catch(err => console.log(err))
      } else {
        this.setState({ inicio, id_tiempo, sumatorio }, () => {
          this.props.setIdTimpoCliente({ id_cliente, id_tiempo, panel: 'paid', date: this.state.fecha })
        })
      }

    })

  }



  componentWillReceiveProps = newProps => {
    console.log('componentWillReceiveProps lp');
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
    db.child(`Servicios/Times/clientes/${state.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/mensualidades/${state.fecha}/empleados/${this.props.empleado.id_empleado}/registro`).off();
    multiPath[`Servicios/Times/clientes/${state.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/mensualidades/${state.fecha}/empleados/${this.props.empleado.id_empleado}/registro/${state.id_tiempo}/end`] = (+ new Date())

    if (state.id_tiempo && Object.keys(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          console.log('ok');
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

        {!this.state.cliente_seleccionado.servicios.linkbuilding.paid.activo || this.state.cliente_seleccionado.eliminado ?
          <div className='div_info_panel_linkbuilding'>{this.state.cliente_seleccionado.eliminado ? 'Este cliente está eliminado' : 'Este cliente tiene desactivado los enlaces de pago'}</div>
          : null}

        <div className="container-results-cuestionario-enlaces-paid pdd-btm-40">
          <div className="item-results-cuestionario-enlaces-paid"><div className="valor-cuestionario-enlaces-paid">{this.props.inversion_mensual}</div><div className="title-cuestionario-enlaces-paid">INVERSIÓN MENSUAL</div></div>
          <div className="item-results-cuestionario-enlaces-paid"><div className="valor-cuestionario-enlaces-paid">{this.props.disponible_mensual}</div><div className="title-cuestionario-enlaces-paid">DISPONIBLE SIN COMISIÓN</div></div>
          <div className="item-results-cuestionario-enlaces-paid"><div className="valor-cuestionario-enlaces-paid">{this.props.bote}</div><div className="title-cuestionario-enlaces-paid">DISPONIBLE A GASTAR</div></div>
        </div>

        {
          this.props.enlaces_ordenados.length > 0 ?

            <table id='table-enlaces-paid-linbuilding'>
              <thead>
                <tr>

                  <th onClick={() => this.changeSort('status')} className='lb-enlaces-paid-status' >
                    <div className='div-container-status'><div className="lb-enla-status-clientes-point punto-status"></div> {this.state.sortBy === 'status' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}</div>

                  </th>

                  <th onClick={() => this.changeSort('empleado')} className='lb-enlaces-paid-empleado' >
                    <span>Empleado</span> {this.state.sortBy === 'empleado' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  {this.state.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo ?
                    <th onClick={() => this.changeSort('id_micronicho')} className='lb-enlaces-paid-medio'>
                      <span>Micronicho</span> {this.state.sortBy === 'id_micronicho' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                    </th>
                    : null}


                  <th onClick={() => this.changeSort('medio')} className='lb-enlaces-paid-medio'>
                    <span>Medio</span> {this.state.sortBy === 'medio' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('destino')} className='lb-enlaces-paid-destino'>
                    <span>Destino</span> {this.state.sortBy === 'destino' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('anchor')} className='lb-enlaces-paid-anchor'>
                    <span>Anchor</span> {this.state.sortBy === 'anchor' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th className='lb-enlaces-paid-enlace'>
                    <span>Enlace</span>
                  </th>

                  {/*
                  <th  onClick={()=>this.changeSort('tipo')} className='lb-enlaces-paid-tipo'>
                    <span>Tipo</span> {this.state.sortBy==='tipo'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>
                  */}

                  <th className='lb-enlaces-paid-compra-iva pr'>
                    <span>Compra<span className="subtitle-header-table">IVA</span> </span>
                  </th>

                  <th className='lb-enlaces-paid-compra pr'>
                    <span>Compra<span className="subtitle-header-table">SIN IVA</span> </span>
                  </th>

                  <th className='lb-enlaces-paid-venta'>
                    <span>Venta</span>
                  </th>

                  <th className='lb-enlaces-paid-beneficio'>
                    <span>Beneficio</span>
                  </th>

                  <th className='lb-enlaces-paid-more'></th>

                </tr>
              </thead>
              <tbody>

                {
                  this.props.enlaces_ordenados.reduce((result, item, i) => {
                    const k = item[0], enlace = item[1];

                    if (enlace.id_empleado === 'Enterprise') {

                    } else if (i < 200) {
                      result.push(
                        <ItemEnlacePaid key={k} enlace={enlace} enlaces={this.props.enlaces} inversionMensualString={this.props.inversionMensualString} bloqueado={this.props.bloqueado} />
                      );
                    }
                    return result;
                  }, [])

                }

                {this.state.cliente_seleccionado && this.state.cliente_seleccionado.seo === 'Enterprise' &&
                  this.state.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades &&
                  this.state.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades[this.state.fecha] ?
                  <ItemVacio cliente_seleccionado={this.state.cliente_seleccionado} enlacesEnterprise={this.props.enlacesEnterprise} colSpan={this.state.cliente_seleccionado && this.state.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo ? "12" : "11"} />
                  : null
                }

                {this.state.cliente_seleccionado.seo === 'Enterprise' &&
                  this.state.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades &&
                  this.state.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades[this.state.fecha] ?
                  this.props.enlaces_ordenados.reduce((result, item, i) => {
                    const k = item[0], enlace = item[1];
                    if (enlace.id_empleado !== 'Enterprise') {

                    } else if (i < 200) {
                      result.push(
                        <ItemEnlacePaidSeo key={k} enlace={enlace} enlaces={this.props.enlaces} inversionMensualString={this.props.inversionMensualString} bloqueado={this.props.bloqueado} />
                      );
                    }
                    return result;
                  }, [])
                  : null
                }

              </tbody>
            </table>

            :

            <div className='div_info_panel_linkbuilding'> No existen enlaces este mes</div>

        }


        <div className='more-info-bottom-paid '>
          <span>Comision: {this.props.comision} € ({this.state.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha] ? this.state.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].beneficio : 0}%), </span>
          <span>Gastado: {functions.getDecimcals(this.state.gastado_mesualmente)} € de {isNaN(this.props.inversionMensualString) ? 0 : functions.getDecimcals(this.props.inversionMensualString)} €, </span>
          <span>Beneficio: {functions.getDecimcals(this.state.beneficio_mensual)} €, </span>
          {this.state.enlaces_fijos > 0 ? <span>Enlaces (presupuestados): {this.state.enlaces_fijos}, </span> : null}
          {this.state.enlaces_fijos > 0 ? <span>Gastado (presupuestado): {functions.getDecimcals(this.state.gastado_fijos)} €, </span> : null}
          {this.state.enlaces_fijos > 0 ? <span>Beneficio (presupuestado): {functions.getDecimcals(this.state.beneficios_fijos)} €</span> : null}
        </div>


        <Temporizador inicio={this.state.inicio} sumatorio={this.state.sumatorio} contador={this.state.fecha === moment().format('YYYY-MM') ? true : false} />


      </div>

    )
  }

}


function matchDispatchToProps(dispatch) { return bindActionCreators({ setIdTimpoCliente }, dispatch) }
export default connect(null, matchDispatchToProps)(PanelCliente);

class ItemVacio extends Component {
  render() {

    return (
      <tr className={`tr-vacio ${this.props.enlacesEnterprise.length === 0 ? 'no-borders' : ''}`}>
        <td colSpan={this.props.colSpan}>

          <div className='info-enterprise'>
            <div>SEO Enterprise </div>
            <div>Crear 2 enlaces</div>
            <div>Bote: {functions.checkNumber('' + this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.bote)}€</div>

          </div>

        </td>
      </tr>
    )
  }
}
