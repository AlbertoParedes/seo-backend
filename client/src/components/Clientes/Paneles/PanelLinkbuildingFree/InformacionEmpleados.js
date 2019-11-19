import React, { Component } from 'react'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import PopUpLista from '../../../Global/Popups/ListaOpciones'
import { URL_EMPLEADOS_LG } from '../../../Global/Data/constants'
import dotProp from 'dot-prop-immutable';
import * as functions from '../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import $ from 'jquery'
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
      this.props.all_empleados !== nextProps.all_empleados ||
      this.props.follows !== nextProps.follows ||
      this.props.nofollows !== nextProps.nofollows) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.empleados !== newProps.empleados) { this.setState({ empleados: newProps.empleados }) }
    if (this.props.all_empleados !== newProps.all_empleados) { this.setState({ all_empleados: newProps.all_empleados }) }
    if (this.props.follows !== newProps.follows) { this.setState({ follows: newProps.follows }) }
    if (this.props.nofollows !== newProps.nofollows) { this.setState({ nofollows: newProps.nofollows }) }
  }

  changeFollows = (num, id_empleado) => {

    var total_follows_asignado = 0
    Object.entries(this.state.empleados).forEach(([k, e]) => {
      if (k === id_empleado) {
        total_follows_asignado = total_follows_asignado + (+num)
      } else {
        total_follows_asignado = total_follows_asignado + (+e.follows)
      }
    })
    if (num === '' || (total_follows_asignado <= (+this.state.follows) && (+num) >= 0)) {
      var empleados = dotProp.set(this.state.empleados, `${id_empleado}.follows`, num.toString().trim() === '' ? '' : (+num));
      if (empleados === this.state.empleados) {//erreglar este apartado
      }
      this.setState({ empleados })
    } else {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Te estas pasando de follows' })
    }
  }

  changeNoFollows = (num, id_empleado) => {

    var total_follows_asignado = 0
    Object.entries(this.state.empleados).forEach(([k, e]) => {
      if (k === id_empleado) {
        total_follows_asignado = total_follows_asignado + (+num)
      } else {
        total_follows_asignado = total_follows_asignado + (+e.nofollows)
      }
    })
    if (num === '' || (total_follows_asignado <= (+this.state.nofollows) && (+num) >= 0)) {
      var empleados = dotProp.set(this.state.empleados, `${id_empleado}.nofollows`, num.toString().trim() === '' ? '' : (+num));
      if (empleados === this.state.empleados) {//erreglar este apartado
      }
      this.setState({ empleados })
    } else {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Te estas pasando de nofollows' })

    }
  }

  undoData = () => {
    this.setState({
      empleados: this.props.empleados,
      all_empleados: this.all_empleados,
      follows: this.props.follows,
      nofollows: this.props.nofollows,
      show_empleados: false,
      fecha: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)),
      empleados_eliminados: {}
    })
  }

  saveData = () => {

    var empleados = JSON.parse(JSON.stringify(this.state.empleados)), multiPath = {}, error = false;
    var totalFollows = 0, totalNoFollows = 0;

    Object.entries(empleados).forEach(([k, e]) => {
      if ((+e.follows) < 0 || e.follows.toString().includes('.') || e.follows.toString() === '' || (+e.nofollows) < 0 || e.nofollows.toString().includes('.') || e.nofollows.toString() === '') {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen errores en los campos' })
        error = true
      } else {

        totalFollows += e.follows ? (+e.follows) : 0
        totalNoFollows += e.nofollows ? (+e.nofollows) : 0

        empleados[k].follows = (+e.follows);
        empleados[k].nofollows = (+e.nofollows);

        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}/follows`] = (+e.follows)
        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}/nofollows`] = (+e.nofollows)

      }
    })

    if (Object.keys(empleados).length > 0 && ((+totalFollows) !== this.props.follows || (+totalNoFollows) !== this.props.nofollows) && Object.keys(this.props.empleados).length !== Object.keys(this.state.empleados_eliminados).length) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen errores en la suma de los enlaces' })
      return false
    }

    if (!error) {
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_free`] = empleados

      Object.entries(this.state.empleados_eliminados).forEach(([k, e]) => {

        try {
          if (this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados[k]) {

            if (this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados[k].enlaces_follows ||
              this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados[k].enlaces_nofollows) {
              multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}/eliminado`] = true

            } else {
              multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}`] = null
            }
          }
        } catch (e) { }

      })

      {/*LOGS*/ }
      let id_log;
      var timestamp = (+new Date());
      var id_empleado = this.props.empleado.id_empleado;

      if (this.props.empleados !== this.state.empleados) {
        id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito`).push().key;
        functions.createLogs(multiPath, timestamp, Object.keys(this.props.empleados).length > 0 ? this.props.empleados : false, Object.keys(this.state.empleados).length > 0 ? this.state.empleados : false, 'empleados', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito/${id_log}`)
      }

      const oldEmpleados = this.props.empleados, newEmpleados = this.state.empleados;

      db.update(multiPath)
        .then(() => {

          var data = {}
          if (oldEmpleados !== newEmpleados) {
            data.subject = `NUEVA ASIGNACIÓN DE EMPLEADOS (LG): ${this.props.cliente_seleccionado.web}`;
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
                <div>
                  <span class='bold-title'>Follows: </span><span class='bold-emple'>${item.follows}</span>
                </div>
                <div>
                  <span class='bold-title'>Nofollows: </span><span class='bold-emple'>${item.nofollows}</span>
                </div>
              </div>`
            })

            data.container = container;
            data.h1 = 'Empleados asignados';
            data.destinatarios = destinatarios;
            data.servicio = 'Linkbuilding gratuito'

            if (Object.keys(newEmpleados).length > 0) {
              $.post(URL_EMPLEADOS_LG, data, (request, data) => {
                //console.log(request, data);
              })
            }



          }


          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          this.undoData()
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })

    } else {

    }


  }

  openEmpleados = () => {
    this.setState({ show_empleados: true })
  }

  addEmpleado = (id) => {
    var empleados = this.state.empleados ? JSON.parse(JSON.stringify(this.state.empleados)) : {}
    if (!empleados[id]) {
      var multiPath = {}
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${id}/follows`] = 0
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${id}/nofollows`] = 0
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${id}/eliminado`] = null
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_free/${id}`] = {
        follows: 0,
        nofollows: 0,
        nombre: this.props.empleados_disponibles[id].valor,
        id_empleado: id
      }

      empleados[id] = {
        follows: 0,
        nofollows: 0,
        nombre: this.props.empleados_disponibles[id].valor,
        id_empleado: id
      }

      {/*LOGS*/ }
      let id_log;
      var timestamp = (+new Date());
      var id_empleado = this.props.empleado.id_empleado;

      if (this.props.empleados !== empleados) {
        id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito`).push().key;
        functions.createLogs(multiPath, timestamp, Object.keys(this.props.empleados).length > 0 ? this.props.empleados : false, Object.keys(empleados).length > 0 ? empleados : false, 'empleados', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito/${id_log}`)
      }


      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        })
        .catch(err => {
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
      privilegio = this.props.empleado.privilegios.linkbuilding_free.edit.empleados;
    } catch (e) { }

    var edited = false;
    if (JSON.stringify(this.props.empleados) !== JSON.stringify(this.state.empleados)) {
      edited = true;
    }

    var totalFollows = 0, totalNoFollows = 0;
    try {
      Object.entries(this.state.empleados).forEach(([k, e]) => {
        totalFollows += e.follows ? (+e.follows) : 0
        totalNoFollows += e.nofollows ? (+e.nofollows) : 0
      })
    } catch (e) {

    }
    totalFollows = (+totalFollows)
    totalNoFollows = (+totalNoFollows)

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
                  follows={e.follows}
                  nofollows={e.nofollows}
                  tipo='follows'
                  changeFollows={(num) => this.changeFollows(num, k)}
                  changeNoFollows={(num) => this.changeNoFollows(num, k)}
                  deleteEmpleado={() => this.deleteEmpleado(k)}
                  errorFollows={(+this.props.follows) === (+totalFollows) ? false : true}
                  errorNofollows={(+this.props.nofollows) === (+totalNoFollows) ? false : true}
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