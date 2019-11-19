import React, { Component } from 'react'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import PopUpLista from '../../../Global/Popups/ListaOpciones'
import { URL_EMPLEADOS_LG } from '../../../Global/Data/constants'
import $ from 'jquery'
import dotProp from 'dot-prop-immutable';
import * as functions from '../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionEmpleados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empleados: this.props.empleados,
      all_empleados: this.all_empleados,
      follows: this.props.follows,
      nofollows: this.props.nofollows,
      show_empleados: false,
      fecha: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)),
      empleados_eliminados: {}
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.empleados !== nextProps.empleados ||
      this.props.all_empleados !== nextProps.all_empleados) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.empleados !== newProps.empleados) { this.setState({ empleados: newProps.empleados }) }
    if (this.props.all_empleados !== newProps.all_empleados) { this.setState({ all_empleados: newProps.all_empleados }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var empleados = this.state.empleados, multiPath = {}


    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_paid`] = empleados

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.empleados !== this.state.empleados) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, Object.keys(this.props.empleados).length > 0 ? this.props.empleados : false, Object.keys(this.state.empleados).length > 0 ? this.state.empleados : false, 'empleados', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {

        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })


  }

  openEmpleados = () => {
    this.setState({ show_empleados: true })
  }

  addEmpleado = (id) => {
    var empleados = this.state.empleados ? JSON.parse(JSON.stringify(this.state.empleados)) : {}
    if (!empleados[id]) {
      var multiPath = {}
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_paid/${id}`] = {
        nombre: this.props.empleados_disponibles[id].valor,
        id_empleado: id
      }

      empleados[id] = {
        nombre: this.props.empleados_disponibles[id].valor,
        id_empleado: id
      }


      {/*LOGS*/ }
      let id_log;
      var timestamp = (+new Date());
      var id_empleado = this.props.empleado.id_empleado;

      if (this.props.empleados !== empleados) {
        id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
        functions.createLogs(multiPath, timestamp, Object.keys(this.props.empleados).length > 0 ? this.props.empleados : false, Object.keys(empleados).length > 0 ? empleados : false, 'empleados', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
      }

      const oldEmpleados = this.props.empleados, newEmpleados = empleados;
      db.update(multiPath)
        .then(() => {


          var data = {}
          if (oldEmpleados !== newEmpleados) {
            data.subject = `NUEVA ASIGNACIÓN DE EMPLEADOS (LP): ${this.props.cliente_seleccionado.web}`;
            data.empleado = this.props.empleado.nombre + " " + this.props.empleado.apellidos;
            data.cliente = this.props.cliente_seleccionado.web;

            var destinatarios = `"${this.props.empleado.nombre} ${this.props.empleado.apellidos}" <${this.props.empleado.email}>`;
            var container = ``;
            Object.entries(newEmpleados).forEach((item, key) => {
              item = item[1];
              destinatarios += `, "${this.props.all_empleados[item.id_empleado].nombre} ${this.props.all_empleados[item.id_empleado].apellidos}" <${this.props.all_empleados[item.id_empleado].email}>`
              container += `
              <div class='container-empleado'>
                <div>
                  <span class='bold-title'>Empleado: </span><span class='bold-emple'>${this.props.all_empleados[item.id_empleado].nombre} ${this.props.all_empleados[item.id_empleado].apellidos}</span>
                </div>
              </div>`
            })

            data.container = container;
            data.h1 = 'Empleados asignados';
            data.destinatarios = destinatarios;
            data.servicio = 'Linkbuilding de pago'

            if (Object.keys(newEmpleados).length > 0) {
              $.post(URL_EMPLEADOS_LG, data, (request, data) => {
                //console.log(request, data);
              })
            }



          }





          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        })
        .catch(err => {
          console.log(err);
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }

  deleteEmpleado = (id_empleado) => {
    var empleados_eliminados = this.state.empleados_eliminados //dotProp.set(this.state.empleados_eliminado, `${id_empleado}.eliminado` ,true);

    empleados_eliminados[id_empleado] = true

    var empleados = dotProp.delete(this.state.empleados, `${id_empleado}`);

    this.setState({ empleados, empleados_eliminados })
  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.empleados;
    } catch (e) { }

    var edited = false;
    if (this.props.empleados !== this.state.empleados) {
      edited = true;
    }

    return (
      <div className='sub-container-informacion'>
        {privilegio ?
          edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} />
            :
            <div className='settings-panels'>
              <div className='div-save-icon pr' onClick={() => this.openEmpleados()}>
                <i className="material-icons">add</i>
                {this.state.show_empleados ?
                  <PopUpLista selectOpcion={(id) => { this.addEmpleado(id); }} opciones={this.props.empleados_disponibles} _class='opciones-search-show position-add-enlaces' close={() => this.setState({ show_empleados: false })} /> : null
                }

              </div>
            </div>
          : null}



        <p className='title-informacion-alumno'>2. Empleados</p>

        <div className='ei-parent'>

          {this.state.empleados && Object.keys(this.state.empleados).length > 0 ?
            Object.entries(this.state.empleados).map(([k, e]) => {
              return (
                <EmpleadoItem key={k}
                  empleado={this.props.all_empleados[k]}
                  deleteEmpleado={() => this.deleteEmpleado(k)}
                  privilegio={privilegio}
                />
              )

            })
            :
            <div className="div_info_panel_linkbuilding">No hay empleados asignados</div>
          }

        </div>

      </div>
    )
  }
}

function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(InformacionEmpleados);