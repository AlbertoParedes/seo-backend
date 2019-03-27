import React, { Component } from 'react';
import Switch from '../../../Global/Switch'
import CheckBox from '../../../Global/CheckBox'
import firebase from '../../../../firebase/Firebase';
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClienteSeleccionado, setPanelClientes, setEditClientesLista } from '../../../../redux/actions';
import $ from 'jquery'
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class ItemCliente extends Component {

  constructor(props){
      super(props);
      this.state={
      };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.clientes_edit!==nextProps.clientes_edit){return true}
    if(this.props.empleado!==nextProps.empleado){return true}
    if(nextProps.cliente_seleccionado !== this.props.cliente_seleccionado){
      //solo renderizamos el componente si se ha selccionado o si estaba seleccionado pero se ha seleccionado otro. Asi evitamos renderizar cada uno de los alumnos.
      if(nextProps.cliente.id_cliente===nextProps.cliente_seleccionado.id_cliente ){ return true;
      }else if(this.props.cliente_seleccionado && nextProps.cliente.id_cliente===this.props.cliente_seleccionado.id_cliente){ return true; }
    }
    if(nextProps.cliente !== this.props.cliente){ return true; }
    return false;
  }

  seleccionarCliente = () => {
    if(this.props.cliente_seleccionado!==this.props.cliente){
      this.props.setClienteSeleccionado(this.props.cliente)
      this.props.setPanelClientes('info')

      if(
        ( this.props.empleado.clientes && this.props.empleado.clientes.tracking && this.props.empleado.clientes.tracking[this.props.cliente.id_cliente] )
        ||
        (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_keywords)
      ){
        console.log('tienes permiso');
      }

    }else{
      this.props.setPanelClientes('info')
    }


  }

  mensajeInformativo = (text) =>{var element = $(`#clientes-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}

  callbackSwitch = (json) => {
    /*
    var multiPath = {}
    if(json.id==='activo'){
      //si eres el empleado de ese cliente si vas a poder modificar el activo
      if( (this.props.cliente.empleados && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])   ||   this.props.empleado.privilegios.tracking.edit.status_cliente){

        multiPath[`Clientes/${this.props.cliente.id_cliente}/tracking/activo`]=json.valor
        db.update(multiPath)
        .then(()=>{ console.log('Guardado correctamente'); })
        .catch((err)=>{ this.mensajeInformativo('Error') })
      }else{
        this.mensajeInformativo('No tiene permiso para modificar este cliente');
      }
    }
    */
  }

  updateCheckBox = (value) => {
/*
    if(
      (this.props.cliente.empleados && this.props.cliente.empleados.tracking && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])
      || (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_clientes )
    ){
      var seleccionados = dotProp.set(this.props.clientes_edit.seleccionados, `${this.props.cliente.id_cliente}.checked`, value) ;
      seleccionados[this.props.cliente.id_cliente].id_cliente=this.props.cliente.id_cliente
      this.props.setEditClientesLista({ activo:this.props.clientes_edit.activo , seleccionados })
      console.log(seleccionados);
      //this.setState({empleados})
    }else{
      this.mensajeInformativo('No tiene permiso para seleccionar este cliente')
    }
*/
  }

  render() {

    var permiso_edit = false/* (this.props.cliente.empleados && this.props.cliente.empleados.tracking && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])
                      || (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_clientes )? true: false
*/


    return(
      <tr data-id={this.props.cliente.id_cliente} className={`${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente===this.props.cliente.id_cliente?'active-row-table':''}`}>

        {this.props.clientes_edit && this.props.clientes_edit.activo?

          <td className={`clientes-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        }

        <td className='clientes-status'>
          <div className={`status-point ${this.props.cliente.activo?'good-status':'warning-status'} ${this.props.cliente.eliminado?'wrong-status':''}     `} ></div>
        </td>

        <td className='clientes-web'>
          <div className='edit-container'>
            <span> {functions.cleanProtocolo(this.props.cliente.web)} </span>
          </div>
        </td>

        <td  className='clientes-nombre'>
          <span> {this.props.cliente.nombre?this.props.cliente.nombre:'-'}</span>
        </td>

        <td  className='clientes-seo'>
          <span> {this.props.cliente.seo?this.props.cliente.seo:'-'}</span>
        </td>


        <td className='clientes-activo'>
          <div className='align-center' >
            <Switch class_div={'switch-table'} callbackSwitch={this.callbackSwitch} json={{id:'activo' }} valor={this.props.cliente.activo}/>
          </div>
        </td>

        <td onClick={()=>{this.seleccionarCliente()}} className='clientes-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado, empleados:state.empleados, empleado:state.empleado, clientes_edit:state.clientes_edit, }}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setClienteSeleccionado, setPanelClientes, setEditClientesLista }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);
