import React, { Component } from 'react'
import * as functions from '../../../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setClienteSeleccionado } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class ItemCliente extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  seleccionarCliente = () => {

    try { if (this.props.cliente.id_cliente === this.props.empleado.session.cliente_seleccionado) { this.props.setClienteSeleccionado(this.props.cliente); return null } } catch (e) { }

    var multiPath = {}
    if (!this.props.cliente.servicios.linkbuilding.paid.editando_por) {
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`] = this.props.cliente.id_cliente
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_paid'
      multiPath[`Clientes/${this.props.cliente.id_cliente}/servicios/linkbuilding/paid/editando_por`] = { id_empleado: this.props.empleado.id_empleado, nombre: this.props.empleado.nombre + ' ' + this.props.empleado.apellidos, subpanel: 'linkbuilding_paid' }
    } else {
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`] = this.props.cliente.id_cliente
    }
    try {
      if (this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado === this.props.empleado.id_empleado) {
        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`] = null
        multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_paid'
      }
    } catch (e) { }
    try {
      if (this.props.empleado.session.cliente_seleccionado && this.props.empleado.session.cliente_seleccionado !== this.props.cliente.id_cliente) {
        multiPath[`Clientes/${this.props.empleado.session.cliente_seleccionado}/servicios/linkbuilding/paid/editando_por`] = null
      }
    } catch (e) { }
    if (Object.keys(multiPath).length > 0) { db.update(multiPath) }
    this.props.setClienteSeleccionado(this.props.cliente)
  }

  render() {
    //var mes = this.props.cliente.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha]?this.props.cliente.servicios.linkbuilding.free.home.mensualidades[this.props.fecha]:false
    var pausado = !this.props.cliente.activo || !this.props.cliente.servicios.linkbuilding.paid.activo;
    var eliminado = this.props.cliente.eliminado;

    var bote = this.props.cliente.servicios.linkbuilding.paid.bote

    var enterprise = false;
    try {
      if (pausado && this.props.cliente.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades[this.props.fecha].seo === 'Enterprise') {
        enterprise = true
      }
    } catch (error) { }
    //si esta pausado pero es enterprise y esta activo hy que hacerle enlaces


    return (
      <div className={`item-lista-categoria ${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente === this.props.cliente.id_cliente ? 'active-row-table' : ''} `} onClick={() => { this.seleccionarCliente() }} >


        <div className='container-clientes-div-enlaces'>

          <div className='lb-enla-status-clientes'>
            {/*enlaces_restante>0?<div className='lb-enla-follows-clientes-number'>{enlaces_restante}</div>:null*/}
            {!pausado && !eliminado && bote >= 0 && bote < 2 ?
              <i className="material-icons color-favorito size-bote-disponible"> done </i>
              : null}
            {!pausado && !eliminado && bote > 2 ?
              <i className="material-icons color-verde size-bote-disponible"> trending_up </i>
              : null}
            {!pausado && !eliminado && bote < 0 ?
              <i className="material-icons color-wrong size-bote-disponible"> trending_down </i>
              : null}

            {pausado || eliminado ?
              <i className="material-icons color-wrong size-bote-disponible opacity_0"> trending_down </i>
              : null}

          </div>

          <div className='lb-enla-info-clientes block-with-text'>
            <div className='block-with-text'>{this.props.cliente.dominio}</div>
            <div className='subtitle-lb-clientes-enlaces'>
              {enterprise ?
                <span className='span-enterprise-cli'>ENTERPRISE</span>
                :
                <span>disponible a gastar: {functions.getDecimcals(bote)} €</span>
              }

            </div>
          </div>

          <div className='lb-enla-follows-clientes'>

            {/*
            {!pausado && !eliminado && this.props.cliente.tipo==='better_links'? <i className="material-icons color-favorito"> grade </i> :null}
            {!pausado && !eliminado && this.props.cliente.tipo==='new'? <i className="material-icons color-new"> fiber_new </i> :null}
            {!pausado && !eliminado && this.props.cliente.tipo==='our'? <span className='cliente-our-enlaces'>y</span> :null}

            {pausado && !eliminado? <i className="material-icons color-pausa"> pause </i> :null}
            {eliminado? <i className="material-icons color-basura"> delete </i> :null}

            {!pausado && !eliminado && this.props.cliente.tipo!=='better_links' && this.props.cliente.tipo!=='new' && this.props.cliente.tipo!=='our'?<div className={`lb-enla-status-clientes-point`}></div>:null}
            */}

            {!pausado && !eliminado && this.props.cliente.tipo === 'better_links' ? <div className={`lb-enla-status-clientes-point favorite-status`}></div> : null}
            {!pausado && !eliminado && this.props.cliente.tipo === 'new' ? <div className={`lb-enla-status-clientes-point good-status`}></div> : null}
            {!pausado && !eliminado && this.props.cliente.tipo === 'our' ? <div className={`lb-enla-status-clientes-point yoseo-status`}></div> : null}

            {pausado && !eliminado ? <div className={`lb-enla-status-clientes-point warning-status`}></div> : null}
            {eliminado ? <div className={`lb-enla-status-clientes-point wrong-status`}></div> : null}

            {!pausado && !eliminado && this.props.cliente.tipo !== 'better_links' && this.props.cliente.tipo !== 'new' && this.props.cliente.tipo !== 'our' ? <div className={`lb-enla-status-clientes-point`}></div> : null}


          </div>

        </div>

      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    cliente_seleccionado: state.cliente_seleccionado,
    filtros: state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
    fecha: state.linkbuilding.enlaces.fecha,
    empleado: state.empleado
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setClienteSeleccionado }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);
