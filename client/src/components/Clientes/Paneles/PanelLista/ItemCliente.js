import React, { Component } from 'react';
import Switch from '../../../Global/Switch'
import CheckBox from '../../../Global/CheckBox'
import firebase from '../../../../firebase/Firebase';
import * as functions from '../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClienteSeleccionado, setPanelClientes, setEditClientesLista, setPopUpInfo } from '../../../../redux/actions';
import SimpleInputDesplegableMin from '../../../Global/SimpleInputDesplegableMin'
import $ from 'jquery'
import data from '../../../Global/Data/Data';
const db = firebase.database().ref();

class ItemCliente extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.clientes_edit !== nextProps.clientes_edit) { return true }
    if (this.props.empleado !== nextProps.empleado) { return true }
    if (nextProps.cliente_seleccionado !== this.props.cliente_seleccionado) {
      //solo renderizamos el componente si se ha selccionado o si estaba seleccionado pero se ha seleccionado otro. Asi evitamos renderizar cada uno de los alumnos.
      if (nextProps.cliente.id_cliente === nextProps.cliente_seleccionado.id_cliente) {
        return true;
      } else if (this.props.cliente_seleccionado && nextProps.cliente.id_cliente === this.props.cliente_seleccionado.id_cliente) { return true; }
    }
    if (nextProps.cliente !== this.props.cliente) { return true; }
    return false;
  }

  seleccionarCliente = () => {

    if (this.props.cliente_seleccionado !== this.props.cliente) {

      var multiPath = {}
      try {
        if (this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado === this.props.empleado.id_empleado) {
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`] = null
        }
      } catch (e) { }
      try {
        if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado === this.props.empleado.id_empleado) {
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`] = null
        }
      } catch (e) { }
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`] = this.props.cliente.id_cliente
      if (Object.keys(multiPath).length > 0) { db.update(multiPath) }

      this.props.setClienteSeleccionado(this.props.cliente)
      this.props.setPanelClientes('info')



    } else {
      this.props.setPanelClientes('info')
    }


  }

  mensajeInformativo = (text) => { var element = $(`#clientes-mensaje`); if (!$(element).attr('class').includes('show')) { $(element).text(text).addClass('show'); setTimeout(function () { $(element).removeClass('show'); }, 3500); } }

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

  changeValor = (valor) => {
    if (this.props.cliente.tipo === valor) return null;
    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;
    var multiPath = {}

    multiPath[`Clientes/${this.props.cliente.id_cliente}/tipo`] = valor;

    id_log = db.child(`Servicios/Logs/clientes/${this.props.cliente.id_cliente}/informacion/info`).push().key;
    functions.createLogs(multiPath, timestamp, this.props.cliente.tipo, valor, 'tipo', id_empleado, `Servicios/Logs/clientes/${this.props.cliente.id_cliente}/informacion/info/${id_log}`)



    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, text: 'Se han guardado los cambios correctamente', status: 'done', moment: Date.now() })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, text: 'Error al guardar', status: 'close', moment: Date.now() })
      })

  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.info_cliente.edit.info;
    } catch (e) { }

    var tipo = this.props.cliente.tipo;
    var classTipo = ''
    if (tipo === 'our') {
      tipo = 'Yoseo'
      classTipo = 'yoseo-status-color'
    } else if (tipo === 'old') {
      tipo = 'Normal'
      classTipo = ''
    } else if (tipo === 'new') {
      tipo = 'Nuevo'
      classTipo = 'good-status-color'
    } else if (tipo === 'better_links') {
      tipo = 'A mejorar'
      classTipo = 'favorite-status-color'
    }

    return (
      <tr data-id={this.props.cliente.id_cliente} className={`${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente === this.props.cliente.id_cliente ? 'active-row-table' : ''}`}>

        {/*this.props.clientes_edit && this.props.clientes_edit.activo ?

          <td className={`clientes-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit ? 'no-selecionable' : ''}`} checked={!this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente] ? false : this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente].checked} changeValue={value => this.updateCheckBox(value)} />
          </td>

          : null
        */}

        <td className='clientes-status'>
          <div className={`status-point ${this.props.cliente.activo ? 'good-status' : 'warning-status'} ${this.props.cliente.eliminado ? 'wrong-status' : ''}     `} ></div>
        </td>

        <td className='clientes-web'>
          <div className='edit-container'>
            <span> {functions.cleanProtocolo(this.props.cliente.web)} </span>
          </div>
        </td>

        <td className='clientes-nombre'>
          <span>{this.props.cliente.nombre ? this.props.cliente.nombre : '-'}</span>
        </td>

        <td className='clientes-seo'>
          <span>{this.props.cliente.seo ? this.props.cliente.seo : '-'}</span>
        </td>


        <td className='clientes-tipo'>
          {privilegio ?
            <SimpleInputDesplegableMin _classSpan={classTipo} text={tipo} lista={data.tipos} type='object' changeValor={valor => this.changeValor(valor)} />

            :
            <span className={` ${classTipo}`}>{tipo}</span>
          }
        </td>

        <td onClick={() => { this.seleccionarCliente() }} className='clientes-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado, empleados: state.empleados, empleado: state.empleado, clientes_edit: state.clientes_edit, } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setClienteSeleccionado, setPanelClientes, setEditClientesLista, setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);
