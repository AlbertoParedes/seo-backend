
import React, { Component } from 'react';
import Switch from '../../../../../Global/Switch'
import CheckBox from '../../../../../Global/CheckBox'
import firebase from '../../../../../../firebase/Firebase';
import data from '../../../../../Global/Data/Data'
import functions from '../../../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMedioSeleccionadoPaid, setPanelMediosPaidLinkbuilding } from '../../../../../../redux/actions';
import $ from 'jquery'
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class ItemMedio extends Component {

  constructor(props){
      super(props);
      this.state={
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

  seleccionarMedio = () => {
    this.props.setMedioSeleccionadoPaid(this.props.medio)
    this.props.setPanelMediosPaidLinkbuilding('info')
  }
  seleccionarEnlaces = () => {
    this.props.setMedioSeleccionadoPaid(this.props.medio)
    this.props.setPanelMediosPaidLinkbuilding('enlaces')
  }

  render() {

    var enlaces_disponibles = {}
    if(this.props.medio.enlaces){
      enlaces_disponibles = Object.entries(this.props.medio.enlaces).filter(([k,e])=>{return !e.id_cliente})
    }

    return(
      <tr data-id={this.props.medio.id_medio} className={`${this.props.medio_seleccionado && this.props.medio_seleccionado.id_medio===this.props.medio.id_medio?'active-row-table':''}`}>

        {/*this.props.tracking_clientes_edit.activo?

          <td className={`cli-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-medios-paid-status'>
          <div className={`status-point ${this.props.medio.activo?'good-status':'warning-status'} ${this.props.medio.eliminado?'wrong-status':''}     `} ></div>
        </td>


        <td className='lb-medios-paid-web block-with-text'>
          <span>{functions.cleanProtocolo(this.props.medio.web)}</span>
        </td>

        <td  className='lb-medios-paid-dr'>
          <span>{this.props.medio.dr}</span>
        </td>

        <td  className='lb-medios-paid-ur'>
          <span>{this.props.medio.ur}</span>
        </td>

        {/*
        <td  className='lb-medios-paid-tematicas'>
          <span>-</span>
        </td>
        */}

        <td  className='lb-medios-paid-descripcion block-with-text'>
          <span>{this.props.medio.descripcion}</span>
        </td>

        <td  className='lb-medios-paid-reutilizable'>
          <span>No</span>
        </td>

        <td onClick={()=>{this.seleccionarEnlaces()}} className='lb-medios-paid-enlaces'>
          <span>{Object.keys(enlaces_disponibles).length}</span>
        </td>


        <td onClick={()=>{this.seleccionarMedio()}} className='lb-medios-paid-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ medio_seleccionado: state.linkbuilding.medios.tipos.paid.medio_seleccionado }}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setMedioSeleccionadoPaid, setPanelMediosPaidLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemMedio);
