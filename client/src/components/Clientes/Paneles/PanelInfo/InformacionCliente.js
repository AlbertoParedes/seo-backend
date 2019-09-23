import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import { URLESTADOCLIENTE } from '../../../Global/Data/constants'
import * as functions from '../../../Global/functions'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
import $ from 'jquery'
const db = firebase.database().ref();

class InformacionCliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web: this.props.web,
      nombre: this.props.nombre,
      tipo: this.props.tipo,
      status: this.props.status,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.web !== nextProps.web ||
      this.props.nombre !== nextProps.nombre ||
      this.props.tipo !== nextProps.tipo ||
      this.props.status !== nextProps.status
    ) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.web !== newProps.web) { this.setState({ web: newProps.web }) }
    if (this.props.nombre !== newProps.nombre) { this.setState({ nombre: newProps.nombre }) }
    if (this.props.tipo !== newProps.tipo) { this.setState({ tipo: newProps.tipo }) }
    if (this.props.status !== newProps.status) { this.setState({ status: newProps.status }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {};

    var web_repetida = Object.entries(this.props.clientes).some(([k, c]) => { return functions.getDominio(c.web) === functions.getDominio(this.state.web) && k !== this.props.id_cliente })
    if (web_repetida) {
      this.props.setPopUpInfo({ visibility: true, text: 'Este cliente ya existe', status: 'close', moment: Date.now() })
      return false;
    } else if (!functions.isLink(this.state.web)) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', text: 'La web del cliente debe empezar por http:// o https:// y contener un " . "', moment: Date.now() })
      return false;
    }
    else if (this.state.web.trim() === '' /*|| this.state.nombre.trim() === ''*/) {
      //this.props.mensajeInformativo('Exiten errores en los campos')
      this.props.setPopUpInfo({ visibility: true, status: 'close', text: 'Existen errores en los campos', moment: Date.now() })
      return false;
    }

    multiPath[`Clientes/${this.props.id_cliente}/web`] = this.state.web.trim();
    multiPath[`Clientes/${this.props.id_cliente}/nombre`] = this.state.nombre.trim();
    multiPath[`Clientes/${this.props.id_cliente}/tipo`] = this.state.tipo;

    if (this.state.status === 'Eliminado') {
      multiPath[`Clientes/${this.props.id_cliente}/eliminado`] = true
    } else if (this.state.status === 'Activado') {
      multiPath[`Clientes/${this.props.id_cliente}/activo`] = true
      multiPath[`Clientes/${this.props.id_cliente}/eliminado`] = false
    } else if (this.state.status === 'Desactivado') {
      multiPath[`Clientes/${this.props.id_cliente}/activo`] = false
      multiPath[`Clientes/${this.props.id_cliente}/eliminado`] = false
    }

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.status !== this.state.status) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.status, this.state.status, 'estado', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info/${id_log}`)
    }
    if (this.props.web !== this.state.web) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.web, this.state.web.trim(), 'web', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info/${id_log}`)
    }

    if (this.props.nombre !== this.state.nombre) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.nombre, this.state.nombre.trim(), 'nombre', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info/${id_log}`)
    }

    if (this.props.tipo !== this.state.tipo) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.tipo, this.state.tipo, 'tipo', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info/${id_log}`)
    }


    const oldStatus = this.props.status;
    const newStatus = this.state.status;

    db.update(multiPath)
      .then(() => {

        var data = {}
        if (oldStatus !== newStatus) {
          if (this.state.status === 'Activado') {
            data.subject = `CLIENTE ACTIVADO: ${this.props.clientes[this.props.id_cliente].web}`;
            data.status = 'good';
            data.frase = `El cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-good'>activado</span>`
          } else if (this.state.status === 'Desactivado') {
            data.subject = `CLIENTE DESCTIVADO: ${this.props.clientes[this.props.id_cliente].web}`
            data.status = 'warning'
            data.frase = `El cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-warning'>desactivado</span>`
          } else if (this.state.status === 'Eliminado') {
            data.subject = `CLIENTE ELIMINADO: ${this.props.clientes[this.props.id_cliente].web}`
            data.status = 'error'
            data.frase = `El cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-wrong'>eliminado</span>`
          }

          data.empleado = this.props.empleado.nombre + " " + this.props.empleado.apellidos;
          data.cliente = this.props.clientes[this.props.id_cliente].web;


          $.post(URLESTADOCLIENTE, data, (request, data) => {
            //console.log(request, data);
          })

        }

        this.props.setPopUpInfo({ visibility: true, text: 'Se han guardado los cambios correctamente', status: 'done', moment: Date.now() })

      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, text: 'Error al guardar', status: 'close', moment: Date.now() })
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      })

  }

  createLogs = (multiPath, oldValue, newValue, ) => {

  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.info_cliente.edit.info;
    } catch (e) { }

    var edited = false;
    if (this.props.web !== this.state.web ||
      this.props.nombre !== this.state.nombre ||
      this.props.tipo !== this.state.tipo ||
      this.props.status !== this.state.status
    ) {
      edited = true;
    }

    //comprobar que el cliente no esta repetido
    var web_repetida = Object.entries(this.props.clientes).some(([k, c]) => { return functions.getDominio(c.web) === functions.getDominio(this.state.web) && k !== this.props.id_cliente })
    var isLink = functions.isLink(this.state.web)

    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>1. Información del cliente</p>

        {/*ID*/}

        <SimpleInputDesplegable lista={data.estados} type={`${privilegio ? '' : 'block'}`} _class='div_text_mitad' title='Estado' text={this.state.status} changeValor={(status) => this.setState({ status })} />


        {/*URL*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio ? '' : 'block'}`} title='Web del cliente' _class_container={this.state.web.trim() === '' || web_repetida || !isLink ? 'error-form-input' : null} text={this.state.web} changeValue={web => { this.setState({ web }) }} />
        </div>

        {/*NOMBRE*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio ? '' : 'block'}`} title='Nombre del cliente' _class_container={this.state.nombre.trim() === '' ? 'error-form-input' : null} text={this.state.nombre} changeValue={nombre => { this.setState({ nombre }) }} />
        </div>

        {/*tipo y Estado*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable type={`${privilegio ? 'object' : 'block'}`} lista={data.tipos} title='Tipo de cliente' text={data.tipos[this.state.tipo].texto} changeValor={(tipo) => this.setState({ tipo })} />
          <SimpleInput type='block' title='Código' text={this.props.id_cliente} />
        </div>


      </div>
    )
  }

}
function mapStateToProps(state) { return { clientes: state.clientes, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(InformacionCliente);
