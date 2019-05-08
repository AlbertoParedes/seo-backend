import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import { connect } from 'react-redux';
import InformacionLinkbuilding from './InformacionLinkbuilding'
import InformacionEmpleados from './InformacionEmpleados'
import Estrategia from './Estrategia'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import PopUpLista from '../../../Global/Popups/ListaOpciones'
import dotProp from 'dot-prop-immutable';
import firebase from '../../../../firebase/Firebase';
import InformacionAdicional from './InformacionAdicional'
import $ from 'jquery'
const db = firebase.database().ref();

class PanelLinkbuildingFree extends Component {

  componentDidMount = () => { this.scrollToCliente() }
  scrollToCliente = () => { setTimeout(function(){ try { $('#container-clientes').animate({scrollTop:0}, 0); } catch (e) { } }, 0); }

  render(){
    console.log(this.props.cliente_seleccionado);
    return(
      <div className='container-informacion'>

        <InformacionLinkbuilding
          empleado={this.props.empleado}
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          status={this.props.cliente_seleccionado.servicios.linkbuilding.free.activo?'Activado':'Desactivado'}
          seo={this.props.cliente_seleccionado.seo}
          follows={this.props.cliente_seleccionado.follows.toString().toLowerCase()}
          nofollows={this.props.cliente_seleccionado.nofollows.toString().toLowerCase()}
        />

        <Estrategia
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleado={this.props.empleado}
          anchors={this.props.cliente_seleccionado.servicios.linkbuilding.free.home.anchors?this.props.cliente_seleccionado.servicios.linkbuilding.free.home.anchors:{}}
          destinos={this.props.cliente_seleccionado.servicios.linkbuilding.free.home.destinos?this.props.cliente_seleccionado.servicios.linkbuilding.free.home.destinos:{}}
        />

        <InformacionEmpleados
          empleado={this.props.empleado}
          empleados={this.props.cliente_seleccionado.empleados && this.props.cliente_seleccionado.empleados.linkbuilding_free ? this.props.cliente_seleccionado.empleados.linkbuilding_free: false}
          all_empleados={this.props.all_empleados}
          follows={this.props.cliente_seleccionado.follows?this.props.cliente_seleccionado.follows:0}
          nofollows={this.props.cliente_seleccionado.nofollows?this.props.cliente_seleccionado.nofollows:0}
          cliente_seleccionado={this.props.cliente_seleccionado}
          empleados_disponibles={this.props.empleados_disponibles}
        />

        <InformacionAdicional
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          empleado={this.props.empleado}
          comentarios={this.props.cliente_seleccionado.servicios.linkbuilding.free.comentarios?this.props.cliente_seleccionado.servicios.linkbuilding.free.comentarios:''}
        />


      </div>
    )
  }

}

function mapStateToProps(state){return{ cliente_seleccionado:state.cliente_seleccionado, all_empleados:state.empleados,empleado:state.empleado, empleados_disponibles:state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros.empleados.items }}
export default connect(mapStateToProps)(PanelLinkbuildingFree);
