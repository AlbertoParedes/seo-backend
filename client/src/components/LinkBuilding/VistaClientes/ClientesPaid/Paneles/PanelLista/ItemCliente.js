
import React, { Component } from 'react';
import Switch from '../../../../../Global/Switch'
import CheckBox from '../../../../../Global/CheckBox'
import firebase from '../../../../../../firebase/Firebase';
import data from '../../../../../Global/Data/Data'
import functions from '../../../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClienteSeleccionado, setPanelClientesPaidLinkbuilding } from '../../../../../../redux/actions';
import $ from 'jquery'
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class ItemCliente extends Component {

  constructor(props){
      super(props);
      this.state={
        showEmpleados:false,
        lista_empleados: {}
      };
  }

  shouldComponentUpdate(nextProps, nextState) {
    /*if(this.props.tracking_clientes_edit!==nextProps.tracking_clientes_edit){return true}
    if(this.props.empleado!==nextProps.empleado){return true}
    if(nextProps.cliente_seleccionado !== this.props.cliente_seleccionado){
      //solo renderizamos el componente si se ha selccionado o si estaba seleccionado pero se ha seleccionado otro. Asi evitamos renderizar cada uno de los alumnos.
      if(nextProps.cliente.id_cliente===nextProps.cliente_seleccionado.id_cliente ){ return true;
      }else if(this.props.cliente_seleccionado && nextProps.cliente.id_cliente===this.props.cliente_seleccionado.id_cliente){ return true; }
    }
    if(nextProps.cliente !== this.props.cliente){ return true; }
    if(this.state.showEmpleados!==nextState.showEmpleados)return true
    return false;
    */
    return true;
  }


  seleccionarCliente = () => {

    if(this.props.cliente_seleccionado!==this.props.cliente){

      var multiPath = {}
      try {
        if(this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado===this.props.empleado.id_empleado){
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`]=null
        }
      } catch (e) {}
      try {
        if(this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado===this.props.empleado.id_empleado){
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`]=null
        }
      } catch (e) {}
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`]=this.props.cliente.id_cliente
      if(Object.keys(multiPath).length>0){ db.update(multiPath) }

      this.props.setClienteSeleccionado(this.props.cliente)
      this.props.setPanelClientesPaidLinkbuilding('info')



    }else{
      this.props.setPanelClientesPaidLinkbuilding('info')
    }

  }


  /*openAlumnos = () => {
    if(this.props.n_alumnos>0){
      this.props.setClienteSeleccionado(this.props.cliente)
      this.props.setPanelTracking('panel_alumnos')
    }else{
      this.mensajeInformativo('No se han inscrito alumnos');
    }
  }*/


  render() {

    return(
      <tr data-id={this.props.cliente.id_cliente} className={`${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente===this.props.cliente.id_cliente?'active-row-table':''}`}>

        {/*this.props.tracking_clientes_edit.activo?

          <td className={`cli-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-clientes-paid-status'>
          <div className={`status-point ${this.props.cliente.activo && this.props.cliente.servicios.linkbuilding.paid.activo?'good-status':'warning-status'} ${this.props.cliente.eliminado?'wrong-status':''}     `} ></div>
        </td>

        <td className='lb-clientes-paid-web'>
          <span> {functions.cleanProtocolo(this.props.cliente.web)} </span>
        </td>

        <td  className='lb-clientes-paid-inver-mens'>
          <span> {functions.getDecimcals(this.props.cliente.servicios.linkbuilding.paid.inversion_mensual)} €</span>
        </td>

        <td  className='lb-clientes-paid-beneficio'>
          <span> {functions.getDecimcals(this.props.cliente.servicios.linkbuilding.paid.beneficio)} %</span>
        </td>

        <td  className='lb-clientes-paid-perdida'>
          <span> {functions.getDecimcals(this.props.cliente.servicios.linkbuilding.paid.porcentaje_perdida)} %</span>
        </td>

        <td  className='lb-clientes-paid-bote'>
          <span> {functions.getDecimcals(this.props.cliente.servicios.linkbuilding.paid.bote)} €</span>
        </td>

        <td className='lb-clientes-paid-micronichos'>
          <div className='align-center' >
            <Switch class_div={'switch-table'} callbackSwitch={this.callbackSwitch} json={{id:'activo' }} valor={this.props.cliente.servicios.linkbuilding.paid.micronichos?this.props.cliente.servicios.linkbuilding.paid.micronichos.activo:false}/>
          </div>
        </td>

        <td onClick={()=>{this.seleccionarCliente()}} className='lb-clientes-paid-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado, empleado:state.empleado, }}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setClienteSeleccionado, setPanelClientesPaidLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);
