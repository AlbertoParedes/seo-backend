
import React, { Component } from 'react';
import Switch from '../../../../../Global/Switch'
import CheckBox from '../../../../../Global/CheckBox'
import firebase from '../../../../../../firebase/Firebase';
import data from '../../../../../Global/Data/Data'
import functions from '../../../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClienteSeleccionado, setPanelClientesFreeLinkbuilding } from '../../../../../../redux/actions';
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
    this.props.setClienteSeleccionado(this.props.cliente)
    this.props.setPanelClientesFreeLinkbuilding('info')
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
    var seo = '';
    if(this.props.cliente.seo==='lite')seo='Lite';
    else if(this.props.cliente.seo==='pro')seo='Pro';
    else if(this.props.cliente.seo==='premium')seo='Premium';
    else if(this.props.cliente.seo==='medida')seo='Medida';
    return(
      <tr data-id={this.props.cliente.id_cliente} className={`${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente===this.props.cliente.id_cliente?'active-row-table':''}`}>

        {/*this.props.tracking_clientes_edit.activo?

          <td className={`cli-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-clientes-status'>
          <div className={`status-point ${this.props.cliente.servicios.linkbuilding.free.activo?'good-status':'warning-status'} ${this.props.cliente.eliminado?'wrong-status':''}     `} ></div>
        </td>

        <td className='lb-clientes-web'>
          <span> {functions.cleanProtocolo(this.props.cliente.web)} </span>
        </td>

        <td  className='lb-clientes-seo'>
          <span> {seo} </span>
        </td>

        <td  className='lb-clientes-follows'>
          <span> {this.props.cliente.follows} </span>
        </td>

        <td  className='lb-clientes-nofollows'>
          <span> {this.props.cliente.nofollows} </span>
        </td>

        <td className='lb-clientes-blog'>
          <div className='align-center' >
            <Switch class_div={'switch-table'} callbackSwitch={this.callbackSwitch} json={{id:'activo' }} valor={this.props.cliente.blog}/>
          </div>
        </td>

        <td onClick={()=>{this.seleccionarCliente()}} className='cli-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado, empleados:state.empleados, empleado:state.empleado, tracking_clientes_edit:state.tracking_clientes_edit, }}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setClienteSeleccionado, setPanelClientesFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);


//{/*<div onClick={()=>this.updateEmpleados(e)} >{e.nombre}</div>*/}
