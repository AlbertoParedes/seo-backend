import React, { Component } from 'react'
import { connect } from 'react-redux';
import InformacionTracking from './InformacionTracking'
import InformacionEmpleados from './InformacionEmpleados'
import InformacionAdicional from './InformacionAdicional'
import $ from 'jquery'


class PanelTracking extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount = () => { this.scrollToCliente() }
  scrollToCliente = () => { setTimeout(function () { try { $('#container-clientes').animate({ scrollTop: 0 }, 0); } catch (e) { } }, 0); }

  render() {
    return (
      <div className='container-informacion'>

        <InformacionTracking
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleados={this.props.cliente_seleccionado.empleados && this.props.cliente_seleccionado.empleados.tracking ? this.props.cliente_seleccionado.empleados.tracking : false}
          empleado={this.props.empleado}
          status={this.props.cliente_seleccionado.servicios.tracking.activo ? 'Activado' : 'Desactivado'}
          keywords={this.props.cliente_seleccionado.servicios.tracking.keywords ? this.props.cliente_seleccionado.servicios.tracking.keywords : {}}
          dominio_a_buscar={this.props.cliente_seleccionado.servicios.tracking.dominio_a_buscar ? this.props.cliente_seleccionado.servicios.tracking.dominio_a_buscar : ''}

          dominios={this.props.cliente_seleccionado.servicios.tracking.dominios ? this.props.cliente_seleccionado.servicios.tracking.dominios : {}}
          competidores={this.props.cliente_seleccionado.servicios.tracking.competidores ? this.props.cliente_seleccionado.servicios.tracking.competidores : {}}

        />

        <InformacionEmpleados
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleados={this.props.cliente_seleccionado.empleados && this.props.cliente_seleccionado.empleados.tracking ? this.props.cliente_seleccionado.empleados.tracking : false}
          all_empleados={this.props.all_empleados}
          empleado={this.props.empleado}
          cliente_seleccionado={this.props.cliente_seleccionado}
          empleados_disponibles={this.props.empleados_disponibles}
        />

        <InformacionAdicional
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleados={this.props.cliente_seleccionado.empleados && this.props.cliente_seleccionado.empleados.tracking ? this.props.cliente_seleccionado.empleados.tracking : false}
          empleado={this.props.empleado}
          comentarios={this.props.cliente_seleccionado.servicios.tracking.comentarios ? this.props.cliente_seleccionado.servicios.tracking.comentarios : ''}
        />


      </div>
    )
  }

}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado, empleado: state.empleado, all_empleados: state.empleados, empleados_disponibles: state.tracking.paneles.lista.filtros.empleados.items } }
export default connect(mapStateToProps)(PanelTracking);

/*
class InformacionEmpleados extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>2. Empleados</p>

        <div className='ei-parent'>




        </div>

      </div>
    )
  }
}


class InformacionAdicional extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>3. Información adicional</p>

        <SimpleTextArea _class='pdd-top-10' title='Comentarios'  text={''} changeValue={comentario=>{this.setState({comentario})}}/>


      </div>
    )
  }
}
*/
