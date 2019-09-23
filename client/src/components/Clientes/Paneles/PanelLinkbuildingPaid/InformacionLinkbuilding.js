import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import * as functions from '../../../Global/functions'
import { URLESTADOCLIENTE } from '../../../Global/Data/constants'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
import $ from 'jquery'
const db = firebase.database().ref();

class InformacionLinkbuilding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      bote: this.props.bote,
      beneficio: this.props.beneficio,
      inversion_mensual: this.props.inversion_mensual,
      porcentaje_perdida: this.props.porcentaje_perdida,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.status !== nextProps.status ||
      this.props.bote !== nextProps.bote ||
      this.props.beneficio !== nextProps.beneficio ||
      this.props.inversion_mensual !== nextProps.inversion_mensual ||
      this.props.porcentaje_perdida !== nextProps.porcentaje_perdida) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.status !== newProps.status) { this.setState({ status: newProps.status }) }
    if (this.props.bote !== newProps.bote) { this.setState({ bote: newProps.bote }) }
    if (this.props.beneficio !== newProps.beneficio) { this.setState({ beneficio: newProps.beneficio }) }
    if (this.props.inversion_mensual !== newProps.inversion_mensual) { this.setState({ inversion_mensual: newProps.inversion_mensual }) }
    if (this.props.porcentaje_perdida !== newProps.porcentaje_perdida) { this.setState({ porcentaje_perdida: newProps.porcentaje_perdida }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {
    var fechaMes = functions.getTodayDate()

    var preciosModificados = false
    try {
      if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[fechaMes].presupuestado_aparte || this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[fechaMes].subida_precios) {
        preciosModificados = true
      }
    } catch (e) { }


    var multiPath = {}

    /*if(this.props.bote!==this.state.bote){
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`]=(+this.state.bote)
    }*/
    var bote = (+this.props.bote)
    var beneficio = (+this.state.beneficio)
    var inversion_mensual = (+this.state.inversion_mensual)
    var porcentaje_perdida = (+this.state.porcentaje_perdida)

    var inversion_mensual_old = this.props.inversion_mensual ? (+this.props.inversion_mensual) : 0
    var beneficio_old = this.props.beneficio ? (100 - (+this.props.beneficio)) / 100 : 0


    if (preciosModificados && (inversion_mensual_old !== inversion_mensual || beneficio_old !== beneficio)) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se puede modificar porque hay precios modificados este mes' })
      return false
    }


    if (inversion_mensual_old !== inversion_mensual || beneficio_old !== beneficio) {
      //revertir la mensualidad añadida para poder restarle la nueva cantidad al bote
      bote = bote - inversion_mensual_old * beneficio_old;
      bote = bote + inversion_mensual * ((100 - beneficio) / 100)
    }

    if ((+this.props.bote) !== (+bote)) {
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`] = (+bote)
    } else if ((+this.props.bote) !== (+this.state.bote)) {
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`] = (+this.state.bote)
    }
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/activo`] = this.state.status === 'Activado' ? true : false

    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/inversion_mensual`] = (+inversion_mensual)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/beneficio`] = (+beneficio)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/porcentaje_perdida`] = (+porcentaje_perdida)

    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/inversion_mensual`] = (+inversion_mensual)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/beneficio`] = (+beneficio)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/porcentaje_perdida`] = (+porcentaje_perdida)

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.status !== this.state.status) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.status, this.state.status, 'status', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (inversion_mensual_old !== inversion_mensual) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, inversion_mensual_old, inversion_mensual, 'inversion_mensual', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (this.props.beneficio !== this.state.beneficio) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.beneficio ? this.props.beneficio : 0, this.state.beneficio ? this.state.beneficio : 0, 'beneficio', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if ((+this.props.porcentaje_perdida) !== porcentaje_perdida) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, (+this.props.porcentaje_perdida), porcentaje_perdida, 'porcentaje_perdida', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if ((+this.props.bote) !== (+bote)) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, (+this.props.bote), (+bote), 'bote', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }
    const oldStatus = this.props.status;
    const newStatus = this.state.status;
    db.update(multiPath)
      .then(() => {

        var data = {}
        if (oldStatus !== newStatus) {
          if (this.state.status === 'Activado') {
            data.subject = `LINKBUILDING DE PAGO ACTIVADO: ${this.props.clientes[this.props.id_cliente].web}`;
            data.status = 'good';
            data.frase = `El linkbuilding de pago del cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-good'>activado</span>`
          } else if (this.state.status === 'Desactivado') {
            data.subject = `LINKBUILDING DE PAGO DESCTIVADO: ${this.props.clientes[this.props.id_cliente].web}`
            data.status = 'warning'
            data.frase = `El linkbuilding de pago del cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-warning'>desactivado</span>`
          }

          data.empleado = this.props.empleado.nombre + " " + this.props.empleado.apellidos;
          data.cliente = this.props.clientes[this.props.id_cliente].web;

          $.post(URLESTADOCLIENTE, data, (request, data) => {
            //console.log(request, data);
          })

        }

        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })

      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })

  }

  cambiarNumeros = (valor, id) => {
    var num = functions.getNumber(valor)

    var decimales = num.toString().split('.');
    if (decimales[1] && decimales[1].length > 2) {
      return false
    }

    this.setState({ [id]: num.toString() })
  }


  render() {





    var bote = '0'
    bote = functions.checkNumber(this.state.bote)

    var inversion_mensual = '0'
    inversion_mensual = functions.checkNumber(this.state.inversion_mensual)

    var beneficio = '0'
    beneficio = functions.checkNumber(this.state.beneficio)

    var porcentaje_perdida = '0'
    porcentaje_perdida = functions.checkNumber(this.state.porcentaje_perdida)


    var edited = false;
    if (this.props.status !== this.state.status ||
      functions.checkNumber(this.props.bote) !== bote ||
      functions.checkNumber(this.props.beneficio) !== beneficio ||
      functions.checkNumber(this.props.inversion_mensual) !== inversion_mensual ||
      functions.checkNumber(this.props.porcentaje_perdida) !== porcentaje_perdida) {
      edited = true;
    }

    var privilegio = false, privilegio_bote = false;
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.change_inversion;
      privilegio_bote = this.props.empleado.privilegios.linkbuilding_paid.edit.change_bote;
    } catch (e) { }

    if (privilegio_bote && (functions.checkNumber(this.props.beneficio) !== beneficio || functions.checkNumber(this.props.inversion_mensual) !== inversion_mensual)) {
      privilegio_bote = false
    }
    if (privilegio && bote !== functions.checkNumber(this.props.bote)) {
      privilegio = false
    }



    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>1. Información del linkbuilding</p>

        <SimpleInputDesplegable type={`${privilegio ? '' : 'block'}`} _class='div_text_mitad' lista={data.estados_act_des} title='Estado' text={this.state.status} changeValor={(status) => this.setState({ status })} />

        {/*Estado y inversion_mensual*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio ? 'float' : 'block'}`} title='Inversión mensual (€)' text={inversion_mensual.toString()} changeValue={(inversion_mensual) => this.cambiarNumeros(inversion_mensual, 'inversion_mensual')} />
          <SimpleInput type={`${privilegio ? 'float' : 'block'}`} title='Beneficio (%)' text={beneficio.toString()} changeValue={(beneficio) => this.cambiarNumeros(beneficio, 'beneficio')} />
        </div>

        {/*INVERSION MENSUAL Y BENEFICIO*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio ? 'float' : 'block'}`} title='Porcentaje de pérdida (%)' text={porcentaje_perdida.toString()} changeValue={(porcentaje_perdida) => this.cambiarNumeros(porcentaje_perdida, 'porcentaje_perdida')} />
          <SimpleInput type={`${privilegio_bote ? 'float' : 'block'}`} _class_input='dni-input' title='Bote (€)' text={bote.toString()} changeValue={(bote) => this.cambiarNumeros(bote, 'bote')} />
        </div>


      </div>
    )
  }
}

function mapStateToProps(state) { return { clientes: state.clientes, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(InformacionLinkbuilding);
