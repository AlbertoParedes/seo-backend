import React, { Component } from 'react';
import CheckBox from '../../../Global/CheckBox'
import firebase from '../../../../firebase/Firebase';
import * as functions from '../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClienteSeleccionado, setPanelTracking, setEditClientesLista, setKeywordTrackingSelected } from '../../../../redux/actions';
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

  seleccionarCliente = (panel) => {

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
      this.props.setKeywordTrackingSelected(null)
      this.props.setPanelTracking(panel)

    }else{
      this.props.setPanelTracking(panel)
    }

  }

  render() {

    var permiso_edit = false/* (this.props.cliente.empleados && this.props.cliente.empleados.tracking && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])
                      || (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_clientes )? true: false
*/

  var empleados = '-';
  if(this.props.cliente.empleados && this.props.cliente.empleados.tracking){
    var empleados_ordenados = Object.entries(this.props.cliente.empleados.tracking)
    if(empleados_ordenados.length>1){
      empleados_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
        if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) { return 1; }
        if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) { return -1; }
        return 0;
      });
    }
    empleados_ordenados.forEach((e,k)=>{
      if(k===empleados_ordenados.length-1){ empleados = empleados+' y '+e[1].nombre;
      }else{ empleados = empleados+', '+e[1].nombre; }
    })
    empleados = empleados.replace('-,','')
    empleados = empleados.replace('- y ','')
  }

    return(
      <tr data-id={this.props.cliente.id_cliente} className={`${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente===this.props.cliente.id_cliente?'active-row-table':''}`}>

        {this.props.clientes_edit && this.props.clientes_edit.activo?

          <td className={`clientes-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        }

        <td className='cli-status'>
          <div className={`status-point ${this.props.cliente.activo && this.props.cliente.servicios.tracking.activo?'good-status':'warning-status'} ${this.props.cliente.eliminado?'wrong-status':''}     `} ></div>
        </td>

        <td className='cli-web break_sentence'>
          <span> {functions.cleanProtocolo(this.props.cliente.web)} </span>
        </td>

        <td  className='cli-empleados break_sentence' onClick={()=>!this.props.cliente.empleados ?this.setState({showEmpleados:true}): null }>
          <span> {empleados} </span>
        </td>

        <td  className='cli-keys' onClick={()=>this.seleccionarCliente('keywords')}>
          <span> {this.props.cliente.servicios.tracking.keywords?Object.keys(this.props.cliente.servicios.tracking.keywords).length:0} </span>
        </td>

        <td onClick={()=>{this.seleccionarCliente('info')}} className='cli-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado, empleados:state.empleados, empleado:state.empleado, clientes_edit:state.clientes_edit, }}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setClienteSeleccionado, setPanelTracking, setEditClientesLista, setKeywordTrackingSelected }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);
