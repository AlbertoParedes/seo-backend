import React, { Component } from 'react'
import InformacionLinkbuilding from './InformacionLinkbuilding'
import * as functions from '../../../Global/functions'
import { connect } from 'react-redux';
import InformacionEmpleados from './InformacionEmpleados'
import Estrategia from './Estrategia'
import Micronichos from './Micronichos'
import InformacionAdicional from './InformacionAdicional'
import $ from 'jquery'


class PanelLinkbuildingPaid extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount = () => { this.scrollToCliente() }
  scrollToCliente = () => { setTimeout(function () { try { $('#container-clientes').animate({ scrollTop: 0 }, 0); } catch (e) { } }, 0); }

  render() {

    var micronichos = {}
    try {
      micronichos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs
      delete micronichos.home
    } catch (e) { }


    return (
      <div className='container-informacion'>

        <InformacionLinkbuilding
          cliente_seleccionado={this.props.cliente_seleccionado}
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleado={this.props.empleado}
          status={this.props.cliente_seleccionado.servicios.linkbuilding.paid.activo ? 'Activado' : 'Desactivado'}
          bote={this.props.cliente_seleccionado.servicios.linkbuilding.paid.bote ? functions.getDecimcals(this.props.cliente_seleccionado.servicios.linkbuilding.paid.bote).toString() : '0'}
          beneficio={this.props.cliente_seleccionado.servicios.linkbuilding.paid.beneficio ? functions.getDecimcals(this.props.cliente_seleccionado.servicios.linkbuilding.paid.beneficio).toString() : '0'}
          inversion_mensual={this.props.cliente_seleccionado.servicios.linkbuilding.paid.inversion_mensual ? functions.getDecimcals(this.props.cliente_seleccionado.servicios.linkbuilding.paid.inversion_mensual).toString() : '0'}
          porcentaje_perdida={this.props.cliente_seleccionado.servicios.linkbuilding.paid.porcentaje_perdida ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.porcentaje_perdida.toString() : '0'}
        />

        <Estrategia
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleado={this.props.empleado}
          anchors={this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.anchors ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.anchors : {}}
          destinos={this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.destinos ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.destinos : {}}
          micronichos={this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo : false}
        />

        <InformacionEmpleados
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleados={this.props.cliente_seleccionado.empleados && this.props.cliente_seleccionado.empleados.linkbuilding_paid ? this.props.cliente_seleccionado.empleados.linkbuilding_paid : false}
          all_empleados={this.props.all_empleados}
          empleado={this.props.empleado}
          cliente_seleccionado={this.props.cliente_seleccionado}
          empleados_disponibles={this.props.empleados_disponibles}
        />

        <InformacionAdicional
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleado={this.props.empleado}
          comentarios={this.props.cliente_seleccionado.servicios.linkbuilding.paid.comentarios ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.comentarios : ''}
        />

        {this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo ?
          <Micronichos
            id_cliente={this.props.cliente_seleccionado.id_cliente}
            empleado={this.props.empleado}
            web_cliente={this.props.cliente_seleccionado.web ? this.props.cliente_seleccionado.web : ''}
            status={this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo : false}
            micronichos={micronichos ? micronichos : {}}
          />
          : null}







      </div>
    )
  }

}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado, empleado: state.empleado, all_empleados: state.empleados, empleados_disponibles: state.linkbuilding.enlaces.tipos.paid.paneles.lista.filtros.empleados.items } }
export default connect(mapStateToProps)(PanelLinkbuildingPaid);
